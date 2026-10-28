import { collection, addDoc, getDocs, doc, updateDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_PICKUPS_KEY = "scrapx_pickups_v1";

const INITIAL_SEED_PICKUPS = [
  {
    id: "pickup_seed_101",
    bookingRef: "PU-2026-7842",
    userId: "demo_seller_1",
    userName: "Rajesh Sharma",
    userPhone: "+91 98112 34567",
    userEmail: "rajesh.auto@gmail.com",
    address: "Plot 42, Udyog Vihar Phase 4",
    city: "Gurugram, Haryana",
    date: "2026-10-28",
    timeSlot: "10:00 AM - 01:00 PM",
    materialId: "iron",
    materialName: "Cast Iron & Light Scrap",
    estimatedWeight: 140,
    estimatedPrice: 5320,
    instructions: "Scrap engine components stacked near the loading dock. Gate entry passcode: 4421.",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "pickup_seed_102",
    bookingRef: "PU-2026-9021",
    userId: "demo_seller_2",
    userName: "Amit Verma",
    userPhone: "+91 98991 22334",
    userEmail: "amit.verma@outlook.com",
    address: "Shop 14, Mayapuri Phase 2 Scrap Cluster",
    city: "New Delhi, Delhi",
    date: "2026-10-29",
    timeSlot: "02:00 PM - 05:00 PM",
    materialId: "aluminium",
    materialName: "Aluminium & Alloy Components",
    estimatedWeight: 65,
    estimatedPrice: 11375,
    instructions: "Alloy wheels and gearbox casings sorted in blue crates. Forklift available on site.",
    status: "Scheduled",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "pickup_seed_103",
    bookingRef: "PU-2026-6410",
    userId: "demo_seller_1",
    userName: "Vikram Malhotra",
    userPhone: "+91 97110 99887",
    userEmail: "vikram.m@gmail.com",
    address: "B-12, Sector 63",
    city: "Noida, Uttar Pradesh",
    date: "2026-10-25",
    timeSlot: "09:00 AM - 12:00 PM",
    materialId: "battery",
    materialName: "Lead-Acid Car Batteries",
    estimatedWeight: 90,
    estimatedPrice: 9450,
    instructions: "8 truck batteries on wooden pallets. Battery acid contained in protective bins.",
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export function getLocalPickups() {
  try {
    const raw = localStorage.getItem(LOCAL_PICKUPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PICKUPS_KEY, JSON.stringify(INITIAL_SEED_PICKUPS));
      return [...INITIAL_SEED_PICKUPS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SEED_PICKUPS];
  } catch (err) {
    console.warn("Error reading local pickups:", err);
    return [...INITIAL_SEED_PICKUPS];
  }
}

export function saveLocalPickup(pickup) {
  try {
    const current = getLocalPickups();
    const existingIdx = current.findIndex((p) => p.id === pickup.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...pickup };
    } else {
      updated = [pickup, ...current];
    }
    localStorage.setItem(LOCAL_PICKUPS_KEY, JSON.stringify(updated));
    return pickup;
  } catch (err) {
    console.error("Failed to save local pickup:", err);
    return pickup;
  }
}

/**
 * Creates a new doorstep scrap pickup appointment
 */
export async function createPickupBooking(pickupData) {
  const bookingRef = `PU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  let docId = `pickup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let firestoreSaved = false;

  const payload = {
    ...pickupData,
    bookingRef,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "pickups"), {
      ...payload,
      timestamp: serverTimestamp(),
    });
    docId = docRef.id;
    firestoreSaved = true;
  } catch (err) {
    console.warn("Firestore pickup booking notice (saved locally):", err.message);
  }

  const finalPickup = {
    id: docId,
    ...payload,
    firestoreSynced: firestoreSaved,
  };

  saveLocalPickup(finalPickup);
  return finalPickup;
}

/**
 * Retrieves pickups for a specific user (or all if admin)
 */
export async function getUserPickups(userId, isAdmin = false) {
  const localList = getLocalPickups();
  let userLocal = isAdmin ? localList : localList.filter((p) => p.userId === userId || !p.userId || p.userId === "guest_seller");

  try {
    let q = collection(db, "pickups");
    if (!isAdmin && userId) {
      q = query(collection(db, "pickups"), where("userId", "==", userId));
    }
    const snap = await getDocs(q);
    const firestoreItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const firestoreIds = new Set(firestoreItems.map((f) => f.id));
    const unsynced = userLocal.filter((loc) => !firestoreIds.has(loc.id));
    return [...unsynced, ...firestoreItems];
  } catch (err) {
    console.warn("Notice loading pickups from Firestore, using local:", err.message);
    return userLocal;
  }
}

/**
 * Updates pickup appointment status (e.g. Cancelled, In Progress, Completed)
 */
export async function updatePickupStatus(pickupId, newStatus) {
  const localList = getLocalPickups();
  const target = localList.find((p) => p.id === pickupId);
  if (target) {
    target.status = newStatus;
    saveLocalPickup(target);
  }

  try {
    if (!pickupId.startsWith("pickup_seed_") && !pickupId.startsWith("pickup_")) {
      await updateDoc(doc(db, "pickups", pickupId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn("Firestore pickup status update notice:", err.message);
    return { success: true, localOnly: true };
  }
}
