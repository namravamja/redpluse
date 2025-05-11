import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("❌ Missing MONGO_URI in environment variables");

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;
