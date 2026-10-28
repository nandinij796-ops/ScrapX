import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import PhotoUploader from "../components/PhotoUploader";
import LocationPicker from "../components/LocationPicker";
import { uploadListingPhotos } from "../utils/storage";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuth } from "../context/AuthContext";
import { getScrapById, updateScrapListing } from "../services/scrapService";
import { Edit, Save } from "lucide-react";

function EditScrap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchScrap = async () => {
      try {
        const data = await getScrapById(id);

        if (!data) {
          toast.error("Listing not found.");
          navigate("/scraps");
          return;
        }

        // Security check
        if (!auth.currentUser || (data.ownerId && data.ownerId !== auth.currentUser.uid && !isAdmin)) {
          toast.error("You are not authorized to edit this listing ❌");
          navigate("/scraps");
          return;
        }

        setName(data.name || "");
        setCategory(data.category || "Engine Parts");
        setCompatibility(data.compatibility || "");
        setCondition(data.condition || "Used - Good");
        setWeight(data.weight || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
        setStatus(data.status || "Available");

        if (Array.isArray(data.images) && data.images.length > 0) {
          setExistingImages(data.images);
        } else if (data.image) {
          setExistingImages([data.image]);
        }

        if (data.latitude && data.longitude) {
          setManualLocation({
            lat: data.latitude,
            lng: data.longitude,
            name: data.locationName || ""
          });
        }
      } catch (err) {
        console.error("Error fetching scrap:", err);
        toast.error("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchScrap();
  }, [id, navigate, isAdmin, setManualLocation]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter a part name.");
    if (!price || Number(price) <= 0) return toast.error("Please enter a valid price.");
    if (!weight || Number(weight) <= 0) return toast.error("Please enter a valid weight.");

    if (existingImages.length === 0 && pendingFiles.length === 0) {
      return toast.error("Please include at least one photo for the listing.");
    }

    setSubmitting(true);
    try {
      let finalImages = [...existingImages];

      if (pendingFiles.length > 0) {
        toast.loading("Uploading new photos...", { id: "edit-upload" });
        const newUrls = await uploadListingPhotos(
          auth.currentUser.uid,
          pendingFiles,
          (pct) => setUploadProgress(pct)
        );
        toast.dismiss("edit-upload");
        finalImages = [...finalImages, ...newUrls];
      }

      const primaryImage = finalImages[0] || "";

      await updateScrapListing(id, {
        name: name.trim(),
        category,
        compatibility: compatibility.trim(),
        condition,
        weight: Number(weight),
        price: Number(price),
        description: description.trim(),
        images: finalImages,
        image: primaryImage,
        status,
        ...(coords ? {
          latitude: coords.lat,
          longitude: coords.lng,
          locationName: locationName || "Location specified",
        } : {}),
      });

      toast.success("Listing Updated Successfully 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update listing.");
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

  if (loading) {
    return (
      <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#64748B" }}>
          <p>Loading listing details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "740px" }}>
          
          <div className="premium-card" style={{ padding: "40px" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span className="badge badge-success" style={{ marginBottom: "10px" }}>
                Edit Marketplace Item
              </span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "800", margin: "4px 0 8px 0", color: "#0F172A" }}>
                Update <span style={{ color: "#15803D" }}>Listing Specs</span>
              </h2>
              <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>
                Modify component specifications, add extra photos, or update listing availability status.
              </p>
            </div>

            <form onSubmit={handleUpdate}>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                style={{ ...inputStyle, resize: "vertical" }}
                disabled={submitting}
              />

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
                <Save size={18} />
                {submitting ? "Updating Listing..." : "Save Updated Specs"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EditScrap;
