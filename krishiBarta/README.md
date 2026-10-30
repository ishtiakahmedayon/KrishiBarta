# কৃষিঅ্যাপ (KrishiApp)

বাংলাদেশের কৃষকদের জন্য একটি Flutter মোবাইল অ্যাপ।

## ৪টি ট্যাব

| ট্যাব | বিষয় |
|-------|-------|
| সবজির দাম | সবজি, মশলা, শস্য ও অন্যান্য পণ্যের বাজার দর |
| আবহাওয়া | যেকোনো জেলার লাইভ আবহাওয়া (Open-Meteo) |
| কীটনাশক তথ্য | ফসলভিত্তিক কীটনাশকের নাম, মাত্রা ও সতর্কতা |
| কৃষি অফিস | জেলাভিত্তিক কৃষি অফিসের ঠিকানা, ফোন ও সেবা |

## Flutter সেটআপ

```bash
flutter pub get
flutter run          # এমুলেটর বা ডিভাইসে রান করুন
flutter build apk    # APK তৈরি করুন
```

## API কনফিগারেশন

`lib/config.dart` ফাইলে `apiBaseUrl` পরিবর্তন করুন:

```dart
// Android emulator
static const String apiBaseUrl = 'http://10.0.2.2/api';

// Physical device (same WiFi)
static const String apiBaseUrl = 'http://192.168.1.X/api';

// Deployed Replit
static const String apiBaseUrl = 'https://your-replit-domain.replit.app/api';
```

## Android HTTP Permission

`android/app/src/main/AndroidManifest.xml`-এ যোগ করুন:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

`<application>` ট্যাগে `usesCleartextTraffic` যোগ করুন (dev এর জন্য):

```xml
<application android:usesCleartextTraffic="true" ...>
```

## ব্যাকএন্ড API

Flask backend চলছে `artifacts/api-server/` ফোল্ডারে।

Endpoints:
- `GET /api/prices` — সব পণ্যের দাম
- `GET /api/prices/categories` — ক্যাটাগরি তালিকা
- `GET /api/pesticides` — কীটনাশক তথ্য
- `GET /api/pesticides/crops` — ফসলের তালিকা
- `GET /api/krishi_offices` — কৃষি অফিস তথ্য
- `GET /api/krishi_offices/districts` — জেলার তালিকা
- `GET /api/health` — সার্ভার স্ট্যাটাস
