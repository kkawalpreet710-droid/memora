import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { SpeakerButton } from "../../components/LanguageToggle";
import { saveGameResult } from "../../utils/firestoreResults";
import { getDifficulty, setDifficulty, nextDifficulty } from "../../utils/difficulty";
import { PEOPLE, initialsFor } from "../../constants/people";

const GAME_TYPE = "face_name";
const QUESTIONS_PER_ROUND = 3;
const MEMORIZE_MS = 2500;

function optionsCountForLevel(level) {
  // Level 1 -> 2 choices, level 6 -> up to 6 choices (harder to tell apart)
  return Math.min(level + 1, PEOPLE.length, 6);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestion(numOptions) {
  const shuffled = shuffle(PEOPLE);
  const target = shuffled[0];
  const options = shuffle(shuffled.slice(0, numOptions));
  return { target, options };
}

export default function FaceNameMatchScreen() {
  const navigation = useNavigation();
  const { linkCode } = useApp();
  const { t } = useLanguage();

  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState("idle"); // idle -> memorize -> question -> result
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalResponseMs, setTotalResponseMs] = useState(0);
  const [lastAccuracy, setLastAccuracy] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const questionStartTime = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await getDifficulty(linkCode, GAME_TYPE);
      setLevel(saved);
    })();
  }, [linkCode]);

  const startQuestion = useCallback(
    (index) => {
      const q = buildQuestion(optionsCountForLevel(level));
      setQuestion(q);
      setFeedback(null);
      setPhase("memorize");
      setTimeout(() => {
        setPhase("question");
        questionStartTime.current = Date.now();
      }, MEMORIZE_MS);
      setQuestionIndex(index);
    },
    [level]
  );

  const startRound = () => {
    setCorrectCount(0);
    setTotalResponseMs(0);
    setLastAccuracy(null);
    startQuestion(0);
  };

  const handleAnswer = async (personId) => {
    if (phase !== "question") return;

    const isCorrect = personId === question.target.id;
    const responseMs = Date.now() - questionStartTime.current;
    setFeedback(isCorrect ? "correct" : "wrong");

    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    const newTotalResponseMs = totalResponseMs + responseMs;
    setCorrectCount(newCorrectCount);
    setTotalResponseMs(newTotalResponseMs);

    const isLastQuestion = questionIndex + 1 >= QUESTIONS_PER_ROUND;

    setTimeout(async () => {
      if (!isLastQuestion) {
        startQuestion(questionIndex + 1);
        return;
      }

      const accuracy = newCorrectCount / QUESTIONS_PER_ROUND;
      const avgResponseTimeMs = Math.round(newTotalResponseMs / QUESTIONS_PER_ROUND);
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
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t("faceNameTitle")}</Text>
      <Text style={styles.levelText}>{t("level")} {level}</Text>

      {phase === "idle" && (
        <View style={styles.centerBlock}>
          <Text style={styles.instruction}>{t("rememberInstruction")}</Text>
          <SpeakerButton textKey="rememberInstruction" />
          <TouchableOpacity style={styles.startButton} onPress={startRound}>
            <Text style={styles.startText}>{t("startBtn")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === "memorize" && question && (
        <View style={styles.centerBlock}>
          <Text style={styles.instruction}>{t("rememberThisPerson")}</Text>
          <View style={[styles.avatar, { backgroundColor: question.target.color }]}>
            <Text style={styles.avatarInitial}>{initialsFor(question.target.name)}</Text>
          </View>
          <Text style={styles.nameLabel}>{question.target.name}</Text>
        </View>
      )}

      {phase === "question" && question && (
        <View style={styles.centerBlock}>
          <Text style={styles.instruction}>{t("whoIsThis")}</Text>
          <View style={[styles.avatar, { backgroundColor: question.target.color }]}>
            <Text style={styles.avatarInitial}>{initialsFor(question.target.name)}</Text>
          </View>

          <View style={styles.optionsWrap}>
            {question.options.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.optionButton,
                  feedback && p.id === question.target.id && styles.optionCorrect,
                  feedback === "wrong" && p.id !== question.target.id && styles.optionNeutral,
                ]}
                disabled={!!feedback}
                onPress={() => handleAnswer(p.id)}
              >
                <Text style={styles.optionText}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.progressText}>
            Question {questionIndex + 1} / {QUESTIONS_PER_ROUND}
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
  centerBlock: { alignItems: "center", marginTop: 8 },
  instruction: { fontSize: 17, color: "#2C2C2A", textAlign: "center", marginBottom: 20 },
  startButton: {
    backgroundColor: "#0F6E56",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  startText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarInitial: { fontSize: 48, fontWeight: "700", color: "#FFFFFF" },
  nameLabel: { fontSize: 24, fontWeight: "700", color: "#2C2C2A" },
  optionsWrap: { width: "100%", marginTop: 20 },
  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D3D1C7",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  optionCorrect: { borderColor: "#639922", backgroundColor: "#EAF3DE" },
  optionNeutral: { opacity: 0.4 },
  optionText: { fontSize: 18, fontWeight: "600", color: "#2C2C2A" },
  progressText: { fontSize: 14, color: "#888780", marginTop: 4 },
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
