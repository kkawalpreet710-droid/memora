# CogniCare - setup

## 1. Install
```
npm install
```

## 2. Add your Firebase project
1. Go to console.firebase.google.com -> Create project (free, no billing needed)
2. Add a Web app inside that project (the "</>" icon)
3. Copy the config object it gives you into `firebase/config.js`
4. In the Firebase console, enable:
   - Build -> Firestore Database -> Create database (start in test mode for the hackathon)
   - Build -> Authentication -> not required yet since we're using a link code, not real login

## 3. Run on a real device
```
npx expo start
```
- Install the "Expo Go" app on your phone (Play Store / App Store)
- Scan the QR code shown in the terminal
- App opens live on your phone, no build/compile step

## 4. What's built so far
- Role selection screen (patient / caregiver + shared link code) - working
- Pattern recall game - working, writes results to Firestore, adapts difficulty
- Face-name matching game - working, same pattern as above
- Caregiver screen - working, live chart + session history from Firestore
- Language toggle (English / Assamese) - working, persists per device
- Voice playback of instructions via device text-to-speech - working
- Firebase config file - needs your team's actual project keys pasted in

## 5. What to build next, in order
1. Add a real onboarding flow for caregivers to add family members with
   real photos (currently the face-name game uses a fixed demo list with
   initials-only avatars in constants/people.js)
2. Add more languages by adding a new key to constants/translations.js
   (same string keys, different language) - no other code changes needed
3. Small polish pass: loading states, error handling on poor connectivity
4. Optional: swap the initials avatars for uploaded caregiver photos once
   you add image picker + storage

## 6. One-time Firestore setup step
The caregiver screen's live query filters by linkCode AND sorts by time,
which needs a composite index. The first time you run the app and open the
caregiver screen, check your terminal / Metro logs for a Firestore error
containing a link like `https://console.firebase.google.com/.../indexes?...`
Click it once, wait ~1 minute for the index to build, and it works from then on.
Do this well before your demo, not five minutes before you present.


## 7. Note on Assamese translations
The Assamese strings in constants/translations.js are a starting point for
the demo, not verified by a native speaker. If anyone on your team reads
Assamese, please review and correct constants/translations.js before your
presentation - this matters for credibility with judges from the region.
