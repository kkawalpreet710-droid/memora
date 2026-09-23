import React, { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { flushQueuedResults } from "../utils/firestoreResults";
import { getQueuedResults } from "../utils/offlineQueue";

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = async () => {
    const list = await getQueuedResults();
    setPendingCount(list.length);
  };

  useEffect(() => {
    refreshPendingCount();

    NetInfo.fetch().then((state) => setIsOnline(!!state.isConnected));

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const online = !!state.isConnected;
      setIsOnline(online);
      if (online) {
        await flushQueuedResults();
        await refreshPendingCount();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, pendingCount, refreshPendingCount }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}