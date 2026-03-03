/**
 * In-memory interview session store.
 *
 * In production you would swap this for a database (Postgres, MongoDB, Redis, etc.).
 * This module provides a thin abstraction so the rest of the codebase remains the same
 * when you migrate to a persistent store later.
 */

const sessions = new Map();

// ── DEMO / SEED DATA ─────────────────────────────────────────────────────────
// These are automatically available so the demo tokens in the home page work.

const DEMO_INTERVIEWS = {
  'demo-valid': {
    interviewId: 'demo-valid',
    status: 'pending',          // pending | in_progress | completed | expired | invalid
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    duration: 0,
    verifiedEmail: null,

    candidate: {
      id: 'cand-001',
      name: 'Rahul Sharma',
      yearsExperience: 2,
      skills: ['React', 'Node.js', 'Python', 'Firebase', 'MongoDB', 'TailwindCSS', 'Next.js'],
      projects: [
        {
          name: 'AI Trip Planner',
          techStack: ['React', 'Firebase', 'Gemini API', 'TailwindCSS'],
          description:
            'An AI-powered travel planning app that generates personalized itineraries based on user preferences, budget, and travel dates. Uses Gemini API for intelligent recommendations and Firebase for real-time data storage and authentication.',
        },
        {
          name: 'E-Commerce Platform',
          techStack: ['Next.js', 'MongoDB', 'Stripe', 'Node.js'],
          description:
            'A full-stack e-commerce platform with product catalog, cart management, Stripe payment integration, and admin dashboard. Supports multi-vendor setup with role-based access control.',
        },
        {
          name: 'Real-Time Chat Application',
          techStack: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
          description:
            'A real-time messaging application with private and group chat support, typing indicators, read receipts, and file sharing. Uses WebSockets for instant message delivery.',
        },
      ],
    },

    job: {
      id: 'job-001',
      title: 'Full Stack Developer',
      requiredSkills: ['React', 'Node.js', 'System Design', 'REST APIs', 'Database Design'],
      experienceLevel: 'Junior to Mid-Level (1-3 years)',
    },

    conversationHistory: [],
    evaluation: null,
  },
};

// Seed demo data
for (const [token, data] of Object.entries(DEMO_INTERVIEWS)) {
  sessions.set(token, data);
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/**
 * Retrieve a session by token (interviewId).
 * @param {string} token
 * @returns {object|null}
 */
export function getSession(token) {
  return sessions.get(token) || null;
}

/**
 * Create a new interview session.
 * @param {object} data - Full interview session object
 * @returns {object} The created session
 */
export function createSession(data) {
  sessions.set(data.interviewId, data);
  return data;
}

/**
 * Update an existing session (shallow merge).
 * @param {string} token
 * @param {object} updates
 * @returns {object|null} Updated session or null
 */
export function updateSession(token, updates) {
  const session = sessions.get(token);
  if (!session) return null;
  const updated = { ...session, ...updates };
  sessions.set(token, updated);
  return updated;
}

/**
 * Append a message to the session's conversation history.
 * @param {string} token
 * @param {{role: string, content: string}} message
 * @returns {object|null}
 */
export function appendMessage(token, message) {
  const session = sessions.get(token);
  if (!session) return null;
  session.conversationHistory.push(message);
  sessions.set(token, session);
  return session;
}

/**
 * Get the count of user messages (exchanges) so far.
 * @param {string} token
 * @returns {number}
 */
export function getExchangeCount(token) {
  const session = sessions.get(token);
  if (!session) return 0;
  return session.conversationHistory.filter((m) => m.role === 'user').length;
}

/**
 * Delete a session.
 * @param {string} token
 */
export function deleteSession(token) {
  sessions.delete(token);
}
