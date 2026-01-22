require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Fallback to .env if .env.local doesn't allow it, but Next.js usually uses .env.local
// We will try loading .env if MONGODB_URI is still missing
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: '.env' });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env or .env.local');
    process.exit(1);
}

console.log('Found MONGODB_URI:', MONGODB_URI.substring(0, 15) + '...');

async function checkConnection() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB!');
        console.log('Connection state:', mongoose.connection.readyState);
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

checkConnection();
