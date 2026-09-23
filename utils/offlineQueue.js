import AsyncStorage from "@react-native-async-storage/async-storage";

// Any result that fails to reach Firestore gets stored here instead of
// being lost. This survives app restarts since it's in AsyncStorage,
// not memory - so even closing the app while offline doesn't lose data.

const QUEUE_KEY = "pendingGameResults";

export async function queueResult(result) {
  const existing = await AsyncStorage.getItem(QUEUE_KEY);
  const list = existing ? JSON.parse(existing) : [];
  list.push({ ...result, queuedAt: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(list));
}

export async function getQueuedResults() {
  const existing = await AsyncStorage.getItem(QUEUE_KEY);
  return existing ? JSON.parse(existing) : [];
}

export async function saveQueuedResults(list) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(list));
}

export async function clearQueue() {
  await AsyncStorage.removeItem(QUEUE_KEY);
}