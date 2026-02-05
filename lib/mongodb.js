import mongoose from "mongoose";
import dns from "dns";

// Fix for DNS resolution issues with MongoDB Atlas SRV records
function applyDnsFix() {
    if (process.env.NODE_ENV !== "production") {
        try {
            dns.setServers(["8.8.8.8", "8.8.4.4"]);
        } catch (e) {
            console.warn("Failed to set DNS servers:", e.message);
        }
    }
}


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    applyDnsFix();
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            connectTimeoutMS: 10000, // 10 seconds timeout
            family: 4, // Force IPv4
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        }).catch(err => {
            cached.promise = null; // Clear promise on error so we can retry
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Ensure promise is cleared if await fails
        throw e;
    }

    return cached.conn;
}

export default connectDB;
