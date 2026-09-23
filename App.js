import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NetworkProvider } from "./context/NetworkContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AppProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
}