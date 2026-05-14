export const personal = {
  name: "Idahmed Yassine",
  title: "Senior Python Engineer & Backend Architect",
  location: "Casablanca, Morocco",
  email: "idahmedyassine@gmail.com",
  phone: "+212 675 332 432",
  website: "idahmed.com",
  github: "github.com/idahmed",
  linkedin: "linkedin.com/in/idahmed",
  gitlab: "gitlab.com/idahmed",
  resumeEnUrl: "https://drive.google.com/file/d/1Kt2fn2HwN01CDkVIYxBX_hmwA-W31vXz/view?usp=sharing",
  resumeFrUrl: "https://drive.google.com/file/d/1lusp6sqSI9JkPOj488m1L3hUrH9cA39h/view?usp=sharing",
  summary:
    "Senior Backend Engineer with 6+ years of experience building high-performance RESTful APIs and scalable system architectures using Python and Django. Proven track record of modernizing legacy systems, reducing API latency, and delivering production-grade solutions across health tech, cybersecurity, and SaaS domains. Full-stack capable with React, and experienced with DevOps practices including Docker and CI/CD pipelines.",
};

export const skills = [
  {
    category: "Backend",
    icon: "⚙️",
    description: "Building robust APIs and server-side architectures",
    items: ["Python", "Django", "DRF", "FastAPI"],
    level: "Expert",
  },
  {
    category: "Async & Caching",
    icon: "⚡",
    description: "Task queues, caching layers, and real-time processing",
    items: ["Celery", "Redis"],
  },
  {
    category: "Databases",
    icon: "🗄️",
    description: "Relational and document data stores",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "Frontend",
    icon: "🎨",
    description: "Interactive interfaces and modern web technologies",
    items: ["JavaScript", "React", "HTMX", "Jinja2", "HTML5", "CSS3", "Bootstrap", "Tailwind"],
  },
  {
    category: "DevOps",
    icon: "🚀",
    description: "Containerization, CI/CD, and infrastructure",
    items: ["Docker", "Docker Compose", "Git/GitHub", "Linux", "GitHub Actions", "CI/CD"],
  },
  {
    category: "Cloud (AWS)",
    icon: "☁️",
    description: "Serverless compute, storage, managed APIs, and relational DB",
    items: ["AWS Lambda", "Amazon S3", "Amazon API Gateway", "Amazon RDS"],
  },
  {
    category: "AI & LLM",
    icon: "🧠",
    description: "LLM orchestration, provider APIs, and application tooling",
    items: ["LangChain", "AI APIs"],
  },
  {
    category: "Architecture",
    icon: "🏗️",
    description: "Designing scalable distributed systems",
    items: ["Microservices", "Multi-container setups"],
  },
  {
    category: "Automation",
    icon: "🤖",
    description: "Web scraping, workflows, and tool integrations",
    items: ["Scrapy", "Selenium", "n8n", "ActivePieces", "HubSpot", "Slack", "Acronis", "Automox"],
  },
  {
    category: "Methodologies",
    icon: "📐",
    description: "Engineering practices and design principles",
    items: ["TDD", "Clean Code", "Scalable API Design"],
  },
];

/** Unique skill labels in category order, for compact UI (e.g. Hero chips). */
export function getAllSkillLabels() {
  const seen = new Set();
  const labels = [];
  for (const group of skills) {
    for (const item of group.items) {
      if (!seen.has(item)) {
        seen.add(item);
        labels.push(item);
      }
    }
  }
  return labels;
}

export const projects = [
  {
    id: "leano-platform",
    title: "Leano Platform",
    company: "Leano",
    period: "Jun 2024 – Dec 2024",
    description: "Full-stack web platform with Dockerized Django backend and React frontend.",
    details: [
      "Architected Dockerized Django/DRF backend with RESTful APIs using TDD and SOLID principles",
      "Implemented OAuth 2.0 authentication flow",
      "Integrated 5+ external API clients for third-party services",
      "Revamped React frontend connected to custom backend APIs",
    ],
    tech: ["Django", "DRF", "React", "Docker", "OAuth 2.0", "TDD"],
  },
  {
    id: "leano-automation",
    title: "Workflow Automation Engine",
    company: "Leano",
    period: "Jun 2024 – Dec 2024",
    description: "Automated business workflows cutting manual processing by ~50%.",
    details: [
      "Designed and deployed automation pipelines with ActivePieces and n8n",
      "Reduced manual processing overhead by approximately 50%",
      "Integrated with internal APIs and external SaaS tools",
    ],
    tech: ["ActivePieces", "n8n", "Python", "REST APIs"],
  },
  {
    id: "doctolab-platform",
    title: "Doctolab Medical Platform",
    company: "Doctolab / DoctoClick Maroc",
    period: "Nov 2023 – Jun 2024",
    description: "Modernized legacy healthcare system into a scalable Django application.",
    details: [
      "Modernized legacy PHP monolith into a scalable Django application",
      "Engineered a complex medical analysis formula engine for lab results",
      "Built interactive UIs combining React and HTMX with Django templating",
    ],
    tech: ["Django", "React", "HTMX", "PostgreSQL", "PHP Migration"],
  },
  {
    id: "doctolab-hardware",
    title: "Lab Hardware Integration",
    company: "Doctolab / DoctoClick Maroc",
    period: "Nov 2023 – Jun 2024",
    description: "Real-time TCP/IP communication with laboratory hardware devices.",
    details: [
      "Developed TCP/IP socket clients for real-time lab hardware communication",
      "Built Python agents mimicking automation machines for integration testing",
      "Ensured reliable data exchange between lab equipment and the platform",
    ],
    tech: ["Python", "TCP/IP", "Sockets", "Integration Testing"],
  },
  {
    id: "vieava-care",
    title: "VIEAVA CARE",
    company: "Obytes",
    period: "Jan 2020 – Jul 2023",
    description: "Healthcare API platform with ~40% latency reduction and analytics dashboard.",
    details: [
      "Built Django/DRF APIs powering the healthcare platform",
      "Reduced API latency by approximately 40% through query optimization",
      "Created Redash analytics dashboard for data-driven insights",
    ],
    tech: ["Django", "DRF", "Redash", "PostgreSQL", "Performance"],
  },
  {
    id: "keepers",
    title: "KEEPERS",
    company: "Obytes",
    period: "Jan 2020 – Jul 2023",
    description: "RESTful inventory management system with comprehensive test coverage.",
    details: [
      "Maintained and extended RESTful APIs for inventory management",
      "Wrote comprehensive unit and integration tests ensuring reliability",
      "Collaborated with frontend teams on API contract design",
    ],
    tech: ["Django", "DRF", "Testing", "REST APIs"],
  },
  {
    id: "1fort",
    title: "1FORT Security Platform",
    company: "Obytes",
    period: "Jan 2020 – Jul 2023",
    description: "Subscription, payment, and user management with cybersecurity integrations.",
    details: [
      "Built subscription, payment, and user management systems",
      "Integrated Acronis, SpamTitan, and Automox security platforms",
      "Designed scalable architecture for multi-tenant SaaS deployment",
    ],
    tech: ["Django", "Payments", "Acronis", "SpamTitan", "Automox"],
  },
  {
    id: "data-scraper",
    title: "Restaurant & Instagram Scraper",
    company: "Obytes",
    period: "",
    description: "Web scrapers with rotating proxies and a Django monitoring dashboard.",
    details: [
      "Built Scrapy + Selenium scrapers with rotating proxies and throttling",
      "Created Django dashboard with real-time log monitoring",
      "Implemented Excel export functionality using OpenPyXL",
    ],
    tech: ["Scrapy", "Selenium", "Django", "OpenPyXL", "Proxies"],
  },
  {
    id: "give-ui",
    title: "Give UI — Figma to React",
    company: "Obytes",
    period: "",
    description: "Pixel-accurate translation of Figma designs into a responsive React app.",
    details: [
      "Translated Figma design into a fully responsive React application",
      "Achieved pixel-accurate implementation across all breakpoints",
      "Focused on clean component architecture and reusability",
    ],
    tech: ["React", "CSS", "Figma", "Responsive Design"],
  },
];
