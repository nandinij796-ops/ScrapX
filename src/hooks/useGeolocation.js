import { useState, useEffect, useCallback } from "react";
import { isValidCoordinate, CITY_PRESETS } from "../utils/geo";

const STORAGE_KEY = "scrapx_user_location";

export function useGeolocation(autoRequest = false) {
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidCoordinate(parsed.lat, parsed.lng)) {
          return { lat: parsed.lat, lng: parsed.lng };
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [locationName, setLocationName] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || parsed.city || "";
      }
    } catch {
      // ignore
    }
    return "";
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");
  const [accuracy, setAccuracy] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  const saveLocation = useCallback((newCoords, name = "") => {
    setCoords(newCoords);
    setLocationName(name);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lat: newCoords.lat,
          lng: newCoords.lng,
          name,
          updatedAt: Date.now(),
        })
      );
    } catch {
      console.warn("Could not save location to localStorage");
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionStatus("unsupported");
      setError("Geolocation is not supported by your browser or device.");
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setAccuracy(acc);
        setTimestamp(position.timestamp);
        setPermissionStatus("granted");
        setLoading(false);

        let resolvedName = `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            { headers: { "User-Agent": "ScrapX-Automotive-Marketplace/1.0" } }
          );
          if (res.ok) {
            const data = await res.json();
            resolvedName =
              data.address?.city ||
              data.address?.town ||
              data.address?.suburb ||
              data.address?.state_district ||
              data.display_name?.split(",")[0] ||
              resolvedName;
          }
        } catch {
          // Silent fallback to coords
        }

        saveLocation(newCoords, resolvedName);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setPermissionStatus("denied");
          setError("Location permission was denied. You can select a city manually below.");
        } else if (err.code === 2) {
          setPermissionStatus("unavailable");
          setError("Location information is currently unavailable from your device.");
        } else if (err.code === 3) {
          setPermissionStatus("timeout");
          setError("Location request timed out. Please retry or select a city manually.");
        } else {
          setPermissionStatus("unavailable");
          setError(err.message || "An unknown location error occurred.");
        }
      },
      options
    );
  }, [saveLocation]);

  const setManualLocation = useCallback((cityOrPreset) => {
    if (typeof cityOrPreset === "string") {
      const match = CITY_PRESETS.find(
        (c) => c.city.toLowerCase() === cityOrPreset.toLowerCase()
      );
      if (match) {
        saveLocation({ lat: match.lat, lng: match.lng }, `${match.city}, ${match.state}`);
        setError(null);
        setPermissionStatus("granted");
        return;
      }
    } else if (cityOrPreset && isValidCoordinate(cityOrPreset.lat, cityOrPreset.lng)) {
      saveLocation(
        { lat: Number(cityOrPreset.lat), lng: Number(cityOrPreset.lng) },
        cityOrPreset.name || cityOrPreset.city || "Custom Location"
      );
      setError(null);
      setPermissionStatus("granted");
    }
  }, [saveLocation]);

  useEffect(() => {
    if (autoRequest && !coords) {
      const timer = setTimeout(() => {
        requestLocation();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoRequest, coords, requestLocation]);

  return {
    coords,
    locationName,
    loading,
    error,
    permissionStatus,
    accuracy,
    timestamp,
    requestLocation,
    setManualLocation,
  };
}
