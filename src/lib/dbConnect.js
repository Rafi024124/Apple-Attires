import { MongoClient, ServerApiVersion } from 'mongodb';

export const collectionNamesObj = {
  coversCollection: "covers",
  adminsCollection: 'admins',
  ordersCollection: "orders", 
  orderSummariesCollection: "orderSummaries", 
};

let client;
let isConnected = false;

export default async function dbConnect(collectionName) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing from environment variables');
  }

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  const dbName = process.env.DB_NAME || 'default_db_name';
  return client.db(dbName).collection(collectionName);
}
