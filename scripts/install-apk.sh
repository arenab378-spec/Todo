#!/usr/bin/env bash
set -euo pipefail

APK="$1"
if [ -z "$APK" ]; then
  APK="android/app/build/outputs/apk/debug/app-debug.apk"
fi

if ! command -v adb >/dev/null 2>&1; then
  echo "ERROR: adb (Android platform-tools) not found in PATH. Install Android platform-tools and try again."
  exit 1
fi

if [ ! -f "$APK" ]; then
  echo "ERROR: APK not found at $APK"
  exit 1
fi

echo "Installing $APK to connected device(s)..."
adb install -r "$APK"
echo "Done."
