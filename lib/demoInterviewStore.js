import { getCollection } from './mongodb';
import { buildDemoInterviewDocument } from './demoInterviewData';

const COLLECTION = 'interviews';

export async function ensureDemoInterviewSession(token, { resetCompleted = true } = {}) {
  const collection = await getCollection(COLLECTION);
  const existing = await collection.findOne(
    { interviewId: token },
    { projection: { _id: 0 } }
  );

  if (!existing || (resetCompleted && existing.status === 'completed')) {
    const freshSession = buildDemoInterviewDocument(token);
    await collection.replaceOne(
      { interviewId: token },
      freshSession,
      { upsert: true }
    );
    return freshSession;
  }

  return existing;
}