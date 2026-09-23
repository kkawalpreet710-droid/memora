import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";

// Simple flow: pick a role, type/create a link code (like a family PIN)
// that connects one patient's data to one caregiver's dashboard view.
// No email/password needed for the demo - fast to get onto a real device.

export default function RoleSelectionScreen() {
  const { chooseRole } = useApp();
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState("");

  const handleContinue = () => {
    if (!selected) {
      Alert.alert("Choose one", "Please select Patient or Caregiver first.");
      return;
    }
    if (!code || code.trim().length < 4) {
      Alert.alert(
        "Enter a link code",
        "Type a code of at least 4 characters. Use the same code on both the patient's and caregiver's phone to connect them."
      );
      return;
    }
    chooseRole(selected, code.trim().toUpperCase());
  };

  return (
    <SafeAreaView style={styles.container}>
      <LanguageToggle />
      <Text style={styles.title}>{t("appTitle")}</Text>
      <Text style={styles.subtitle}>{t("chooseRole")}</Text>

      <TouchableOpacity
        style={[styles.roleCard, selected === "patient" && styles.roleCardSelected]}
        onPress={() => setSelected("patient")}
      >
        <Text style={styles.roleEmojiText}>{t("patientRole")}</Text>
        <Text style={styles.roleDesc}>{t("patientRoleDesc")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, selected === "caregiver" && styles.roleCardSelected]}
        onPress={() => setSelected("caregiver")}
      >
        <Text style={styles.roleEmojiText}>{t("caregiverRole")}</Text>
        <Text style={styles.roleDesc}>{t("caregiverRoleDesc")}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>{t("linkCodeLabel")}</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="e.g. SHARMA1"
        autoCapitalize="characters"
        maxLength={12}
      />
      <Text style={styles.hint}>{t("linkCodeHint")}</Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>{t("continueBtn")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1E8",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#2C2C2A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#5F5E5A",
    marginBottom: 28,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D3D1C7",
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  roleCardSelected: {
    borderColor: "#0F6E56",
    backgroundColor: "#E1F5EE",
  },
  roleEmojiText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C2C2A",
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 15,
    color: "#5F5E5A",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C2C2A",
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D3D1C7",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
  },
  hint: {
    fontSize: 13,
    color: "#888780",
    marginTop: 8,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: "#0F6E56",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 32,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
