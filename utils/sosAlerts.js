import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import * as Location from "expo-location";

export async function sendSOS(linkCode) {
  let location = null;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const pos = await Location.getCurrentPositionAsync({});
      location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }
  } catch (e) {
    console.warn("Location unavailable for SOS:", e.message);
  }

  await addDoc(collection(db, "sosAlerts"), {
    linkCode,
    location,
    resolved: false,
    createdAt: serverTimestamp(),
  });
}

// NOTE: this query filters on linkCode + resolved + orders by createdAt -
// that's a 3-field composite index, same pain as the caregiver dashboard
// index earlier. Create it via Firestore > Indexes the first time this
// throws a "requires an index" error, same process as before.
export function subscribeToActiveSOS(linkCode, onUpdate) {
  const q = query(
    collection(db, "sosAlerts"),
    where("linkCode", "==", linkCode),
    where("resolved", "==", false),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function resolveSOS(alertId) {
  await updateDoc(doc(db, "sosAlerts", alertId), { resolved: true });
}