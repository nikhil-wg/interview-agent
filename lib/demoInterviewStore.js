import { getCollection } from './mongodb';
import { DEMO_INTERVIEW_TOKEN, buildDemoInterviewDocument } from './demoInterviewData';

const COLLECTION = 'interviews';

export async function ensureDemoInterviewSession({ resetCompleted = true } = {}) {
  const collection = await getCollection(COLLECTION);
  const existing = await collection.findOne(
    { interviewId: DEMO_INTERVIEW_TOKEN },
    { projection: { _id: 0 } }
  );

  if (!existing || (resetCompleted && existing.status === 'completed')) {
    const freshSession = buildDemoInterviewDocument();
    await collection.replaceOne(
      { interviewId: DEMO_INTERVIEW_TOKEN },
      freshSession,
      { upsert: true }
    );
    return freshSession;
  }

  return existing;
}