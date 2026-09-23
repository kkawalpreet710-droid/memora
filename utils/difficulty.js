import AsyncStorage from "@react-native-async-storage/async-storage";

// Simple, explainable rule instead of a trained model:
// - Do well (80%+ correct) -> get harder next round
// - Struggle (under 50% correct) -> get easier next round
// - Otherwise -> stay the same
// Difficulty is a number from 1 (easiest) to 6 (hardest), stored per
// game type so pattern recall and face-name difficulty track separately.

const MIN_LEVEL = 1;
const MAX_LEVEL = 6;

export function nextDifficulty(currentLevel, accuracy) {
  if (accuracy >= 0.8) return Math.min(currentLevel + 1, MAX_LEVEL);
  if (accuracy < 0.5) return Math.max(currentLevel - 1, MIN_LEVEL);
  return currentLevel;
}

function storageKey(linkCode, gameType) {
  return `difficulty_${gameType}_${linkCode}`;
}

export async function getDifficulty(linkCode, gameType) {
  const saved = await AsyncStorage.getItem(storageKey(linkCode, gameType));
  return saved ? parseInt(saved, 10) : MIN_LEVEL;
}

export async function setDifficulty(linkCode, gameType, level) {
  await AsyncStorage.setItem(storageKey(linkCode, gameType), String(level));
}
