export const DEMO_INTERVIEW_TOKEN = 'demo-valid';
export const DEMO_INTERVIEW_EMAIL = 'rahul@example.com';

export const DEMO_CANDIDATE = {
  id: 'cand_demo_001',
  name: 'Rahul Sharma',
  email: DEMO_INTERVIEW_EMAIL,
  yearsExperience: 2,
  skills: [
    'React',
    'Node.js',
    'Python',
    'Firebase',
    'MongoDB',
    'TailwindCSS',
    'Next.js',
  ],
  projects: [
    {
      name: 'AI Trip Planner',
      techStack: ['React', 'Firebase', 'Gemini API', 'TailwindCSS'],
      description:
        'AI-powered travel planning app that generates personalized itineraries based on user preferences, budget, and travel dates.',
    },
    {
      name: 'E-Commerce Platform',
      techStack: ['Next.js', 'MongoDB', 'Stripe', 'Node.js'],
      description:
        'Full-stack e-commerce with product catalog, Stripe payments, and role-based admin dashboard.',
    },
    {
      name: 'Real-Time Chat Application',
      techStack: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
      description:
        'Real-time messaging app with private/group chat, typing indicators, read receipts, and file sharing via WebSockets.',
    },
  ],
};

export const DEMO_JOB = {
  id: 'job_demo_001',
  title: 'Full Stack Developer',
  requiredSkills: ['React', 'Node.js', 'System Design', 'REST APIs', 'Database Design'],
  experienceLevel: 'Junior to Mid-Level (1-3 years)',
  description:
    'Build and maintain customer-facing web applications using React and Node.js.',
};

export function isDemoInterviewToken(token) {
  return token?.trim() === DEMO_INTERVIEW_TOKEN;
}

export function getInterviewSessionStorageKey(token) {
  return `interview_session_${token?.trim() ?? ''}`;
}

export function buildDemoSessionStorageRecord(email = DEMO_INTERVIEW_EMAIL) {
  return {
    token: DEMO_INTERVIEW_TOKEN,
    email,
    candidateName: DEMO_CANDIDATE.name,
    jobTitle: DEMO_JOB.title,
    validatedAt: new Date().toISOString(),
  };
}

export function buildDemoInterviewDocument() {
  return {
    interviewId: DEMO_INTERVIEW_TOKEN,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    candidate: DEMO_CANDIDATE,
    job: DEMO_JOB,
    conversationHistory: [],
  };
}