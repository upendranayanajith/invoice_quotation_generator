import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// 1. Load .env manually to avoid dependencies
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex === -1) return;

        const key = trimmed.substring(0, equalsIndex).trim();
        let val = trimmed.substring(equalsIndex + 1).trim();

        // Remove quotes if present
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }

        process.env[key] = val;
    });
} else {
    console.error("ERROR: .env file NOT found. Cannot verify connection without credentials.");
    process.exit(1);
}

// 2. Configure Firebase
const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing keys
const missingKeys = Object.entries(config).filter(([k, v]) => !v).map(([k]) => k);
if (missingKeys.length > 0) {
    console.error("ERROR: Missing configuration keys in .env:", missingKeys.join(", "));
    console.log("Loaded keys:", Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_FIREBASE')));
    process.exit(1);
}

console.log("Configuration loaded. Project ID:", config.projectId);

// 3. Connect and Query
async function verify() {
    try {
        const app = initializeApp(config);
        const db = getFirestore(app);

        console.log("Connecting to Firestore...");
        const querySnapshot = await getDocs(collection(db, "documents"));

        console.log("\n--- DATABASE STATUS REPORT ---");
        console.log(`Connection: SUCCESS`);
        console.log(`Total Documents Found: ${querySnapshot.size}`);

        if (querySnapshot.size > 0) {
            console.log("\nRecent Documents:");
            querySnapshot.docs.slice(0, 5).forEach(doc => {
                const d = doc.data();
                console.log(`- [${d.type}] ${d.documentNumber} (${d.clientName}) - Status: ${d.status}`);
            });
        } else {
            console.log("The database is connected but empty.");
        }
        console.log("------------------------------\n");

    } catch (error) {
        console.error("\n--- CONNECTION FAILED ---");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("-------------------------\n");
    }
}

verify();
