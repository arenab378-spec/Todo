#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=> Installing node dependencies (if needed)"
npm install

echo "=> Building web assets"
npm run build

echo "=> Copying web assets to Capacitor Android project"
npx cap copy android
npx cap sync android

echo "=> Building debug APK with Gradle"
cd android
if [ -x "./gradlew" ]; then
  ./gradlew assembleDebug
else
  echo "ERROR: Gradle wrapper not found or not executable. Ensure Android SDK/Java installed."
  exit 1
fi

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
  OUT="$ROOT/build-app-debug.apk"
  cp "$APK_PATH" "$OUT"
  echo "=> APK built: $OUT"
else
  echo "ERROR: APK not found at $APK_PATH"
  exit 1
fi
