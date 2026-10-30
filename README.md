# Krishi_Barta

A voice and text based agricultural assistant for farmers in Bangladesh. It brings market prices, weather, pesticide guidance and agriculture office contacts into one Android app, and answers questions in Bangla by text or speech.

![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter)
![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android)
![Backend](https://img.shields.io/badge/Backend-Flask-000000?logo=flask)

---

## Overview

Many farmers rely on middlemen or word of mouth for daily prices, weather and pesticide advice. This information is scattered and rarely available in Bangla or by voice. Krishi_Barta puts it in one place, with a chatbot at the centre so a farmer can simply ask.

## Features

- **Chatbot:** full-screen assistant that accepts text or Bangla speech and reads replies aloud.
- **Market prices:** searchable list of crop prices with voice search.
- **Weather:** live conditions by district.
- **Pesticide guidance:** searchable crop and pest information.
- **Krishi offices:** searchable agriculture office contacts.
- **Voice everywhere:** a speaker logo on every list screen, and results are read aloud automatically.
- **Bangla speech output:** numbers are converted to Bangla digits and units are cleaned before speaking.

## Example Questions

| Question (Bangla) | Meaning | Source |
|---|---|---|
| আজকে আলুর দাম কত? | Today's potato price? | Flask API |
| ঢাকার আবহাওয়া কেমন? | Weather in Dhaka? | Open-Meteo |
| ধানের দাম? | Rice price? | Flask API |

If no answer is found, the bot says so instead of guessing.

## Architecture

```
Farmer (voice / text)
        |
   Flutter app  -->  Intent detection (Bangla keywords)
        |                    |
        |          +---------+-----------+
        |          |                     |
        |     Flask API (Render)    Open-Meteo API
        |     prices, pesticides,   weather
        |     offices
        v
 Answer shown + read aloud (TTS)
```

The chatbot is rule-based. It matches keywords such as price, weather, pesticide and office, then fetches data from the matching source. Common Bangladeshi district names are resolved from a local coordinate table, because online geocoding handled Bangla names unreliably.

## Tech Stack

| Component | Purpose |
|---|---|
| Flutter (Dart) | Android front end |
| Flask (Python) | REST backend (`Krishi_bart_app_backend`) for prices, pesticides and offices |
| Render | Backend hosting |
| Open-Meteo | Free weather API, no key needed |
| `speech_to_text` | Bangla (`bn_BD`) voice input |
| `flutter_tts` | Bangla speech output |
| `http` | Network requests |

## Repository Structure

```
.
├── KrishiBarta/                  # Flutter Android app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── config.dart           # Backend base URL
│   │   ├── models/               # PriceItem, PesticideItem, KrishiOffice
│   │   ├── screens/              # Home, Chat, Price, Weather, Pesticide, Office
│   │   ├── services/             # api_service, chat_service, tts_service
│   │   ├── utils/                # Bangla number and unit formatting
│   │   └── widgets/              # MicButton, ChatFab, hero transition, shared UI
│   ├── assets/images/app_bg.jpg  # Home and drawer background
│   └── pubspec.yaml
└── Krishi_bart_app_backend/      # Flask backend, deployed on Render
```

## Getting Started

### Prerequisites

- Flutter SDK (Dart `>=3.0.0 <4.0.0`)
- Android Studio, or an Android device with USB debugging
- Python 3 (only if you run the backend locally)

### 1. Clone

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Backend (`Krishi_bart_app_backend`)

The backend is already deployed on Render, so you can skip this step and use the hosted URL. To run it locally:

```bash
cd Krishi_bart_app_backend
pip install -r requirements.txt
python app.py
```

The entry file name may differ in your setup. Adjust the last command accordingly.

### 3. App (`KrishiBarta`)

```bash
cd KrishiBarta
flutter pub get
```

**Configure the backend URL** in `lib/config.dart` (Render URL, or `http://10.0.2.2:<port>` for a local server on the Android emulator).

**Register the background image** in `pubspec.yaml`:

```yaml
flutter:
  uses-material-design: true
  assets:
    - assets/images/app_bg.jpg
```

**Android permissions**: in `android/app/src/main/AndroidManifest.xml` add:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
```

and inside `<queries>`:

```xml
<intent>
    <action android:name="android.speech.RecognitionService" />
</intent>
```

### 4. Run

```bash
flutter run
```

### 5. Build a release APK

```bash
flutter build apk --release
```

The APK is created at `build/app/outputs/flutter-apk/app-release.apk`.

## Notes

- Voice input and Bangla speech output need a device with Google speech services and a Bangla voice installed.
- Free-tier Render servers sleep when idle, so the first request after a pause can be slow.

## Limitations

- Keyword-based understanding: unusual phrasing may not be recognised.
- Weather outside the built-in district list depends on the online geocoder.
- Android only, and an internet connection is required.

## Roadmap

- [ ] Store daily price history
- [ ] Forecast trending crops for the coming week or season
- [ ] Language-model chatbot for more natural questions
- [ ] Offline support

## Author

**Ishtiak Ahmed Ayon** (IT-24039)
Department of Information and Communication Technology, Mawlana Bhashani Science and Technology University
Supervisor: Dr. Nazrul Islam, Associate Professor

## License

Add a license of your choice (for example MIT) and state it here.