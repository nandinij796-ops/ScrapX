import { collection, addDoc, getDocs, doc, updateDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_ORDERS_KEY = "scrapx_orders_v1";

const INITIAL_SEED_ORDERS = [
  {
    id: "order_seed_201",
    orderRef: "ORD-2026-4412",
    scrapId: "seed_scrap_1",
    scrapName: "Tata Nexon 1.5L Turbocharger Assembly",
    scrapImage: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
    askingPrice: 14500,
    offerPrice: 13800,
    buyerId: "demo_buyer_1",
    buyerName: "Deepak Choudhary",
    buyerPhone: "+91 98101 55667",
    buyerEmail: "deepak.garage@gmail.com",
    sellerId: "demo_seller_1",
    sellerName: "Apex Salvage Hub",
    deliveryPreference: "Self Pickup from Mayapuri Yard",
    note: "Need this urgently for a customer overhaul job. Can pick up this evening if accepted.",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "order_seed_202",
    orderRef: "ORD-2026-4413",
    scrapId: "seed_scrap_2",
    scrapName: "Mahindra Thar CRDe Front Steel Bumper Assembly",
    scrapImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    askingPrice: 6800,
    offerPrice: 6500,
    buyerId: "demo_buyer_2",
    buyerName: "Kunal Mehra",
    buyerPhone: "+91 99200 44332",
    buyerEmail: "kunal.m@yahoo.com",
    sellerId: "demo_seller_2",
    sellerName: "Northstar Motors",
    deliveryPreference: "Courier Delivery via Delhivery",
    note: "Please inspect fog lamp mounts before dispatch.",
    status: "Accepted",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "order_seed_203",
    orderRef: "ORD-2026-4414",
    scrapId: "seed_scrap_3",
    scrapName: "Bosch 12V 90A Alternator (Maruti Swift)",
    scrapImage: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800",
    askingPrice: 3600,
    offerPrice: 3600,
    buyerId: "demo_buyer_3",
    buyerName: "Speedy Auto Works",
    buyerPhone: "+91 98450 11223",
    buyerEmail: "speedy.works@gmail.com",
    sellerId: "demo_seller_1",
    sellerName: "Gupta Auto Spares",
    deliveryPreference: "Local Express Van Delivery",
    note: "Paid in full via cash on delivery upon bench test verification.",
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

export function getLocalOrders() {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(INITIAL_SEED_ORDERS));
      return [...INITIAL_SEED_ORDERS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SEED_ORDERS];
  } catch (err) {
    console.warn("Error reading local orders:", err);
    return [...INITIAL_SEED_ORDERS];
  }
}

export function saveLocalOrder(order) {
  try {
    const current = getLocalOrders();
    const existingIdx = current.findIndex((o) => o.id === order.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...order };
    } else {
      updated = [order, ...current];
    }
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    return order;
  } catch (err) {
    console.error("Failed to save local order:", err);
    return order;
  }
}

/**
 * Creates a buy request / offer
 */
export async function createOrderOffer(orderData) {
  const orderRef = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  let docId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let firestoreSaved = false;

  const payload = {
    ...orderData,
    orderRef,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "buyRequests"), {
      ...payload,
      timestamp: serverTimestamp(),
    });
    docId = docRef.id;
    firestoreSaved = true;
  } catch (err) {
    console.warn("Firestore order offer save notice (saved locally):", err.message);
  }

  const finalOrder = {
    id: docId,
    ...payload,
    firestoreSynced: firestoreSaved,
  };

  saveLocalOrder(finalOrder);
  return finalOrder;
}

/**
 * Fetches all orders related to a user (as buyer or seller)
 */
export async function getUserOrders(userId) {
  const localList = getLocalOrders();
  // Filter for this user or show all demo orders if guest
  const userLocal = userId
    ? localList.filter((o) => o.buyerId === userId || o.sellerId === userId || o.sellerId === "demo_seller_1")
    : localList;

  try {
    const q1 = query(collection(db, "buyRequests"), where("buyerId", "==", userId || ""));
    const snap1 = await getDocs(q1);
    const firestoreItems = snap1.docs.map((d) => ({ id: d.id, ...d.data() }));

    const firestoreIds = new Set(firestoreItems.map((f) => f.id));
    const unsynced = userLocal.filter((loc) => !firestoreIds.has(loc.id));
    return [...unsynced, ...firestoreItems];
  } catch (err) {
    console.warn("Notice loading orders from Firestore, using local:", err.message);
    return userLocal;
  }
}

/**
 * Updates order status (Accepted, Rejected, Completed)
 */
export async function updateOrderStatus(orderId, newStatus) {
  const localList = getLocalOrders();
  const target = localList.find((o) => o.id === orderId);
  if (target) {
    target.status = newStatus;
    saveLocalOrder(target);
  }

  try {
    if (!orderId.startsWith("order_seed_") && !orderId.startsWith("order_")) {
      await updateDoc(doc(db, "buyRequests", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (err) {
    console.warn("Firestore order update notice:", err.message);
    return { success: true, localOnly: true };
  }
}

/**
 * Gets received offers for a seller
 */
export async function getReceivedOffers(sellerId) {
  const orders = await getUserOrders(sellerId);
  return orders.filter((o) => o.sellerId === sellerId || o.sellerId === "demo_seller_1");
}

/**
 * Gets sent offers for a buyer
 */
export async function getSentOffers(buyerId) {
  const orders = await getUserOrders(buyerId);
  return orders.filter((o) => o.buyerId === buyerId);
}

/**
 * Alias for updateOrderStatus
 */
export const updateOfferStatus = updateOrderStatus;
