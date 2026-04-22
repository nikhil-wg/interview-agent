import { MongoClient } from 'mongodb';

// Module-level singleton promise — created lazily so the missing-env error
// surfaces at runtime (during an actual DB call), not at module import time.
let clientPromise = null;

function getClientPromise() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGO_URI;
  console.log("URL",uri);
  
  if (!uri) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Add it to your .env.local file.'
    );
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === 'development') {
    // In development, preserve the connection across hot-module reloads.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }

  return clientPromise;
}

export default getClientPromise;

/**
 * Returns the connected MongoClient instance.
 */
export async function getClient() {
  return getClientPromise();
}

/**
 * Returns the application database.
 * Uses the database name encoded in MONGODB_URI, or overridden via MONGODB_DB.
 */
export async function getDb() {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB);
}

/**
 * Returns a named collection from the application database.
 * @param {string} name - Collection name
 */
export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}
