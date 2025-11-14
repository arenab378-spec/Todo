# Firebase Cloud Sync Setup Guide

Aplikasi TodoApp kini mendukung **Cloud Sync dengan Firebase Firestore**! Ini memungkinkan kamu untuk:
- ☁️ Sinkronisasi tasks antar device secara real-time
- 💾 Backup otomatis di cloud
- 📱 Akses tasks dari mana saja
- 🔄 Offline mode dengan sync otomatis saat online

## Setup Firebase Project

### 1. Create Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Create a new project"**
3. Nama project: `TodoApp` (atau nama lain pilihan kamu)
4. Pilih region terdekat dengan lokasi kamu
5. Klik **"Create project"**

### 2. Setup Firestore Database

1. Di Firebase Console, pilih project kamu
2. Klik **"Firestore Database"** di sidebar (atau di "Build" menu)
3. Klik **"Create Database"**
4. Pilih region (gunakan yang terdekat: `asia-southeast1` untuk Indonesia)
5. Pilih **"Start in test mode"** (untuk development; nanti bisa set security rules yang proper)
6. Klik **"Enable"**

### 3. Setup Authentication (Anonymous)

1. Di Firebase Console, klik **"Authentication"** → **"Get started"**
2. Pilih provider **"Anonymous"** dari tab "Sign-in method"
3. Klik **"Enable"**
4. Klik **"Save"**

### 4. Get Firebase Config

1. Di Firebase Console, klik ⚙️ **"Project Settings"** (kanan atas)
2. Scroll ke bawah ke bagian **"Your apps"**
3. Jika belum ada, klik **"</> Web"** untuk menambah web app
4. Copy config object yang tampil

Harusnya kelihatan seperti ini:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "todoapp-xxx.firebaseapp.com",
  projectId: "todoapp-xxx",
  storageBucket: "todoapp-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

### 5. Update `.env` File

1. Buka file `.env` di project root
2. Replace placeholder values dengan config dari Firebase:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=todoapp-xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=todoapp-xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=todoapp-xxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc...
```

3. Save file `.env`

### 6. Restart Dev Server

Setelah update `.env`, restart `npm start` agar environment variables ter-load:

```bash
npm start
```

## How It Works

### Cloud Sync Flow

```
User adds task
       ↓
App saves locally (instant feedback)
       ↓
App attempts Firestore sync
       ↓
Success? → ✅ Status "Synced"
Fail?    → ⚠️ Status "Sync Error" + Offline Mode
       ↓
Firestore updates in real-time across devices
```

### Firestore Database Structure

```
users/
  └── {userId}/
      └── tasks/
          ├── {taskId1}
          │   ├── text: "Beli susu"
          │   ├── completed: false
          │   ├── due: "2024-11-20T10:00:00Z"
          │   ├── tags: ["shopping", "urgent"]
          │   ├── recurrence: "daily"
          │   ├── createdAt: Timestamp
          │   └── syncedAt: Timestamp
          └── {taskId2}
              └── ...
```

## Features

### ✅ Real-Time Sync
- Setiap perubahan di satu device langsung muncul di device lain
- Menggunakan Firestore real-time listeners

### 📶 Offline Mode
- Jika offline, app tetap bisa bekerja
- Perubahan disimpan ke localStorage
- Saat online kembali, otomatis sync ke cloud

### 🔐 Anonymous Auth
- Tidak perlu login dengan email/password
- Setiap user dapat anonymous ID unik
- Data aman di Firestore per user

### ⚡ Instant Feedback
- Optimistic update: task langsung ditampilkan UI
- Background sync ke Firestore
- User tidak perlu menunggu

## Status Indicators

App menampilkan sync status di top:

- **⟳ Syncing...** → Sedang sync ke cloud
- **✅ Synced** → Semua data ter-sync
- **⚠️ Sync Error** → Gagal sync (tapi app tetap bisa offline)
- **📶 Offline Mode** → Internet mati, bekerja offline
- **👤 User ID** → Anonymous ID untuk Firestore

## Troubleshooting

### "Sync Error" Muncul Terus

**Kemungkinan penyebab:**
1. Firebase config salah di `.env`
2. Firestore belum di-enable
3. Security rules tidak allow read/write

**Solusi:**
- Cek `.env` sudah benar
- Restart `npm start`
- Cek Firebase Console > Firestore > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Tasks Tidak Muncul Antar Device

**Kemungkinan penyebab:**
- Firestore listener belum aktif
- User IDs berbeda antar device

**Solusi:**
- Buka browser console (`F12`), cek logs
- Pastikan anonymous auth aktif di Firebase Console
- Tunggu 3-5 detik untuk first sync

### Perlu Buat Firestore Manually

Jika Firestore collection tidak ter-create otomatis:

1. Firebase Console → Firestore
2. Klik **"+ Add collection"**
3. Nama: `users`
4. Di document, klik **"+ Add collection"**
5. Nama: `tasks`
6. Klik **"Add document"** dan isi contoh data

Atau let the app auto-create dengan menambah task pertama!

## Next Steps

### Advanced: Real Login with Email

Jika mau login proper dengan email:

1. Update `firebase.js`: ganti `signInAnonymously()` dengan `signInWithEmailAndPassword()`
2. Tambah login form di App.js
3. Update Firestore rules sesuai

### Advanced: Backup & Export

Tambah fitur untuk export tasks ke JSON:

```javascript
const exportTasks = () => {
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks-backup.json';
  a.click();
};
```

### Advanced: Multi-User Collaboration

Setup Firebase rules untuk allow sharing antar user:

```javascript
match /shared/{sharedTaskId} {
  allow read, write: if request.auth != null;
}
```

## Security Considerations

⚠️ **Current (Test Mode):**
- Anonymous auth enabled
- Firestore in test mode (anyone can read/write)

✅ **For Production:**
1. Setup proper authentication (Email/Google/etc)
2. Restrict Firestore rules to own user only:
   ```
   match /users/{userId}/tasks/{document=**} {
     allow read, write: if request.auth.uid == userId;
   }
   ```
3. Enable CORS properly
4. Add rate limiting
5. Add data validation

## Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Authentication Methods](https://firebase.google.com/docs/auth)
- [React Integration](https://firebase.google.com/docs/web/setup)

## Disable Cloud Sync

Jika mau disable cloud sync dan kembali ke localStorage only:

1. Edit `src/App.js`
2. Comment out import Firebase:
   ```javascript
   // import { initAuth, ... } from './firebase';
   ```
3. Comment out Firebase calls dalam functions
4. Remove `.env` file (optional)
5. App akan tetap bekerja dengan localStorage

---

**Selamat! Cloud sync kamu sudah siap! ☁️**
