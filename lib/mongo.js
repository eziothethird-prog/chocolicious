import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'chocolicious';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { maxPoolSize: 10 });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const c = await clientPromise;
  return c.db(dbName);
}
