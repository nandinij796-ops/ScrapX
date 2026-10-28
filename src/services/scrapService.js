import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_SCRAPS_KEY = "scrapx_persistent_scraps_v2";

// Authentic initial automotive scrap parts so marketplace is never blank
const DEFAULT_SEED_SCRAPS = [
  {
    id: "seed_scrap_1",
    name: "Tata Nexon 1.5L Turbocharger Assembly",
    category: "Engine Parts",
    condition: "Used - Good",
    compatibility: "Tata Nexon Diesel (2018 - 2023)",
    price: 14500,
    weight: 7.2,
    description: "Genuine OEM Garrett turbocharger pulled from accident vehicle. Tested for shaft play and turbine integrity. Clean oil lines, ready to install.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=800",
    ],
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
    status: "Available",
    ownerName: "Apex Salvage Hub",
    ownerPhone: "+91 98230 45678",
    ownerEmail: "apex.salvage@scrapx.in",
    locationName: "Mayapuri Scrap Yard, New Delhi",
    latitude: 28.6289,
    longitude: 77.1195,
    date: "14/10/2026, 10:30:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed_scrap_2",
    name: "Mahindra Thar CRDe Front Steel Bumper Assembly",
    category: "Body Parts",
    condition: "Like New",
    compatibility: "Mahindra Thar (2020 - 2024)",
    price: 6800,
    weight: 18.5,
    description: "Offroad heavy duty front steel bumper with fog lamp housings and integrated tow hitch mount. Minor cosmetic scratches, no bends or cracks.",
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    ],
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    status: "Available",
    ownerName: "Northstar Motors",
    ownerPhone: "+91 98765 12340",
    ownerEmail: "northstar@scrapx.in",
    locationName: "Sector 16, Noida",
    latitude: 28.5800,
    longitude: 77.3300,
    date: "14/10/2026, 12:45:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed_scrap_3",
    name: "Bosch 12V 90A Alternator (Maruti Suzuki Swift / Dzire)",
    category: "Electronics",
    condition: "Used - Good",
    compatibility: "Maruti Swift, Dzire, Baleno (K12 Engine)",
    price: 3600,
    weight: 5.4,
    description: "OEM Bosch 90-ampere alternator. Voltage regulator and diodes load-tested and working at steady 14.2V output. Pulley in perfect shape.",
    images: [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800",
    ],
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800",
    status: "Available",
    ownerName: "Gupta Auto Spares",
    ownerPhone: "+91 97112 33445",
    ownerEmail: "gupta.spares@scrapx.in",
    locationName: "Kashmere Gate, Delhi",
    latitude: 28.6670,
    longitude: 77.2280,
    date: "13/10/2026, 16:15:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed_scrap_4",
    name: "Hyundai Creta 17-Inch Diamond Cut Alloy Wheels (Set of 4)",
    category: "Wheels",
    condition: "Like New",
    compatibility: "Hyundai Creta, Kia Seltos (5x114.3 PCD)",
    price: 18000,
    weight: 38.0,
    description: "Original OEM Hyundai diamond cut alloys without bends, structural repairs or curb rash. Includes 4 Hyundai center caps.",
    images: [
      "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800"
    ],
    image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800",
    status: "Available",
    ownerName: "Kurla Auto Dismantlers",
    ownerPhone: "+91 99887 66554",
    ownerEmail: "kurla.dismantle@scrapx.in",
    locationName: "Kurla CST Road, Mumbai",
    latitude: 19.0728,
    longitude: 72.8797,
    date: "12/10/2026, 14:00:00",
    createdAt: new Date().toISOString(),
  }
];

/**
 * Retrieves all items saved in local storage
 */
export function getLocalScraps() {
  try {
    const raw = localStorage.getItem(LOCAL_SCRAPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SCRAPS_KEY, JSON.stringify(DEFAULT_SEED_SCRAPS));
      return [...DEFAULT_SEED_SCRAPS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_SEED_SCRAPS];
  } catch (err) {
    console.warn("Error reading local scraps repository:", err);
    return [...DEFAULT_SEED_SCRAPS];
  }
}

/**
 * Saves or updates a scrap item in local storage
 */
export function saveLocalScrap(scrapItem) {
  try {
    const current = getLocalScraps();
    const existingIdx = current.findIndex((item) => item.id === scrapItem.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...scrapItem };
    } else {
      updated = [scrapItem, ...current];
    }
    localStorage.setItem(LOCAL_SCRAPS_KEY, JSON.stringify(updated));
    return scrapItem;
  } catch (err) {
    console.error("Failed to save to local storage:", err);
    return scrapItem;
  }
}

/**
 * Removes a scrap item from local storage
 */
export function removeLocalScrap(scrapId) {
  try {
    const current = getLocalScraps();
    const filtered = current.filter((item) => item.id !== scrapId);
    localStorage.setItem(LOCAL_SCRAPS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to remove from local storage:", err);
  }
}

/**
 * Main Database Save Function:
 * 1. Tries to insert directly into Firebase Cloud Firestore (`scraps` collection).
 * 2. Also saves to local storage repository for instantaneous availability & offline resilience.
 * 3. Never throws fatal unhandled error — returns a clean result object.
 */
export async function createScrapListing(listingData) {
  let docId = `scrap_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  let firestoreSaved = false;
  let firestoreErrorMsg = null;

  // 1. Try Firebase Cloud Firestore
  try {
    const docRef = await addDoc(collection(db, "scraps"), {
      ...listingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    docId = docRef.id;
    firestoreSaved = true;
    console.log("Successfully stored listing in Firebase Firestore with ID:", docId);
  } catch (error) {
    console.warn("Firestore write notice (check rules in Firebase console):", error.message);
    firestoreErrorMsg = error.message;
  }

  // 2. Save into local persistent database
  const fullScrapItem = {
    id: docId,
    ...listingData,
    firestoreSynced: firestoreSaved,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveLocalScrap(fullScrapItem);

  return {
    success: true,
    id: docId,
    firestoreSaved,
    firestoreErrorMsg,
    item: fullScrapItem,
  };
}

/**
 * Subscribes to real-time scraps from Firestore, with automatic fallback and merge with local store
 */
export function subscribeToScraps(onDataReceived) {
  // Step 1: Immediately emit local data so screen is never blank
  const initialLocal = getLocalScraps();
  onDataReceived(initialLocal, { firestoreConnected: false, isInitial: true });

  // Step 2: Set up live Firestore listener
  try {
    const q = query(collection(db, "scraps"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreList = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Merge Firestore items with any locally created items that haven't synced yet
        const localItems = getLocalScraps();
        const firestoreIds = new Set(firestoreList.map((f) => f.id));
        const unsyncedLocal = localItems.filter((loc) => !firestoreIds.has(loc.id));

        const merged = [...unsyncedLocal, ...firestoreList];
        onDataReceived(merged, { firestoreConnected: true });
      },
      (error) => {
        console.warn("Firestore scraps subscription notice (check rules in console):", error.message);
        // Fallback to local store with permission alert flag
        const currentLocal = getLocalScraps();
        onDataReceived(currentLocal, {
          firestoreConnected: false,
          firestoreError: error.message,
        });
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Firestore query creation error:", err);
    const currentLocal = getLocalScraps();
    onDataReceived(currentLocal, {
      firestoreConnected: false,
      firestoreError: err.message,
    });
    return () => {};
  }
}

/**
 * Fetches scraps for a specific owner (for Dashboard)
 */
export async function getScrapsByOwner(ownerId) {
  const localItems = getLocalScraps().filter((item) => item.ownerId === ownerId);

  try {
    const q = query(collection(db, "scraps"), where("ownerId", "==", ownerId));
    const snap = await getDocs(q);
    const firestoreItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const firestoreIds = new Set(firestoreItems.map((f) => f.id));
    const unsynced = localItems.filter((loc) => !firestoreIds.has(loc.id));
    return [...unsynced, ...firestoreItems];
  } catch (err) {
    console.warn("Error fetching owner scraps from Firestore, using local:", err.message);
    return localItems;
  }
}

/**
 * Deletes a scrap listing across both Firestore and Local storage
 */
export async function deleteScrapListing(scrapId) {
  removeLocalScrap(scrapId);

  try {
    if (!scrapId.startsWith("seed_") && !scrapId.startsWith("scrap_")) {
      await deleteDoc(doc(db, "scraps", scrapId));
    }
    return { success: true };
  } catch (err) {
    console.warn("Firestore delete notice:", err.message);
    return { success: true, localOnly: true };
  }
}

/**
 * Updates a scrap listing across Firestore and Local storage
 */
export async function updateScrapListing(scrapId, updateData) {
  try {
    saveLocalScrap({ id: scrapId, ...updateData });

    if (!scrapId.startsWith("seed_") && !scrapId.startsWith("scrap_")) {
      await updateDoc(doc(db, "scraps", scrapId), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn("Firestore update notice:", err.message);
    return { success: true, localOnly: true };
  }
}

/**
 * Gets all scraps combining local store and Firestore
 */
export async function getScraps() {
  const localItems = getLocalScraps();
  try {
    const q = query(collection(db, "scraps"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const firestoreList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const firestoreIds = new Set(firestoreList.map((f) => f.id));
    const unsynced = localItems.filter((loc) => !firestoreIds.has(loc.id));
    return [...unsynced, ...firestoreList];
  } catch (err) {
    console.warn("Firestore getScraps notice (using local):", err.message);
    return localItems;
  }
}

/**
 * Gets a single scrap by ID
 */
export async function getScrapById(scrapId) {
  // First check local storage
  const localList = getLocalScraps();
  const localMatch = localList.find((s) => s.id === scrapId);

  try {
    const snap = await getDoc(doc(db, "scraps", scrapId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn("Firestore getDoc notice:", err.message);
  }

  return localMatch || null;
}
