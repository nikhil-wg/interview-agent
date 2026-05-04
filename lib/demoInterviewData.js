export const DEMO_INTERVIEW_TOKEN = 'demo-valid';
export const DEMO_INTERVIEW_EMAIL = 'swarajgaikwad019@gmail.com';

const DEMO_CANDIDATES = {
  'demo-valid': {
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
        techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Websockets', 'Jwt'],
        description: 'Built a Real-time collaborative IDE with live Coding and Video conferencing (like Replit + Zoom). Integrated WebRTC for peer-to-peer video communication during collaborative sessions',
      },
      {
        name: 'CloudShare',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Backblaze B2 Storage'],
        description: 'Developed a secure cloud storage platform using MERN stack. Implemented file upload, public/private sharing, real-time search, and fast downloads, Reduced storage cost by 30% using Backblaze B2',
      },
      {
        name: 'Calistaa',
        techStack: ['Mern stack', 'Razorpay', 'Cloudinary', 'Jwt'],
        description: 'Designed a user-centric full-stack platform for booking curated travel experiences using the MERN stack. Integrated Razorpay for payments and Cloudinary for image hosting',
      },
      {
        name: 'PrepXpert',
        techStack: ['Mern stack', 'Gemini Api-Integration', 'Clerk.Dev'],
        description: 'AI-driven Interview preparation platform to prepare for interview QA with deep explanations. Session-based personalized UI with inputs like role, experience, and topics; content is structured and expandable (option to explore deep answer), increasing user engagement by 30%.',
      },
    ],
  },
  'demo2': {
    id: 'cand_demo_002',
    name: 'Yash Jejurkar',
    email: 'yashjejurkar2004@gmail.com',
    yearsExperience: 0,
    skills: [
      'typescript', 'javascript', 'python', 'c++', 'sql', 'html5', 'css3', 
      'next.js', 'node.js', 'websockets', 'redis', 'turborepo', 'postgresql', 
      'prisma', 'react', 'tailwind css', 'express.js', 'mongodb', 'ethers.js', 'solana.js'
    ],
    projects: [
      {
        name: 'Lynx’s Draw',
        techStack: ['Next.js', 'Node.js', 'WebSockets', 'Redis', 'Turborepo', 'PostgreSQL', 'Prisma'],
        description: 'Built a real-time collaborative whiteboard supporting 10–20 concurrent users with <80ms latency. Used Redis Pub/Sub to sync canvas operations, reducing data conflicts by 60%. Implemented a monorepo architecture using Turborepo that improved developer build times by 35%. Designed a scalable backend capable of handling 5,000+ socket events/minute.'
      },
      {
        name: 'Second Brain',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB'],
        description: 'Developed a personal knowledge vault where users saved 200+ pieces of content (YT videos, tweets, articles). Built a scraping pipeline that reduced metadata fetch time by 50%. Implemented secure public sharing using encrypted IDs, resulting in 100% share success rate without collisions. Improved UI navigation and reduced page load by 30% using optimized React patterns.'
      },
      {
        name: 'Web-Based Wallet',
        techStack: ['React', 'Tailwind CSS', 'Ethers.js', 'Solana.js'],
        description: 'Built a multi-chain wallet capable of generating 100+ HD wallets from a single mnemonic. Implemented key generation, address viewing, and test transactions. Designed a clean, responsive UI using Tailwind CSS and React.'
      }
    ]
  },
  'demo3': {
    id: 'cand_demo_003',
    name: 'Nikhil Wagh',
    email: 'nikhil.waghh@gmail.com',
    yearsExperience: 0,
    skills: [
      'c++', 'python', 'sql(postgres, mysql)', 'nosql(mongodb)', 'javascript',
      'typescript', 'html', 'css', 'react', 'node.js', 'express.js', 'fastapi',
      'tailwind css', 'material-ui', 'git', 'docker', 'google cloud platform',
      'ci/cd', 'linux', 'vs code', 'data analysis', 'trend analysis',
      'system design', 'problem solving', 'performance optimization',
      'customer-focused development', 'next.js', 'convex', 'langchain',
      'clerk', 'paypal', 'firebase', 'google auth', 'google places api',
      'google gemini ai', 'vector search'
    ],
    projects: [
      {
        name: 'Ask to Doc – SaaS AI Document Assistant (2025)',
        techStack: ['Next.js', 'Convex', 'LangChain', 'Clerk', 'PayPal'],
        description: 'Developed a SaaS web application enabling PDF querying using AI, improving data accessibility and information retrieval.'
      },
      {
        name: 'AI Trip Planner (2025)',
        techStack: ['React', 'Node.js', 'Firebase', 'Google Auth', 'Google Places API'],
        description: 'Developed a scalable full-stack application leveraging modern frameworks and data-driven insights.'
      },
      {
        name: 'NASA Bioscience Knowledge Engine (2025)',
        techStack: ['Next.js', 'Convex', 'Google Gemini AI', 'LangChain', 'Vector Search'],
        description: 'Developed an AI-powered search engine enabling data analysis and knowledge extraction from scientific documents.'
      }
    ]
  }
};

const DEMO_JOBS = {
  'demo-valid': {
    id: 'job_demo_001',
    title: 'Full Stack Developer',
    requiredSkills: ['React', 'Node.js', 'System Design', 'REST APIs', 'Database Design'],
    experienceLevel: 'Junior to Mid-Level (1-3 years)',
    description: 'Build and maintain customer-facing web applications using React and Node.js.',
  },
  'demo2': {
    id: 'job_demo_002',
    title: 'Frontend Developer',
    requiredSkills: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'WebSockets'],
    experienceLevel: 'Entry-Level (0-2 years)',
    description: 'Build responsive and real-time frontend applications using Next.js and secure web architectures.',
  },
  'demo3': {
    id: 'job_demo_003',
    title: 'AI Full Stack Engineer',
    requiredSkills: ['Next.js', 'React', 'Node.js', 'LangChain', 'Vector Search'],
    experienceLevel: 'Entry-Level (0-2 years)',
    description: 'Build AI-powered web applications using modern full-stack technologies, vector databases, and LLM integrations.',
  }
};

export const DEMO_TOKENS = ['demo-valid', 'demo2', 'demo3'];

export function isDemoInterviewToken(token) {
  return DEMO_TOKENS.includes(token?.trim());
}

export function getInterviewSessionStorageKey(token) {
  return `interview_session_${token?.trim() ?? ''}`;
}

export function buildDemoSessionStorageRecord(token = DEMO_INTERVIEW_TOKEN, email = null) {
  const t = token?.trim();
  const cand = DEMO_CANDIDATES[t] || DEMO_CANDIDATES['demo-valid'];
  const job = DEMO_JOBS[t] || DEMO_JOBS['demo-valid'];
  
  return {
    token: t,
    email: email || cand.email,
    candidateName: cand.name,
    jobTitle: job.title,
    validatedAt: new Date().toISOString(),
  };
}

export function buildDemoInterviewDocument(token = DEMO_INTERVIEW_TOKEN) {
  const t = token?.trim();
  const cand = DEMO_CANDIDATES[t] || DEMO_CANDIDATES['demo-valid'];
  const job = DEMO_JOBS[t] || DEMO_JOBS['demo-valid'];

  return {
    interviewId: t,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    candidate: cand,
    job: job,
    conversationHistory: [],
  };
}
