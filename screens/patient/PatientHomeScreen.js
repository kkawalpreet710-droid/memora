import SOSButton from "../../components/SOSButton";
// ...inside the return, right after <LanguageToggle />:
<SOSButton />
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageToggle } from "../../components/LanguageToggle";

// Placeholder home screen. Next step: replace the two boxes below with
// real TouchableOpacity cards that navigate to PatternRecallScreen and
// FaceNameMatchScreen.

export default function PatientHomeScreen() {
  const navigation = useNavigation();
  const { linkCode, resetRole } = useApp();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <LanguageToggle />
      <Text style={styles.title}>{t("hello")}</Text>
      <Text style={styles.subtitle}>{t("linkedAs")}: {linkCode}</Text>

      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => navigation.navigate("PatternRecall")}
      >
        <Text style={styles.gameTitle}>{t("patternRecallTitle")}</Text>
        <Text style={styles.gameDesc}>{t("patternRecallDesc")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => navigation.navigate("FaceNameMatch")}
      >
        <Text style={styles.gameTitle}>{t("faceNameTitle")}</Text>
        <Text style={styles.gameDesc}>{t("faceNameDesc")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={resetRole}>
        <Text style={styles.switchText}>{t("switchRole")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1E8", padding: 24, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: "700", color: "#2C2C2A" },
  subtitle: { fontSize: 15, color: "#5F5E5A", marginBottom: 24 },
  gameCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#D3D1C7",
  },
  gameCardDisabled: { opacity: 0.5 },
  gameTitle: { fontSize: 20, fontWeight: "600", color: "#2C2C2A" },
  gameDesc: { fontSize: 14, color: "#888780", marginTop: 4 },
  switchButton: { marginTop: 24, alignItems: "center" },
  switchText: { color: "#993C1D", fontSize: 15 },
});
