import { Audio } from "expo-av";

// Bhashini TTS returns base64 WAV audio - this plays it directly from
// memory as a data URI, no file download or caching needed.
let currentSound = null;

export async function playBhashiniAudio(base64Wav) {
  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }
    const uri = `data:audio/wav;base64,${base64Wav}`;
    const { sound } = await Audio.Sound.createAsync({ uri });
    currentSound = sound;
    await sound.playAsync();
  } catch (e) {
    console.warn("Failed to play Bhashini audio:", e.message);
    throw e; // let the caller decide whether to fall back to device TTS
  }
}