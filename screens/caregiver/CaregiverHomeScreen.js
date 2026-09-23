import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter } from "victory-native";
import { useApp } from "../../context/AppContext";
import { subscribeToResults } from "../../utils/firestoreResults";

import { subscribeToActiveSOS, resolveSOS } from "../../utils/sosAlerts";
// add state: const [sosAlerts, setSosAlerts] = useState([]);
// add useEffect: useEffect(() => subscribeToActiveSOS(linkCode, setSosAlerts), [linkCode]);
// render above everything else, when sosAlerts.length > 0:
{sosAlerts.map((a) => (
  <View key={a.id} style={{ backgroundColor: "#C0392B", padding: 16, borderRadius: 12, marginBottom: 16 }}>
    <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>SOS Alert</Text>
    {a.location && (
      <Text style={{ color: "#FFF" }}>Location: {a.location.lat.toFixed(4)}, {a.location.lng.toFixed(4)}</Text>
    )}
    <TouchableOpacity onPress={() => resolveSOS(a.id)} style={{ marginTop: 8 }}>
      <Text style={{ color: "#FFF", textDecorationLine: "underline" }}>Mark as resolved</Text>
    </TouchableOpacity>
  </View>
))}
const GAME_LABELS = {
  pattern_recall: "Pattern recall",
  face_name: "Face and name",
};

export default function CaregiverHomeScreen() {
  const { linkCode, resetRole } = useApp();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToResults(linkCode, (data) => {
      setResults(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [linkCode]);

  const chartData = results.map((r, i) => ({
    x: i + 1,
    y: Math.round(r.accuracy * 100),
  }));

  const latest = results[results.length - 1];
  const totalSessions = results.length;
  const averageAccuracy =
    totalSessions > 0
      ? Math.round(
          (results.reduce((sum, r) => sum + r.accuracy, 0) / totalSessions) * 100
        )
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Watching: {linkCode}</Text>

        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : totalSessions === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No game sessions yet. Once the patient plays a round, it will
              show up here automatically.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{averageAccuracy}%</Text>
                <Text style={styles.statLabel}>Avg accuracy</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{latest?.difficultyLevel ?? "-"}</Text>
                <Text style={styles.statLabel}>Current level</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Accuracy over time</Text>
              <VictoryChart theme={VictoryTheme.material} height={220} padding={{ top: 10, bottom: 40, left: 45, right: 20 }}>
                <VictoryAxis
                  tickFormat={(t) => `#${t}`}
                  style={{ tickLabels: { fontSize: 11 } }}
                />
                <VictoryAxis
                  dependentAxis
                  domain={[0, 100]}
                  tickFormat={(t) => `${t}%`}
                  style={{ tickLabels: { fontSize: 11 } }}
                />
                <VictoryLine
                  data={chartData}
                  style={{ data: { stroke: "#0F6E56", strokeWidth: 2 } }}
                />
                <VictoryScatter
                  data={chartData}
                  size={4}
                  style={{ data: { fill: "#0F6E56" } }}
                />
              </VictoryChart>
            </View>

            <Text style={styles.historyHeading}>Recent sessions</Text>
            {[...results].reverse().slice(0, 8).map((r) => (
              <View key={r.id} style={styles.historyRow}>
                <Text style={styles.historyGame}>
                  {GAME_LABELS[r.gameType] || r.gameType}
                </Text>
                <Text style={styles.historyDetail}>
                  {Math.round(r.accuracy * 100)}% · Level {r.difficultyLevel} · {r.avgResponseTimeMs}ms
                </Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.switchButton} onPress={resetRole}>
          <Text style={styles.switchText}>Switch role</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1E8" },
  scrollContent: { padding: 24, paddingTop: 40, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: "700", color: "#2C2C2A" },
  subtitle: { fontSize: 15, color: "#5F5E5A", marginBottom: 24 },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: "#D3D1C7",
  },
  emptyText: { color: "#888780", fontSize: 15, lineHeight: 22 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D3D1C7",
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#0F6E56" },
  statLabel: { fontSize: 12, color: "#888780", marginTop: 2 },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D3D1C7",
    padding: 12,
    marginBottom: 20,
  },
  chartTitle: { fontSize: 15, fontWeight: "600", color: "#2C2C2A", marginLeft: 8, marginBottom: 4 },
  historyHeading: { fontSize: 16, fontWeight: "600", color: "#2C2C2A", marginBottom: 8 },
  historyRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D3D1C7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyGame: { fontSize: 14, color: "#2C2C2A", fontWeight: "600" },
  historyDetail: { fontSize: 13, color: "#5F5E5A" },
  switchButton: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#993C1D", fontSize: 15 },
});
