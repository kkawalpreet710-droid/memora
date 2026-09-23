import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { queueResult, getQueuedResults, saveQueuedResults, clearQueue } from "./offlineQueue";

// Tries Firestore first. If that fails - no connection, or a flaky one -
// the result is queued locally instead of being silently dropped, so
// nothing a patient plays is ever lost, even fully offline.
export async function saveGameResult({
  linkCode,
  gameType,
  difficultyLevel,
  accuracy,
  avgResponseTimeMs,
}) {
  const payload = { linkCode, gameType, difficultyLevel, accuracy, avgResponseTimeMs };
  try {
    await addDoc(collection(db, "gameResults"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Offline or failed to sync - queuing result locally:", error.message);
    await queueResult(payload);
  }
}

// Called automatically when the device comes back online. Retries every
// queued result; anything that still fails stays queued for next time.
export async function flushQueuedResults() {
  const pending = await getQueuedResults();
  if (pending.length === 0) return { synced: 0, remaining: 0 };

  const stillFailed = [];
  for (const result of pending) {
    try {
      const { queuedAt, ...payload } = result;
      await addDoc(collection(db, "gameResults"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      stillFailed.push(result);
    }
  }

  if (stillFailed.length > 0) {
    await saveQueuedResults(stillFailed);
  } else {
    await clearQueue();
  }
  return { synced: pending.length - stillFailed.length, remaining: stillFailed.length };
}

export function subscribeToResults(linkCode, onUpdate) {
  const q = query(
    collection(db, "gameResults"),
    where("linkCode", "==", linkCode),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    onUpdate(results);
  });
}