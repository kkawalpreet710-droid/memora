import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Vibration, Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { sendSOS } from "../utils/sosAlerts";

export default function SOSButton() {
  const { linkCode } = useApp();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handlePress = async () => {
    if (sending) return;
    setSending(true);
    Vibration.vibrate(200);
    try {
      await sendSOS(linkCode);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (e) {
      Alert.alert("Could not send", "Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <TouchableOpacity style={[styles.button, sent && styles.buttonSent]} onPress={handlePress} disabled={sending}>
      <Text style={styles.text}>{sent ? "Help is on the way" : "SOS — Get Help"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: "#C0392B", borderRadius: 16, paddingVertical: 20, alignItems: "center", marginBottom: 20 },
  buttonSent: { backgroundColor: "#639922" },
  text: { color: "#FFFFFF", fontSize: 19, fontWeight: "700" },
});