import { useEffect, useState } from "react";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { calculateDistance, formatDistance } from "../utils/geo";
import BuyRequestModal from "../components/BuyRequestModal";
import PartRequestModal from "../components/PartRequestModal";
import ScrapDetailModal from "../components/ScrapDetailModal";
import { deleteStoragePhoto } from "../utils/storage";
import { subscribeToScraps, deleteScrapListing } from "../services/scrapService";
import {
  Package,
  Search,
  MapPin,
  PlusCircle,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Edit,
  Eye
} from "lucide-react";

function ScrapList() {
  const { isAdmin } = useAuth();
  const { coords } = useGeolocation();
  const [searchParams] = useSearchParams();

  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'price-asc' | 'price-desc' | 'distance'

  // Modals state
  const [selectedScrap, setSelectedScrap] = useState(null);
  const [buyingScrap, setBuyingScrap] = useState(null);
  const [showPartRequestModal, setShowPartRequestModal] = useState(false);

  // Unified Database & Real-time Listener
  useEffect(() => {
    const unsubscribe = subscribeToScraps((data) => {
      setScraps(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (scrap) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${scrap.name}"?`)) {
      return;
    }

    try {
      await deleteScrapListing(scrap.id);

      // Clean up storage photos if available
      if (Array.isArray(scrap.images)) {
        for (const imgUrl of scrap.images) {
          await deleteStoragePhoto(imgUrl);
        }
      } else if (scrap.image) {
        await deleteStoragePhoto(scrap.image);
      }

      toast.success("Listing removed successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete listing.");
    }
  };

  // Filter and sort listings
  const filteredAndSortedScraps = scraps
    .map((item) => {
      const distance = coords
        ? calculateDistance(coords.lat, coords.lng, item.latitude, item.longitude)
        : null;
      return { ...item, distanceKm: distance };
    })
    .filter((item) => {
      // Search keyword filter
      if (search.trim()) {
        const queryTerm = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(queryTerm);
        const matchesCat = item.category?.toLowerCase().includes(queryTerm);
        const matchesCompat = item.compatibility?.toLowerCase().includes(queryTerm);
        const matchesDesc = item.description?.toLowerCase().includes(queryTerm);
        if (!matchesName && !matchesCat && !matchesCompat && !matchesDesc) return false;
      }

      // Category filter
      if (categoryFilter !== "All" && item.category !== categoryFilter) return false;

      // Condition filter
      if (conditionFilter !== "All" && item.condition !== conditionFilter) return false;

      // Status filter
      if (statusFilter !== "All" && item.status !== statusFilter) return false;

      // Price limit filter
      if (maxPrice && Number(item.price) > Number(maxPrice)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "distance") {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      return 0; // Default: newest
    });

  const categories = [
    "All",
    "Engine Parts",
    "Body Parts",
    "Electronics",
    "Suspension",
    "Interior",
    "Wheels",
    "Other"
  ];

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "1280px" }}>
          
          {/* Marketplace Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: "8px" }}>
                Verified Salvage & Spares
              </span>
              <h1 style={{ fontSize: "2.4rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 6px" }}>
                Automotive Parts <span style={{ color: "#15803D" }}>Marketplace</span>
              </h1>
              <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>
                Authentic recovered OEM components, tested salvaged parts, and vehicle scrap from certified workshops.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowPartRequestModal(true)}
                className="btn-secondary"
                style={{ padding: "10px 18px", fontSize: "0.9rem" }}
              >
                <Search size={16} /> Can't Find a Part?
              </button>

              <Link
                to="/addscrap"
                className="btn-primary"
                style={{ padding: "10px 20px", fontSize: "0.9rem" }}
              >
                <PlusCircle size={17} /> List a Part / Scrap
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="premium-card" style={{ padding: "20px 24px", marginBottom: "32px" }}>
            
            {/* Top row: Search and sort */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div style={{ position: "relative", flex: "1 1 320px" }}>
                <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Search by part title, model (e.g. Swift, Nexon, Thar, Creta), or OEM..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px 11px 42px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.92rem",
                    color: "#0F172A",
                    backgroundColor: "#FFFFFF",
                    outline: "none"
                  }}
                />
              </div>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                style={{
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.88rem",
                  color: "#334155",
                  fontWeight: "600"
                }}
              >
                <option value="All">All Conditions</option>
                <option value="New">Brand New / OEM</option>
                <option value="Like New">Like New (Tested)</option>
                <option value="Used - Good">Used - Good Working</option>
                <option value="Salvaged / Scrap">Salvaged / Total Scrap</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.88rem",
                  color: "#334155",
                  fontWeight: "600"
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available Stock</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.88rem",
                  color: "#334155",
                  fontWeight: "600"
                }}
              >
                <option value="newest">Sort: Newest Added</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                {coords && <option value="distance">Sort: Nearest to My GPS</option>}
              </select>

              <input
                type="number"
                placeholder="Max Price (₹)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{
                  width: "140px",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.88rem",
                  color: "#0F172A"
                }}
              />

              {(search || categoryFilter !== "All" || conditionFilter !== "All" || maxPrice) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setConditionFilter("All");
                    setMaxPrice("");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    color: "#64748B",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  <RotateCcw size={14} /> Reset Filters
                </button>
              )}
            </div>

            {/* Category Chips Bar */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {categories.map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "0.84rem",
                      fontWeight: isSelected ? "700" : "500",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      border: isSelected ? "1px solid #15803D" : "1px solid #E2E8F0",
                      backgroundColor: isSelected ? "#ECFDF5" : "#FFFFFF",
                      color: isSelected ? "#15803D" : "#475569",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Listings Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#64748B" }}>
              <p>Loading genuine marketplace inventory...</p>
            </div>
          ) : filteredAndSortedScraps.length === 0 ? (
            <div className="premium-card" style={{ padding: "80px 20px", textAlign: "center" }}>
              <Package size={52} style={{ color: "#94A3B8", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px" }}>
                No Products Found Matching Your Criteria
              </h3>
              <p style={{ color: "#64748B", maxWidth: "460px", margin: "0 auto 24px", fontSize: "0.95rem" }}>
                Try adjusting your search terms, clearing category filters, or posting a specialized part sourcing request.
              </p>
              <button
                onClick={() => setShowPartRequestModal(true)}
                className="btn-primary"
              >
                Post Part Sourcing Request 🔍
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px"
            }}>
              {filteredAndSortedScraps.map((scrap) => {
                const isOwner = auth.currentUser?.uid === scrap.ownerId;
                const hasMultiplePhotos = Array.isArray(scrap.images) && scrap.images.length > 1;
                const primaryPhoto = scrap.image || (scrap.images && scrap.images[0]) || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600";

                return (
                  <div
                    key={scrap.id}
                    className="premium-card"
                    style={{
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {/* Image Area */}
                    <div
                      style={{ position: "relative", height: "200px", backgroundColor: "#0F172A", cursor: "pointer" }}
                      onClick={() => setSelectedScrap(scrap)}
                    >
                      <img
                        src={primaryPhoto}
                        alt={scrap.name}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600";
                        }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />

                      {/* Status Badge */}
                      <span style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: scrap.status === "Available" ? "#15803D" : "#EF4444",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        fontWeight: "700",
                        textTransform: "uppercase"
                      }}>
                        {scrap.status}
                      </span>

                      {/* Multiple Photos Badge */}
                      {hasMultiplePhotos && (
                        <span style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "rgba(15, 23, 42, 0.8)",
                          color: "#F8FAFC",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: "700"
                        }}>
                          📷 {scrap.images.length} Photos
                        </span>
                      )}

                      {/* Distance Badge */}
                      {scrap.distanceKm !== null && scrap.distanceKm !== undefined && (
                        <span style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          backgroundColor: "rgba(15, 23, 42, 0.85)",
                          color: "#34D399",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <MapPin size={12} /> {formatDistance(scrap.distanceKm)}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.78rem", color: "#15803D", fontWeight: "700", textTransform: "uppercase" }}>
                          {scrap.category}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: "600" }}>
                          {scrap.weight ? `${scrap.weight} kg` : ""}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedScrap(scrap)}
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "800",
                          color: "#0F172A",
                          margin: "2px 0 6px",
                          cursor: "pointer"
                        }}
                      >
                        {scrap.name}
                      </h3>

                      <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0 0 16px 0", flex: 1 }}>
                        {scrap.compatibility ? `Compatibility: ${scrap.compatibility}` : "Universal Fitment"}
                      </p>

                      {/* Pricing & Footer Actions */}
                      <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <div>
                            <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: "600" }}>
                              Asking Price
                            </span>
                            <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "#15803D" }}>
                              ₹{scrap.price?.toLocaleString()}
                            </div>
                          </div>

                          <span className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>
                            {scrap.condition || "Used"}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => setSelectedScrap(scrap)}
                            className="btn-secondary"
                            style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                          >
                            <Eye size={15} /> Inspect
                          </button>

                          {scrap.status === "Available" && !isOwner && (
                            <button
                              onClick={() => setBuyingScrap(scrap)}
                              className="btn-primary"
                              style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                            >
                              <ShoppingBag size={15} /> Make Offer
                            </button>
                          )}

                          {(isOwner || isAdmin) && (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <Link
                                to={`/edit/${scrap.id}`}
                                style={{
                                  padding: "8px",
                                  borderRadius: "8px",
                                  border: "1px solid #E2E8F0",
                                  color: "#475569",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                                title="Edit listing"
                              >
                                <Edit size={15} />
                              </Link>
                              <button
                                onClick={() => handleDelete(scrap)}
                                style={{
                                  padding: "8px",
                                  borderRadius: "8px",
                                  border: "1px solid #FECACA",
                                  backgroundColor: "#FEF2F2",
                                  color: "#DC2626",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                                title="Delete listing"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Detail Modal */}
      {selectedScrap && (
        <ScrapDetailModal
          scrap={selectedScrap}
          userDistance={selectedScrap.distanceKm}
          onClose={() => setSelectedScrap(null)}
          onBuyClick={() => {
            setBuyingScrap(selectedScrap);
            setSelectedScrap(null);
          }}
        />
      )}

      {/* Buy Request Offer Modal */}
      {buyingScrap && (
        <BuyRequestModal
          scrap={buyingScrap}
          onClose={() => setBuyingScrap(null)}
        />
      )}

      {/* Part Sourcing Request Modal */}
      {showPartRequestModal && (
        <PartRequestModal
          onClose={() => setShowPartRequestModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default ScrapList;
