import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Holds the current role ("patient" or "caregiver") and the linkCode that
// connects a patient's data to their caregiver's dashboard view.
// This is intentionally simple: a shared linkCode string, typed in once,
// is enough to demo the connection without building a full invite system.

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(null);
  const [linkCode, setLinkCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedRole = await AsyncStorage.getItem("role");
      const savedLinkCode = await AsyncStorage.getItem("linkCode");
      if (savedRole) setRole(savedRole);
      if (savedLinkCode) setLinkCode(savedLinkCode);
      setLoading(false);
    })();
  }, []);

  const chooseRole = async (newRole, newLinkCode) => {
    await AsyncStorage.setItem("role", newRole);
    await AsyncStorage.setItem("linkCode", newLinkCode);
    setRole(newRole);
    setLinkCode(newLinkCode);
  };

  const resetRole = async () => {
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("linkCode");
    setRole(null);
    setLinkCode(null);
  };

  return (
    <AppContext.Provider value={{ role, linkCode, loading, chooseRole, resetRole }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
