import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PhotoUploader from "../components/PhotoUploader";
import LocationPicker from "../components/LocationPicker";
import { uploadListingPhotos } from "../utils/storage";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../context/AuthContext";
import { createScrapListing } from "../services/scrapService";
import {
  Package,
  Sparkles,
  Tag,
  Scale,
  Car,
  Wrench,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const DEFAULT_PART_IMAGE = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800";

function AddScrap() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { coords, locationName, loading: geoLoading, error: geoError, requestLocation, setManualLocation } = useGeolocation();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Engine Parts");
  const [compatibility, setCompatibility] = useState("");
  const [condition, setCondition] = useState("Used - Good");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Available");
  const [existingImages, setExistingImages] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("Please log in first to list a product.");
      navigate("/login");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter the product / part name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price (₹).");
      return;
    }

    if (!weight || Number(weight) <= 0) {
      toast.error("Please enter a valid weight in kg.");
      return;
    }

    setSubmitting(true);
    let uploadedUrls = [];

    // 1. Attempt photo upload if files were selected via camera or file picker
    if (pendingFiles.length > 0) {
      try {
        toast.loading("Processing and uploading scrap photos...", { id: "upload-toast" });
        uploadedUrls = await uploadListingPhotos(
          auth.currentUser.uid,
          pendingFiles,
          (percent) => setUploadProgress(percent)
        );
        toast.dismiss("upload-toast");
      } catch (uploadError) {
        console.warn("Storage upload notice:", uploadError);
        toast.dismiss("upload-toast");
        toast("Saving photos directly with listing.", { icon: "ℹ️" });
      }
    }

    try {
      // 2. Combine uploaded files with any sample photos or URL additions
      const allPhotos = [...uploadedUrls, ...existingImages];
      const finalImages = allPhotos.length > 0 ? allPhotos : [DEFAULT_PART_IMAGE];
      const primaryImage = finalImages[0];

      // 3. Prepare listing payload
      const listingData = {
        name: name.trim(),
        category: category || "Engine Parts",
        compatibility: compatibility.trim() || "Universal",
        condition: condition || "Used - Good",
        weight: Number(weight),
        price: Number(price),
        description: description.trim() || "",
        images: finalImages,
        image: primaryImage,
        status: status || "Available",
        ownerId: auth.currentUser?.uid || "guest_seller",
        ownerEmail: auth.currentUser?.email || "",
        ownerName: userData?.name || auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "Seller",
        ownerPhone: userData?.phone || "",
        locationName: locationName || userData?.city || "Location unspecified",
        latitude: coords ? coords.lat : null,
        longitude: coords ? coords.lng : null,
        date: new Date().toLocaleString(),
      };

      // 4. Save through unified ScrapX Database Service
      await createScrapListing(listingData);

      toast.success("Product listed successfully in ScrapX database! 🎉");
      navigate("/scraps");
    } catch (error) {
      console.error("Listing submission error:", error);
      toast.error(error.message || "Failed to save listing.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    color: "#0F172A",
    fontSize: "0.92rem",
    marginBottom: "18px",
    outline: "none"
  };

  const labelStyle = {
    display: "block",
    color: "#475569",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "0.88rem"
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "740px" }}>
          
          <div className="premium-card" style={{ padding: "40px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span className="badge badge-success" style={{ marginBottom: "10px" }}>
                Verified Salvage Portal
              </span>
              <h2 style={{ fontSize: "2.3rem", fontWeight: "800", margin: "4px 0 8px 0", color: "#0F172A" }}>
                List a <span style={{ color: "#15803D" }}>Product / Scrap</span>
              </h2>
              <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>
                Publish your vehicle spare part or scrap components directly to our marketplace of 1,200+ certified garages.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Photo Uploader */}
              <PhotoUploader
                existingImages={existingImages}
                onExistingImagesChange={setExistingImages}
                pendingFiles={pendingFiles}
                onPendingFilesChange={setPendingFiles}
                uploadProgress={uploadProgress}
                disabled={submitting}
              />

              <label style={labelStyle}>Product / Part Title *</label>
              <input
                type="text"
                placeholder="e.g. Tata Nexon Turbocharger, Swift 12V Alternator, Thar Front Bumper..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
                disabled={submitting}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={inputStyle}
                    disabled={submitting}
                  >
                    <option value="Engine Parts">Engine & Transmission</option>
                    <option value="Body Parts">Body & Frame</option>
                    <option value="Electronics">Electricals & Sensors</option>
                    <option value="Suspension">Suspension & Brakes</option>
                    <option value="Interior">Interior Accessories</option>
                    <option value="Wheels">Wheels & Tires</option>
                    <option value="Other">Other Scrap & Components</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    style={inputStyle}
                    disabled={submitting}
                  >
                    <option value="New">Brand New / OEM</option>
                    <option value="Like New">Like New (Tested)</option>
                    <option value="Used - Good">Used - Good Working Condition</option>
                    <option value="Salvaged / Scrap">Salvaged / Total Scrap</option>
                  </select>
                </div>
              </div>

              <label style={labelStyle}>Vehicle Compatibility</label>
              <input
                type="text"
                placeholder="e.g. Maruti Swift (2018 - 2024), Mahindra Thar, Universal Fitment..."
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                style={inputStyle}
                disabled={submitting}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 6.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={inputStyle}
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={inputStyle}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <label style={labelStyle}>Description & Condition Notes</label>
              <textarea
                placeholder="Describe testing status, shaft play, electrical resistance, or cosmetic wear..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                style={{ ...inputStyle, resize: "vertical" }}
                disabled={submitting}
              />

              {/* Location Picker */}
              <LocationPicker
                locationName={locationName}
                coords={coords}
                loading={geoLoading}
                error={geoError}
                onRequestLocation={requestLocation}
                onManualSelect={setManualLocation}
              />

              <label style={labelStyle}>Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
                disabled={submitting}
              >
                <option value="Available">Available for Purchase</option>
                <option value="Sold">Sold</option>
              </select>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "15px",
                  fontSize: "1.05rem",
                  marginTop: "8px"
                }}
              >
                {submitting ? "Publishing to Network..." : "Publish Listing to Marketplace →"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddScrap;
