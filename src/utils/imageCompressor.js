/**
 * Client-side image compression and validation utility for ScrapX
 */

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const QUALITY = 0.82;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/**
 * Validates an image file before processing
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `"${file.name}" is not a supported format. Please upload JPG, PNG, or WebP.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" exceeds 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }
  return { valid: true };
}

/**
 * Compresses an image file using an HTML Canvas element
 * @param {File} file
 * @returns {Promise<Blob>}
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    // If it's already small (< 300KB) and not huge in dimensions, we can return as is
    if (file.size < 300 * 1024 && file.type === "image/jpeg") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to compressed JPEG blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback to original file if canvas conversion fails
              resolve(file);
            }
          },
          "image/jpeg",
          QUALITY
        );
      };
      img.onerror = () => reject(new Error("Failed to load image for compression."));
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
  });
}
