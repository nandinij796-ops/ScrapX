import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { compressImage, validateImageFile } from "./imageCompressor";

/**
 * Converts a Blob to a base64 Data URL as a resilient fallback
 */
function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads an array of image files to Firebase Storage under `scraps/{userId}/`
 * with resilient fallback to compressed base64 if Firebase Storage bucket is uninitialized or blocked.
 * @param {string} userId - User ID of the owner
 * @param {File[]} files - Array of image files to upload
 * @param {function} onOverallProgress - Callback for total progress (0-100)
 * @returns {Promise<string[]>} Array of download URLs or resilient base64 image strings
 */
export async function uploadListingPhotos(userId, files, onOverallProgress) {
  if (!files || files.length === 0) return [];
  if (!userId) throw new Error("Authentication required to upload photos.");

  const uploadResults = [];
  const totalFiles = files.length;
  let completedFiles = 0;

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];

    // 1. Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Compress client-side
    const compressedBlob = await compressImage(file);

    // 3. Attempt Firebase Storage upload
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `scraps/${userId}/${Date.now()}_${i}_${sanitizedName}`;
      const storageRef = ref(storage, storagePath);

      await new Promise((resolve, reject) => {
        let isSettled = false;
        const uploadTask = uploadBytesResumable(storageRef, compressedBlob, {
          contentType: "image/jpeg",
        });

        const timer = setTimeout(() => {
          if (!isSettled) {
            isSettled = true;
            try { uploadTask.cancel(); } catch { /* ignore cancel err */ }
            reject(new Error("Storage upload timed out; saving photo in resilient local format"));
          }
        }, 4000);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const filePercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onOverallProgress) {
              const overall = ((completedFiles * 100) + filePercent) / totalFiles;
              onOverallProgress(Math.round(overall));
            }
          },
          (error) => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              console.warn("Storage upload task error:", error);
              reject(error);
            }
          },
          async () => {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                uploadResults.push(downloadUrl);
                completedFiles++;
                if (onOverallProgress) {
                  onOverallProgress(Math.round((completedFiles / totalFiles) * 100));
                }
                resolve();
              } catch (err) {
                reject(err);
              }
            }
          }
        );
      });
    } catch (storageErr) {
      console.warn("Firebase Storage unavailable or timed out, using resilient compressed format:", storageErr.message);
      // Fallback: Convert compressed blob to base64 so user's uploaded photo is NEVER lost!
      const base64Url = await blobToBase64(compressedBlob);
      uploadResults.push(base64Url);
      completedFiles++;
      if (onOverallProgress) {
        onOverallProgress(Math.round((completedFiles / totalFiles) * 100));
      }
    }
  }

  return uploadResults;
}

/**
 * Attempts to safely delete a photo from Firebase Storage given its URL or storage path
 * @param {string} urlOrPath
 */
export async function deleteStoragePhoto(urlOrPath) {
  if (!urlOrPath) return;
  try {
    if (urlOrPath.includes("firebasestorage.googleapis.com")) {
      const photoRef = ref(storage, urlOrPath);
      await deleteObject(photoRef);
    }
  } catch (err) {
    console.warn("Storage deletion notice:", err.message);
  }
}
