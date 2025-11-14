# Build Android APK (Capacitor)

Panduan ini membantu kamu membuat file APK/AAB dari project React (sudah dibungkus dengan Capacitor) supaya bisa di-install di perangkat Android.

Ringkasan pilihan
- APK signed: bisa langsung di-install ke device (ideal untuk testing/distribusi manual).
- AAB (Android App Bundle): untuk upload ke Google Play (Play akan menghasilkan APK untuk tiap device).

Prerequisites (di mesin kamu)
- Android Studio terinstall (https://developer.android.com/studio)
- Android SDK & build-tools terinstall via Android Studio
- Java JDK (Android Studio sudah include)
- USB debugging enabled di device jika mau install langsung

Langkah cepat (jika kamu mau langsung build release APK):

1. Pastikan web build terbaru

```bash
# di folder project
npm install
npm run build

# copy hasil build ke project Android Capacitor
npx cap copy android
npx cap sync android
```

2. Buka project Android di Android Studio

```bash
npx cap open android
```

3. Build Signed APK (langkah di Android Studio)

- Di Android Studio: menu `Build` → `Generate Signed Bundle / APK...`
- Pilih `APK` (untuk install manual) atau `Android App Bundle` (untuk Play Store)
- Jika belum ada keystore, klik `Create new...` dan isi:
  - Key store path: (contoh) `~/keystore/todoapp.jks`
  - Passwords: buat aman
  - Key alias & key password: catat juga
- Pilih `Release` build variant, centang signature versions (V1 (Jar Signature) & V2 (Full APK Signature)).
- Selesaikan wizard dan tunggu proses build.

4. Temukan hasil build
- Signed APK biasanya berada di: `android/app/build/outputs/apk/release/app-release.apk`
- Signed AAB: `android/app/build/outputs/bundle/release/app-release.aab`

5. Install ke device (opsional)

- Aktifkan USB debugging di device
- Hubungkan device via USB
- Install menggunakan adb (Android SDK platform-tools must be in PATH)

```bash
# install APK (ganti path sesuai hasil build)
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

Catatan jika mau quick test tanpa signed release
- Kamu bisa build debug APK dari command line (tidak butuh keystore):

```bash
cd android
./gradlew assembleDebug
# hasil: android/app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Update web assets sebelum rebuild
- Setiap kali kamu mengubah kode React, ulangi:

```bash
npm run build
npx cap copy android
npx cap sync android
# lalu build ulang di Android Studio
```

Play Store publishing notes
- Untuk upload ke Play Store, buat `app-release.aab` (lebih direkomendasikan).
- Siapkan akun Google Play Developer, lengkapkan store listing, icon, screenshots.
- Gunakan keystore yang tersimpan aman untuk menandatangani release. Jangan kehilangan keystore!

Troubleshooting
- Jika Android Studio tidak mau build, pastikan Android SDK, JDK, dan gradle plugin terinstall sesuai versi.
- Untuk error dependency native/capacitor plugins, jalankan `npx cap sync android` dan periksa `android/` logs.

Butuh bantuan langsung?
- Jika mau, jalankan langkah di atas di mesinmu dan kirimkan error/log ke saya. Saya bantu baca dan perbaiki.

Good luck — beri tahu jika mau saya bantu membuat signed keystore atau men-generate AAB untuk Play Store.
