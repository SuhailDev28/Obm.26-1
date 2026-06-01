import {
  Bot,
  Brain,
  Building2,
  Cloud,
  Code2,
  Workflow,
} from "lucide-react";

export const TOKEN_KEY = "obm_admin_token";

export const defaultSettings = {
  siteName: "OBM",
  tagline: "AI Consultancy & Software Development",
  logo: "/uploads/obm-logo.png",
  primaryColor: "#22d3ee",
  secondaryColor: "#2563eb",
  accentColor: "#a855f7",
  heroBadge: "Complete technology partner for startups and enterprises",
  heroTitle: "Build smarter digital products with AI, software, and automation.",
  heroText:
    "OBM helps businesses design, build, automate, and scale high-performance digital products, enterprise systems, web platforms, mobile apps, CRM, HRMS, CMS, e-commerce, and AI-enabled workflows.",
  ctaPrimary: "Start Your Project",
  ctaSecondary: "Explore Services",
  email: "hello@obm.qa",
  phone: "+974 0000 0000",
  location: "Doha, Qatar",
  whatsapp: "+97400000000",
  linkedin: "https://www.linkedin.com/company/obm",
  footerText: "AI Consultancy • Product Engineering • Enterprise Automation",
};

export const productServices = [
  {
    icon: Code2,
    title: "Custom Software, Web & Mobile Apps",
    text: "Tailored development across modern frameworks to solve unique business challenges and support digital scale.",
  },
  {
    icon: Brain,
    title: "UI/UX Design & MVP Development",
    text: "Fast-tracking concepts from prototype to production with user-centric product design and clean engineering.",
  },
  {
    icon: Cloud,
    title: "E-Commerce & CMS Infrastructure",
    text: "Robust storefronts, content platforms, admin systems, integrations, payments, and scalable cloud delivery.",
  },
];

export const automationServices = [
  {
    icon: Building2,
    title: "HRMS & Operational Tools",
    text: "Systems built to streamline workforce management, automate departmental tasks, and improve performance.",
  },
  {
    icon: Workflow,
    title: "CRM & Business Process Automation",
    text: "Tailored platforms to eliminate manual bottlenecks, optimize workflows, and drive revenue growth.",
  },
  {
    icon: Bot,
    title: "AI Assistants & Internal Copilots",
    text: "Customer support agents, internal knowledge bots, document assistants, and smart automation workflows.",
  },
];

export const process = [
  "Discovery & Digital Readiness Audit",
  "Solution Architecture & Roadmap",
  "UI/UX Prototype and MVP Planning",
  "Full-Stack Product Development",
  "AI / CRM / HRMS / CMS Integration",
  "Deployment, Training and Optimization",
];

export const industries = [
  "Startups & SMEs",
  "Enterprise Operations",
  "Education & Academies",
  "Real Estate",
  "E-Commerce",
  "Healthcare & Clinics",
  "Events & Bookings",
  "Corporate Teams",
];

export const packages = [
  {
    name: "Digital Starter",
    price: "From QAR 4,500",
    desc: "Best for businesses planning software, website, or automation modernization.",
    features: ["Digital audit", "Workflow analysis", "Technical roadmap", "Prototype recommendation"],
  },
  {
    name: "Product Build",
    price: "From QAR 25,000",
    desc: "Best for MVPs, web apps, portals, dashboards, CRM, CMS, and e-commerce systems.",
    features: ["UI/UX design", "Full-stack development", "Admin dashboard", "Cloud deployment", "Basic automation"],
    featured: true,
  },
  {
    name: "Enterprise Automation",
    price: "Custom Quote",
    desc: "Best for HRMS, CRM, AI assistants, advanced workflows, and multi-department systems.",
    features: ["Custom architecture", "Private data integrations", "Role-based access", "Advanced analytics", "Priority support"],
  },
];
