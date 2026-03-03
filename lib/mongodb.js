import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGODB_URI;
const DB_NAME = "resultwalla";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (!MONGO_URL) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGO_URL);
  await client.connect();

  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
