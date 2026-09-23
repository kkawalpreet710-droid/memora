import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { SpeakerButton } from "../../components/LanguageToggle";
import { saveGameResult } from "../../utils/firestoreResults";
import { getDifficulty, setDifficulty, nextDifficulty } from "../../utils/difficulty";

const GAME_TYPE = "pattern_recall";

const TILES = [
  { id: 0, color: "#378ADD", label: "Blue" },
  { id: 1, color: "#1D9E75", label: "Green" },
  { id: 2, color: "#EF9F27", label: "Amber" },
  { id: 3, color: "#D85A30", label: "Orange" },
];

const FLASH_MS = 600;
const GAP_MS = 250;

function sequenceLengthForLevel(level) {
  // Level 1 -> 3 tiles, Level 6 -> 8 tiles
  return level + 2;
}

function randomSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * TILES.length));
}

export default function PatternRecallScreen() {
  const navigation = useNavigation();
  const { linkCode } = useApp();
  const { t } = useLanguage();

  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState("idle"); // idle -> showing -> input -> result
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [activeTile, setActiveTile] = useState(null);
  const [lastAccuracy, setLastAccuracy] = useState(null);
  const inputStartTime = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await getDifficulty(linkCode, GAME_TYPE);
      setLevel(saved);
    })();
  }, [linkCode]);

  const playSequence = useCallback((seq) => {
    setPhase("showing");
    seq.forEach((tileId, i) => {
      setTimeout(() => {
        setActiveTile(tileId);
        setTimeout(() => setActiveTile(null), FLASH_MS - 150);
      }, i * FLASH_MS);
    });
    setTimeout(() => {
      setPhase("input");
      setUserInput([]);
      inputStartTime.current = Date.now();
    }, seq.length * FLASH_MS + GAP_MS);
  }, []);

  const startRound = useCallback(() => {
    const length = sequenceLengthForLevel(level);
    const seq = randomSequence(length);
    setSequence(seq);
    setLastAccuracy(null);
    playSequence(seq);
  }, [level, playSequence]);

  const handleTilePress = async (tileId) => {
    if (phase !== "input") return;

    const newInput = [...userInput, tileId];
    setUserInput(newInput);

    if (newInput.length === sequence.length) {
      const correctCount = newInput.filter((v, i) => v === sequence[i]).length;
      const accuracy = correctCount / sequence.length;
      const totalTimeMs = Date.now() - inputStartTime.current;
      const avgResponseTimeMs = Math.round(totalTimeMs / sequence.length);

      setLastAccuracy(accuracy);
      setPhase("result");

      await saveGameResult({
        linkCode,
        gameType: GAME_TYPE,
        difficultyLevel: level,
        accuracy,
        avgResponseTimeMs,
      });

      const newLevel = nextDifficulty(level, accuracy);
      setLevel(newLevel);
      await setDifficulty(linkCode, GAME_TYPE, newLevel);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t("patternRecallTitle")}</Text>
      <Text style={styles.levelText}>{t("level")} {level}</Text>

      {phase === "idle" && (
        <View style={styles.centerBlock}>
          <Text style={styles.instruction}>{t("watchInstruction")}</Text>
          <SpeakerButton textKey="watchInstruction" />
          <TouchableOpacity style={styles.startButton} onPress={startRound}>
            <Text style={styles.startText}>{t("startBtn")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {(phase === "showing" || phase === "input") && (
        <View style={styles.centerBlock}>
          <Text style={styles.instruction}>
            {phase === "showing" ? t("watchingText") : t("yourTurnInstruction")}
          </Text>
          <View style={styles.tileGrid}>
            {TILES.map((tile) => (
              <TouchableOpacity
                key={tile.id}
                disabled={phase !== "input"}
                onPress={() => handleTilePress(tile.id)}
                style={[
                  styles.tile,
                  { backgroundColor: tile.color },
                  activeTile === tile.id && styles.tileActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            {phase === "input" ? `${userInput.length} / ${sequence.length}` : ""}
          </Text>
        </View>
      )}

      {phase === "result" && (
        <View style={styles.centerBlock}>
          <Text style={styles.resultText}>
            {Math.round(lastAccuracy * 100)}% correct
          </Text>
          <Text style={styles.resultSubtext}>
            {lastAccuracy >= 0.8
              ? t("greatJob")
              : lastAccuracy < 0.5
              ? t("goodTry")
              : t("niceWork")}
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startRound}>
            <Text style={styles.startText}>{t("playAgainBtn")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1E8", padding: 24, paddingTop: 40 },
  backText: { fontSize: 16, color: "#5F5E5A", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "700", color: "#2C2C2A" },
  levelText: { fontSize: 15, color: "#5F5E5A", marginBottom: 24 },
  centerBlock: { alignItems: "center", marginTop: 16 },
  instruction: {
    fontSize: 17,
    color: "#2C2C2A",
    textAlign: "center",
    marginBottom: 28,
  },
  startButton: {
    backgroundColor: "#0F6E56",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  startText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 260,
    justifyContent: "space-between",
  },
  tile: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 20,
    opacity: 0.55,
  },
  tileActive: {
    opacity: 1,
  },
  progressText: { fontSize: 16, color: "#5F5E5A", marginTop: 8 },
  resultText: { fontSize: 32, fontWeight: "700", color: "#0F6E56" },
  resultSubtext: {
    fontSize: 16,
    color: "#5F5E5A",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
});
