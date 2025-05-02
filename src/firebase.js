// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyIp98INLBt7coGfwr2iyr5914HkZKMvw",
  authDomain: "movieticket-d29b4.firebaseapp.com",
  projectId: "movieticket-d29b4",
  storageBucket: "movieticket-d29b4.firebasestorage.app",
  messagingSenderId: "929634410534",
  appId: "1:929634410534:web:c932c56b50cef907cb46e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Correct export of Firestore DB
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize Storage

// Export Firestore and Storage instances
export { db, storage };