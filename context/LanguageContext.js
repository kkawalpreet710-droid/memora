import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { translate, TRANSLATIONS } from "../constants/translations";
import { translateText, textToSpeech, BHASHINI_LANGUAGES } from "../utils/bhashini";
import { playBhashiniAudio } from "../utils/bhashiniAudio";

// Languages with a static, human-checked translation file - fast, fully
// offline, no API dependency.
const STATIC_LANGUAGES = ["en", "as"];

// Languages powered by Bhashini instead - translated once, then cached
// locally so they work offline after the first successful fetch.
const BHASHINI_LANG_CODES = { brx: "brx", mni: "mni", ne: "ne", hi: "hi" };

const SPEECH_LOCALE = { en: "en-IN", as: "as-IN" };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [dynamicDict, setDynamicDict] = useState({});
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("language");
      if (saved) await setLanguage(saved);
    })();
  }, []);

  async function loadOrFetchDynamicTranslations(code) {
    const cacheKey = `bhashini_translations_${code}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    setTranslating(true);
    try {
      const keys = Object.keys(TRANSLATIONS.en);
      const entries = await Promise.all(
        keys.map(async (key) => {
          try {
            const translated = await translateText(TRANSLATIONS.en[key], code);
            return [key, translated];
          } catch (e) {
            return [key, TRANSLATIONS.en[key]]; // per-string fallback to English
          }
        })
      );
      const dict = Object.fromEntries(entries);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(dict));
      return dict;
    } finally {
      setTranslating(false);
    }
  }

  const setLanguage = async (code) => {
    await AsyncStorage.setItem("language", code);

    if (STATIC_LANGUAGES.includes(code)) {
      setLanguageState(code);
      return;
    }

    // Bhashini-backed language: load cached dict, or fetch fresh (needs
    // network + valid credentials the first time only).
    try {
      const dict = await loadOrFetchDynamicTranslations(code);
      setDynamicDict(dict);
      setLanguageState(code);
    } catch (e) {
      console.warn(`Bhashini translation unavailable, falling back to English:`, e.message);
      setLanguageState("en");
    }
  };

  const t = (key) => {
    if (STATIC_LANGUAGES.includes(language)) return translate(language, key);
    return dynamicDict[key] ?? TRANSLATIONS.en[key] ?? key;
  };

  const speak = async (key) => {
    const text = t(key);

    if (language === "en") {
      Speech.stop();
      Speech.speak(text, { language: SPEECH_LOCALE.en });
      return;
    }

    if (BHASHINI_LANG_CODES[language]) {
      try {
        const audio = await textToSpeech(text, BHASHINI_LANG_CODES[language]);
        await playBhashiniAudio(audio);
        return;
      } catch (e) {
        console.warn("Bhashini TTS failed, falling back to device voice:", e.message);
      }
    }

    // Fallback: device TTS (works for 'as' if the phone happens to have
    // an Assamese voice pack; silent otherwise, same limitation as before)
    Speech.stop();
    Speech.speak(text, { language: SPEECH_LOCALE[language] || "en-IN" });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speak, translating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}