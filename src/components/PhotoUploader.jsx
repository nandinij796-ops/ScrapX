import { useState, useRef } from "react";
import { validateImageFile } from "../utils/imageCompressor";
import { toast } from "react-hot-toast";
import {
  UploadCloud,
  Camera,
  Sparkles,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const MAX_IMAGES = 5;

// Sample vehicle scrap photos for instant 1-click testing
const SAMPLE_PHOTOS = [
  {
    name: "Engine Assembly",
    url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Alloy Wheel",
    url: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Steel Bumper",
    url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "LED Headlight",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  }
];

function PhotoUploader({
  existingImages = [],
  onExistingImagesChange,
  pendingFiles = [],
  onPendingFilesChange,
  uploadProgress = null,
  disabled = false,
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const totalCount = existingImages.length + pendingFiles.length;

  const handleFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    const fileList = Array.from(incomingFiles);
    const availableSlots = MAX_IMAGES - totalCount;

    if (availableSlots <= 0) {
      toast.error(`Maximum of ${MAX_IMAGES} photos reached.`);
      return;
    }

    const validNewFiles = [];
    for (const file of fileList) {
      if (validNewFiles.length >= availableSlots) {
        toast(`Only first ${availableSlots} image(s) added (limit: ${MAX_IMAGES}).`, { icon: "ℹ️" });
        break;
      }

      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }

      const isDuplicate = pendingFiles.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (!isDuplicate) {
        file.previewUrl = URL.createObjectURL(file);
        validNewFiles.push(file);
      }
    }

    if (validNewFiles.length > 0) {
      onPendingFilesChange([...pendingFiles, ...validNewFiles]);
      toast.success(`${validNewFiles.length} photo(s) selected!`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removePending = (index) => {
    const file = pendingFiles[index];
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    const updated = [...pendingFiles];
    updated.splice(index, 1);
    onPendingFilesChange(updated);
  };

  const removeExisting = (index) => {
    if (!onExistingImagesChange) return;
    const updated = [...existingImages];
    updated.splice(index, 1);
    onExistingImagesChange(updated);
  };

  const movePending = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= pendingFiles.length) return;
    const updated = [...pendingFiles];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    onPendingFilesChange(updated);
  };

  const addSamplePhoto = (sample) => {
    if (totalCount >= MAX_IMAGES) {
      toast.error(`Maximum of ${MAX_IMAGES} photos reached.`);
      return;
    }
    if (existingImages.includes(sample.url)) {
      toast("Sample already added.", { icon: "ℹ️" });
      return;
    }
    if (onExistingImagesChange) {
      onExistingImagesChange([...existingImages, sample.url]);
      toast.success(`Attached ${sample.name}`);
    }
  };

  const handleAddUrl = (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;
    if (totalCount >= MAX_IMAGES) {
      toast.error(`Maximum of ${MAX_IMAGES} photos reached.`);
      return;
    }
    if (onExistingImagesChange) {
      onExistingImagesChange([...existingImages, urlInput.trim()]);
      setUrlInput("");
      toast.success("Image URL added to listing!");
    }
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <label style={{ display: "block", color: "#0F172A", fontWeight: "700", fontSize: "0.95rem" }}>
          Product Photos <span style={{ color: "#15803D", fontSize: "0.85rem" }}>({totalCount}/{MAX_IMAGES})</span>
        </label>
        {totalCount > 0 && (
          <span style={{ fontSize: "0.8rem", color: "#15803D", fontWeight: "700" }}>
            ✓ {totalCount} photo(s) attached
          </span>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        multiple
        style={{ display: "none" }}
        disabled={disabled || totalCount >= MAX_IMAGES}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        disabled={disabled || totalCount >= MAX_IMAGES}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Interactive Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={(e) => {
          if (e.target.tagName !== "BUTTON" && totalCount < MAX_IMAGES && !disabled) {
            fileInputRef.current?.click();
          }
        }}
        style={{
          border: `2px dashed ${dragActive ? "#15803D" : "#CBD5E1"}`,
          borderRadius: "14px",
          padding: "28px 16px",
          textAlign: "center",
          background: dragActive ? "#ECFDF5" : "#F8FAFC",
          transition: "all 0.2s ease",
          cursor: totalCount >= MAX_IMAGES ? "not-allowed" : "pointer",
        }}
      >
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "#ECFDF5",
          color: "#15803D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 10px"
        }}>
          <UploadCloud size={24} />
        </div>
        <p style={{ margin: "0 0 4px 0", color: "#0F172A", fontWeight: "700", fontSize: "0.95rem" }}>
          Click to upload photos from your device or drag & drop
        </p>
        <p style={{ margin: "0 0 16px 0", color: "#64748B", fontSize: "0.82rem" }}>
          Supports JPG, PNG, WEBP (Max 5 photos). Automatically compressed for fast loading.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={disabled || totalCount >= MAX_IMAGES}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <UploadCloud size={15} /> Select Files
          </button>

          <button
            type="button"
            disabled={disabled || totalCount >= MAX_IMAGES}
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <Camera size={15} /> Take Photo
          </button>
        </div>
      </div>

      {/* Quick 1-Click Samples */}
      <div style={{ marginTop: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={13} style={{ color: "#15803D" }} /> Quick test samples:
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {SAMPLE_PHOTOS.map((sample, sIdx) => (
            <button
              key={sIdx}
              type="button"
              disabled={disabled || totalCount >= MAX_IMAGES}
              onClick={() => addSamplePhoto(sample)}
              style={{
                padding: "5px 10px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                color: "#475569",
                fontSize: "0.78rem",
                fontWeight: "600",
                cursor: totalCount >= MAX_IMAGES ? "not-allowed" : "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#15803D"; e.currentTarget.style.color = "#15803D"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}
            >
              + {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Image URL input */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <LinkIcon size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input
            type="url"
            placeholder="Or paste an image web link (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={disabled || totalCount >= MAX_IMAGES}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              color: "#0F172A",
              fontSize: "0.85rem",
              outline: "none"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={disabled || !urlInput.trim() || totalCount >= MAX_IMAGES}
          className="btn-secondary"
          style={{ padding: "8px 14px", fontSize: "0.82rem" }}
        >
          Add URL
        </button>
      </div>

      {/* Progress Bar */}
      {uploadProgress !== null && (
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#15803D", fontSize: "0.82rem", fontWeight: "700", marginBottom: "4px" }}>
            <span>Compressing & uploading photos...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                height: "100%",
                background: "#15803D",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Previews Grid */}
      {(existingImages.length > 0 || pendingFiles.length > 0) && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "0.82rem", color: "#64748B", marginBottom: "8px", fontWeight: "600" }}>
            Attached Photo Previews (First photo is your Primary Marketplace Cover):
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "10px",
          }}>
            {/* Existing images */}
            {existingImages.map((url, idx) => (
              <div
                key={`existing-${idx}`}
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: idx === 0 && pendingFiles.length === 0 ? "2px solid #15803D" : "1px solid #CBD5E1",
                  background: "#F8FAFC",
                  height: "90px",
                }}
              >
                <img
                  src={url}
                  alt={`Listing ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300";
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span style={{
                  position: "absolute",
                  top: "4px",
                  left: "4px",
                  background: idx === 0 && pendingFiles.length === 0 ? "#15803D" : "rgba(15, 23, 42, 0.75)",
                  color: "white",
                  fontSize: "0.62rem",
                  fontWeight: "700",
                  padding: "1px 5px",
                  borderRadius: "4px",
                }}>
                  {idx === 0 && pendingFiles.length === 0 ? "★ Cover" : `#${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeExisting(idx)}
                  disabled={disabled}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "20px",
                    height: "20px",
                    background: "rgba(220, 38, 38, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Pending local files */}
            {pendingFiles.map((file, idx) => {
              const isCover = existingImages.length === 0 && idx === 0;
              return (
                <div
                  key={`pending-${idx}`}
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: isCover ? "2px solid #15803D" : "1px solid #CBD5E1",
                    background: "#F8FAFC",
                    height: "90px",
                  }}
                >
                  <img
                    src={file.previewUrl}
                    alt={`Preview ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span style={{
                    position: "absolute",
                    top: "4px",
                    left: "4px",
                    background: isCover ? "#15803D" : "rgba(15, 23, 42, 0.75)",
                    color: "white",
                    fontSize: "0.62rem",
                    fontWeight: "700",
                    padding: "1px 5px",
                    borderRadius: "4px",
                  }}>
                    {isCover ? "★ Cover" : `#${existingImages.length + idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePending(idx)}
                    disabled={disabled}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "20px",
                      height: "20px",
                      background: "rgba(220, 38, 38, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    ✕
                  </button>

                  {/* Reorder arrows */}
                  <div style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "2px",
                    right: "2px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); movePending(idx, idx - 1); }}
                        style={{
                          background: "rgba(15, 23, 42, 0.8)",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          padding: "1px 4px",
                          fontSize: "9px",
                          cursor: "pointer",
                        }}
                      >
                        ◀
                      </button>
                    )}
                    {idx < pendingFiles.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); movePending(idx, idx + 1); }}
                        style={{
                          background: "rgba(15, 23, 42, 0.8)",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          padding: "1px 4px",
                          fontSize: "9px",
                          cursor: "pointer",
                          marginLeft: "auto",
                        }}
                      >
                        ▶
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoUploader;
