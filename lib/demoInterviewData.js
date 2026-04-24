export const DEMO_INTERVIEW_TOKEN = 'demo-valid';
export const DEMO_INTERVIEW_EMAIL = 'swarajgaikwad019@gmail.com';

export const DEMO_CANDIDATE = {
  id: 'cand_demo_001',
  name: 'Swaraj Gaikwad',
  email: DEMO_INTERVIEW_EMAIL,
  yearsExperience: 0,
  skills: [
    'javascript',
    'c++',
    'sql',
    'html5',
    'react',
    'node.js',
    'express.js',
    'mongodb',
    'websockets',
    'jwt',
    'express',
    'backblaze b2 storage',
    'mern stack',
    'razorpay',
    'cloudinary',
    'gemini api-integration',
    'clerk.dev'
  ],
  projects: [
    {
      name: 'Codeverse',
      techStack: [
        'React',
        'Node.js',
        'Express.js',
        'MongoDB',
        'Websockets',
        'Jwt'
      ],
      description:
        'Built a Real-time collaborative IDE with live Coding and Video conferencing (like Replit + Zoom). Integrated WebRTC for peer-to-peer video communication during collaborative sessions',
    },
    {
      name: 'CloudShare',
      techStack: [
        'React',
        'Node.js',
        'Express',
        'MongoDB',
        'Backblaze B2 Storage'
      ],
      description:
        'Developed a secure cloud storage platform using MERN stack. Implemented file upload, public/private sharing, real-time search, and fast downloads, Reduced storage cost by 30% using Backblaze B2',
    },
    {
      name: 'Calistaa',
      techStack: [
        'Mern stack',
        'Razorpay',
        'Cloudinary',
        'Jwt'
      ],
      description:
        'Designed a user-centric full-stack platform for booking curated travel experiences using the MERN stack. Integrated Razorpay for payments and Cloudinary for image hosting',
    },
    {
      name: 'PrepXpert',
      techStack: [
        'Mern stack',
        'Gemini Api-Integration',
        'Clerk.Dev'
      ],
      description:
        'AI-driven Interview preparation platform to prepare for interview QA with deep explanations. Session-based personalized UI with inputs like role, experience, and topics; content is structured and expandable (option to explore deep answer), increasing user engagement by 30%.',
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