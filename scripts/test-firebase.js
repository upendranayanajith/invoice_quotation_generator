const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc, deleteDoc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyCv6OAvn3AIfUZ2t8pEAU-fhGdVKuT4G0Y",
    authDomain: "in-quo-db.firebaseapp.com",
    projectId: "in-quo-db",
    storageBucket: "in-quo-db.firebasestorage.app",
    messagingSenderId: "198105375817",
    appId: "1:198105375817:web:be815adab501159b8ecb98",
    measurementId: "G-8T9R9YDNMH"
};

console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
    try {
        console.log("Attempting to write a test document...");
        const testCol = collection(db, "connection_test");
        const docRef = await addDoc(testCol, {
            timestamp: new Date().toISOString(),
            message: "Hello from Invoice Generator!"
        });
        console.log("✅ Written test document with ID:", docRef.id);

        console.log("Attempting to delete the test document...");
        await deleteDoc(docRef);
        console.log("✅ Deleted test document.");
        console.log("🎉 Firebase Connection Successful!");
    } catch (error) {
        console.error("❌ Firebase Connection Failed:", error.message);
        if (error.code === 'permission-denied') {
            console.error("   Hint: Check your Firestore Security Rules.");
        }
    }
}

testConnection();
