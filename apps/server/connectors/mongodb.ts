import mongoose, { connect, connection, Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quizapp";
const db = mongoose.connection;
const connectDB = async () => {
    let attempts = 0;
    while (attempts < 5) {
        try {
            await connect(MONGO_URI, {
            });
            console.log("MongoDB connected");
            break;
        } catch (error) {
            attempts++;
            console.error("MongoDB connection error:", error);
            console.log(`Attempting to reconnect... (${attempts})`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
    }
    if (attempts >= 5) {
        process.exit(1); // Exit process after repeated failures
    }
};

export { connectDB, db };
