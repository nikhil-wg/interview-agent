/**
 * MongoDB-backed interview session store.
 *
 * All public functions are async and map directly to MongoDB operations
 * on the `interviews` collection.  The recruiter platform owns document
 * creation; this module only reads and updates existing documents.
 */

import { getCollection } from './mongodb';

const COLLECTION = 'interviews';

// ── Internal helper ───────────────────────────────────────────────────────────

async function col() {
  return getCollection(COLLECTION);
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/**
 * Retrieve a session by interviewId (token).
 * Returns the document without the MongoDB `_id` field, or null.
 * @param {string} token
 * @returns {Promise<object|null>}
 */
export async function getSession(token) {
  const c = await col();
  return c.findOne({ interviewId: token }, { projection: { _id: 0 } });
}

/**
 * Shallow-merge `updates` into an existing session document.
 * Returns the updated document or null if not found.
 * @param {string} token
 * @param {object} updates
 * @returns {Promise<object|null>}
 */
export async function updateSession(token, updates) {
  const c = await col();
  const result = await c.findOneAndUpdate(
    { interviewId: token },
    { $set: updates },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return result ?? null;
}

/**
 * Append a single message object to the conversationHistory array.
 * @param {string} token
 * @param {{ role: string, content: string }} message
 * @returns {Promise<object|null>} Updated document or null
 */
export async function appendMessage(token, message) {
  const c = await col();
  const result = await c.findOneAndUpdate(
    { interviewId: token },
    { $push: { conversationHistory: message } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  return result ?? null;
}

/**
 * Count the number of candidate (user-role) turns in the conversation so far.
 * @param {string} token
 * @returns {Promise<number>}
 */
export async function getExchangeCount(token) {
  const c = await col();
  const doc = await c.findOne(
    { interviewId: token },
    { projection: { conversationHistory: 1 } }
  );
  if (!doc) return 0;
  return (doc.conversationHistory || []).filter((m) => m.role === 'user').length;
}
