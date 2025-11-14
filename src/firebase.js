import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDemoKey123456789", // Replace with your API key
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "todoapp-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "todoapp-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "todoapp-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Sign in anonymously
export const initAuth = () => {
  return signInAnonymously(auth)
    .then(() => {
      console.log('✅ Signed in anonymously to Firebase');
    })
    .catch((error) => {
      console.error('❌ Auth error:', error);
    });
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Add task to Firestore
export const addTaskToFirestore = async (task, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'tasks'), {
      ...task,
      createdAt: new Date(),
      syncedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding task:', error);
    throw error;
  }
};

// Update task in Firestore
export const updateTaskInFirestore = async (userId, taskId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId, 'tasks', taskId), {
      ...updates,
      syncedAt: new Date()
    });
  } catch (error) {
    console.error('❌ Error updating task:', error);
    throw error;
  }
};

// Delete task from Firestore
export const deleteTaskFromFirestore = async (userId, taskId) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToTasks = (userId, callback) => {
  try {
    const q = query(collection(db, 'users', userId, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(tasks);
    });
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error subscribing to tasks:', error);
  }
};

// Sync local tasks to Firestore (bulk operation)
export const syncLocalTasksToFirestore = async (userId, localTasks) => {
  try {
    const batch = writeBatch(db);
    const userTasksRef = collection(db, 'users', userId, 'tasks');
    
    localTasks.forEach((task) => {
      if (!task.firestoreId) {
        // New task - add to Firestore
        const docRef = doc(userTasksRef);
        batch.set(docRef, {
          ...task,
          createdAt: new Date(),
          syncedAt: new Date()
        });
        task.firestoreId = docRef.id;
      } else {
        // Existing task - update
        batch.update(doc(userTasksRef, task.firestoreId), {
          ...task,
          syncedAt: new Date()
        });
      }
    });
    
    await batch.commit();
    console.log('✅ Local tasks synced to Firestore');
  } catch (error) {
    console.error('❌ Error syncing tasks:', error);
    throw error;
  }
};
