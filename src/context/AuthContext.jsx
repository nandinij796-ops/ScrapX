/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (user) => {
    if (!user) {
      setUserData(null);
      return null;
    }
    // Check local cache first for instant loading
    let cachedProfile = null;
    try {
      const stored = localStorage.getItem(`scrapx_user_${user.uid}`);
      if (stored) {
        cachedProfile = JSON.parse(stored);
        setUserData(cachedProfile);
      }
    } catch (e) {
      console.warn("Local profile read err:", e);
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        try {
          localStorage.setItem(`scrapx_user_${user.uid}`, JSON.stringify(data));
        } catch (e) { /* ignore */ }
        return data;
      } else {
        // Fallback profile if record is missing in Firestore
        const defaultProfile = cachedProfile || {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          role: "Customer",
        };
        try {
          await setDoc(userDocRef, { ...defaultProfile, createdAt: serverTimestamp() }, { merge: true });
        } catch (err) {
          console.warn("Profile Firestore save notice:", err.message);
        }
        setUserData(defaultProfile);
        try {
          localStorage.setItem(`scrapx_user_${user.uid}`, JSON.stringify(defaultProfile));
        } catch (e) { /* ignore */ }
        return defaultProfile;
      }
    } catch (error) {
      console.warn("Firestore user data read notice (using local cached profile):", error.message);
      if (cachedProfile) {
        setUserData(cachedProfile);
        return cachedProfile;
      }
      const basicProfile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email,
        role: "Seller", // Default to Seller so user can list products without restrictions
      };
      setUserData(basicProfile);
      return basicProfile;
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (auth.currentUser) {
      return await fetchUserData(auth.currentUser);
    }
    return null;
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const userRole = userData?.role || "Customer";
  const isAdmin = userRole === "Admin";
  const isMechanic = userRole === "Mechanic";
  const isSeller = userRole === "Seller" || userRole === "Scrap Dealer";

  const value = {
    currentUser,
    userData,
    userRole,
    isAdmin,
    isMechanic,
    isSeller,
    loading,
    refreshUserData,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
