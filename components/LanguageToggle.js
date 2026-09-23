import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { LANGUAGES } from "../constants/translations";

export function LanguageToggle() {
  const { language, setLanguage, translating } = useLanguage();
  // ...inside the pill row, after the map, add:
  {translating && <Text style={{ fontSize: 11, color: "#888" }}>Translating…</Text>}

  return (
    <View style={styles.row}>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => setLanguage(lang.code)}
          style={[styles.pill, language === lang.code && styles.pillActive]}
        >
          <Text style={[styles.pillText, language === lang.code && styles.pillTextActive]}>
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function SpeakerButton({ textKey }) {
  const { speak } = useLanguage();
  return (
    <TouchableOpacity style={styles.speakerButton} onPress={() => speak(textKey)}>
      <Text style={styles.speakerText}>🔊 Listen</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, alignSelf: "flex-end", marginBottom: 8 },
  pill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D3D1C7",
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  pillActive: { backgroundColor: "#0F6E56", borderColor: "#0F6E56" },
  pillText: { fontSize: 13, color: "#5F5E5A" },
  pillTextActive: { color: "#FFFFFF", fontWeight: "600" },
  speakerButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D3D1C7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  speakerText: { fontSize: 14, color: "#2C2C2A" },
});
