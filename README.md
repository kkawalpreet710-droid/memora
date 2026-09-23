# Memora

**AI-based cognitive gaming and memory assistance for elderly dementia patients — built for North-East India.**

Built for Smart India Hackathon 2026. Memora is a mobile app that helps elderly patients with dementia and mild cognitive impairment (MCI) through gamified cognitive training, while giving family caregivers real-time visibility into cognitive trends — all in the patient's own language.

## The problem

Existing cognitive-care tools are built for English-literate, tech-comfortable users. They don't work for elderly patients in North-East India who are more comfortable in Assamese, Bodo, Manipuri, or Nepali than in English or Hindi — and they offer no safety net for patients prone to confusion or wandering.

## What Memora does

- **Two adaptive memory games** — pattern recall (sequence memory) and face-name matching, both tuned for early-stage dementia and MCI patients
- **Rule-based adaptive difficulty** — a transparent, explainable engine (not a black-box model) raises or lowers difficulty every round based on live accuracy and response time
- **Live caregiver dashboard** — accuracy and session trends sync in real time via Firebase, so a caregiver always knows how their patient is doing
- **Offline-first** — results are queued locally and synced automatically once back online, built for patchy North-East India connectivity
- **Multilingual, voice-first** — English and Assamese are fully built in; Hindi, Bodo, Manipuri, and Nepali are powered by the [Bhashini](https://bhashini.gov.in) API for translation and text-to-speech, solving the common problem of phones lacking regional-language voice packs installed
- **One-tap SOS** — a prominent emergency button that instantly alerts the caregiver with the patient's location, for patients prone to wandering or confusion
- **Family link code** — patient and caregiver pair with a simple shared code, no login required

## Tech stack

| Layer | Technology |
|---|---|
| Mobile app | React Native (Expo) |
| Backend | Firebase (Firestore + Auth) |
| Translation & voice | Bhashini API (regional languages), on-device TTS (English) |
| Location (SOS) | expo-location |
| Audio playback | expo-av |
| Offline storage | AsyncStorage |

## Project structure

```
memora-app/
├── App.js
├── context/          # App-wide state: role, language, network status
├── screens/
│   ├── patient/       # Games and patient home screen
│   └── caregiver/      # Caregiver dashboard
├── components/        # Shared UI (SOS button, language toggle)
├── utils/              # Firestore sync, offline queue, Bhashini client, difficulty engine
├── firebase/           # Firebase config
└── constants/           # Translations, demo data
```

## Getting started

**Prerequisites:** Node.js (LTS), a Firebase project (Firestore enabled), and optionally a [Bhashini API key](https://bhashini.gov.in) for the additional regional languages.

```bash
npm install
```

Add your Firebase config to `firebase/config.js`, then:

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or press `a` for an Android emulator.

> First-time setup also needs a Firestore composite index for the caregiver dashboard query — Firebase will print a console link the first time you open the caregiver screen; click it once and wait ~1 minute.

## Known limitations

- Bhashini-translated languages (Hindi, Bodo, Manipuri, Nepali) have not yet been verified by native speakers — Assamese and English are the only languages currently reviewed for accuracy.
- The caregiver onboarding flow currently uses a fixed demo list of family members rather than real photo uploads.
- This is a hackathon prototype: Firestore security rules are permissive for demo purposes and would need hardening before any real deployment.
