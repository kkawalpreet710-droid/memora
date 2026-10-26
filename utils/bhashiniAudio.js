import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

// Bhashini TTS returns base64 WAV audio. Play it from memory as a data URI.
let currentPlayer = null;

export async function playBhashiniAudio(base64Wav) {
  try {
    if (currentPlayer) {
      currentPlayer.remove();
      currentPlayer = null;
    }
    await setAudioModeAsync({ playsInSilentMode: true });
    const player = createAudioPlayer({ uri: `data:audio/wav;base64,${base64Wav}` });
    currentPlayer = player;
    player.play();
  } catch (e) {
    console.warn("Failed to play Bhashini audio:", e.message);
    throw e; // LanguageContext falls back to device TTS when this throws
  }
}