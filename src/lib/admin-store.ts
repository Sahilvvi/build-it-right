import { useState, useEffect } from "react";
import {
  brand as defaultBrand,
  stats as defaultStats,
  whyUs as defaultWhyUs,
  aboutContent as defaultAbout,
  courses as defaultCourses,
  resourcePlaylists as defaultPlaylists,
  tickerItems as defaultTickers,
  testimonials as defaultTestimonials,
  faqs as defaultFaqs,
} from "../data/site";
import type { Course } from "../data/site";

export type LeadStage =
  | "Inquiry"
  | "Contacted"
  | "Interested"
  | "Not Interested"
  | "Coming for Meeting"
  | "Enrolled"
  | "Lost"
  | "Invalid";

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseInterest: string;
  leadStage: LeadStage;
  city: string;
  sourcePage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  createdAt: string;
  notes: LeadNote[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: "approved" | "pending";
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  cfaLevel?: string;
  content: string;
  rating: number;
  featured: boolean;
  avatarUrl?: string;
}

export interface AnnouncementItem {
  id: string;
  text: string;
  isActive: boolean;
  priority: number;
}

export interface SeoPageMeta {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface RedirectRule {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  isActive: boolean;
}

export interface TrackingSettings {
  ga4Id: string;
  gtmId: string;
  metaPixelId: string;
  searchConsoleToken: string;
  customHeadScript: string;
  customBodyScript: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  status: "active" | "inactive";
  lastLogin?: string;
}

export interface SmtpSettings {
  leadNotificationEmail: string;
  sendLeadAlerts: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  senderName: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface VisualAssets {
  logoUrl: string;
  iconUrl: string;
  founderPhotoUrl: string;
}

export interface AdminStoreData {
  visuals: VisualAssets;
  identity: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    youtubeUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    footerCopyright: string;
    footerBlurb: string;
  };
  leads: Lead[];
  courses: Course[];
  homeContent: {
    heroBadge: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroRatingText: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    stats: typeof defaultStats;
    whyUs: typeof defaultWhyUs;
    whyUsBadge: string;
    whyUsHeadline: string;
    whyUsCardTitle: string;
    whyUsCardDesc: string;
    whyUsFeatures: string[];
    founderSpotlight: {
      eyebrow: string;
      headline: string;
      founderName: string;
      founderTitle: string;
      founderPhoto: string;
      experienceYears: string;
      studentsTrained: string;
      attemptFocus: string;
      credentials: string[];
      journey: string[];
    };
    demoVideos: {
      eyebrow: string;
      headline: string;
      subheadline: string;
      channelUrl: string;
    };
    placementSection: {
      badge: string;
      headline: string;
      subheadline: string;
      studentsCount: number;
      studentsSuffix: string;
      successRateMin: number;
      successRateMax: number;
    };
    appSection: {
      badge: string;
      headline: string;
      subheadline: string;
      orgCode: string;
      androidUrl: string;
      iosUrl: string;
      windowsUrl: string;
      ratingText: string;
    };
    companiesSection: {
      headline: string;
    };
    finalCta: {
      eyebrow: string;
      headline: string;
      subheadline: string;
      primaryButtonText: string;
      secondaryButtonText: string;
    };
    careerStages: Array<{ title: string; desc: string; badge: string }>;
    pedagogyHeadline: string;
    pedagogySubheadline: string;
  };
  coursesPageContent: {
    heroHeadline: string;
    heroSubheadline: string;
    ratingText: string;
    whoItsFor: string[];
    retakersHeadline: string;
    retakersBody: string;
    retakersFee: string;
    importantNotes: string[];
    ctaHeadline: string;
    ctaSubheadline: string;
  };
  cfaPageContent: {
    heroHeadline: string;
    heroSubheadline: string;
    curriculumNotice: string;
    levels: {
      L1: {
        badge: string;
        tagline: string;
        description: string;
        duration: string;
        views: string;
        language: string;
        coverage: string;
        pricingOffline: string;
        pricingOnline: string;
      };
      L2: {
        badge: string;
        tagline: string;
        description: string;
        duration: string;
        views: string;
        language: string;
        coverage: string;
        pricingOffline: string;
        pricingOnline: string;
      };
      L3: {
        badge: string;
        tagline: string;
        description: string;
        duration: string;
        views: string;
        language: string;
        coverage: string;
        pricingOffline: string;
        pricingOnline: string;
      };
    };
  };
  aboutContent: typeof defaultAbout;
  resourcesContent: {
    heroHeading: string;
    heroBlurb: string;
    playlists: typeof defaultPlaylists;
  };
  contactPageContent: {
    heroHeadline: string;
    heroSubheadline: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    officeHours: string;
    consultationTitle: string;
    consultationDesc: string;
  };
  faqs: FaqItem[];
  testimonials: TestimonialItem[];
  announcements: AnnouncementItem[];
  media: MediaItem[];
  seo: Record<string, SeoPageMeta>;
  redirects: RedirectRule[];
  tracking: TrackingSettings;
  users: AdminUser[];
  smtp: SmtpSettings;
  activityHistory: ActivityLogItem[];
}

const STORAGE_KEY = "finenvision_admin_store_v2";
const AUTH_KEY = "finenvision_current_admin_user";

// Seed data
const initialData: AdminStoreData = {
  visuals: {
    logoUrl: "/finenvision-logo-light.png",
    iconUrl: "/finenvision-icon.png",
    founderPhotoUrl: "/manoj-rajgopal.jpg",
  },
  identity: {
    name: defaultBrand.name,
    shortName: defaultBrand.shortName,
    tagline: defaultBrand.tagline,
    description: defaultBrand.description,
    email: defaultBrand.email,
    phone: defaultBrand.phone,
    whatsapp: defaultBrand.whatsapp,
    address: defaultBrand.address,
    youtubeUrl: "https://www.youtube.com/@Fin-Envision",
    linkedinUrl: "https://www.linkedin.com/company/fin-envision",
    instagramUrl: "https://www.instagram.com/finenvision",
    footerCopyright:
      "© 2026 Fin-Envision Learning. All rights reserved. CFA® and Chartered Financial Analyst are registered trademarks owned by CFA Institute.",
    footerBlurb: defaultBrand.description,
  },
  leads: [
    {
      id: "lead-1",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98201 44521",
      courseInterest: "Chartered Financial Analyst (CFA®) Level 1",
      leadStage: "Interested",
      city: "Mumbai",
      sourcePage: "/cfa",
      utmSource: "google_ads",
      utmMedium: "cpc",
      utmCampaign: "cfa_l1_nov26",
      createdAt: "2026-10-01T14:32:00Z",
      notes: [
        {
          id: "n-1",
          author: "Manoj Rajgopal",
          text: "Spoke to Aarav. Preparing for November attempt. Interested in weekend offline batch in Thane.",
          createdAt: "2026-10-01T15:10:00Z",
        },
      ],
    },
    {
      id: "lead-2",
      name: "Sneha Patel",
      email: "sneha.patel@consulting.in",
      phone: "+91 98199 87654",
      courseInterest: "Holistic Finance (Equity Research and Financial Modeling)",
      leadStage: "Coming for Meeting",
      city: "Thane",
      sourcePage: "/courses",
      utmSource: "instagram",
      utmMedium: "story_ad",
      utmCampaign: "financial_modeling_autumn",
      createdAt: "2026-09-30T10:15:00Z",
      notes: [
        {
          id: "n-2",
          author: "Admin Counselor",
          text: "Meeting scheduled at Thane center this Saturday at 11:30 AM with faculty.",
          createdAt: "2026-09-30T11:00:00Z",
        },
      ],
    },
    {
      id: "lead-3",
      name: "Rohan Deshmukh",
      email: "rohan.d@icici.com",
      phone: "+91 97690 12345",
      courseInterest: "Chartered Financial Analyst (CFA®) Level 2",
      leadStage: "Enrolled",
      city: "Navi Mumbai",
      sourcePage: "/cfa",
      utmSource: "organic_google",
      utmMedium: "search",
      createdAt: "2026-09-28T18:40:00Z",
      notes: [
        {
          id: "n-3",
          author: "Super Admin",
          text: "Payment received ₹40,000 for classroom batch. LMS access sent.",
          createdAt: "2026-09-29T09:30:00Z",
        },
      ],
    },
    {
      id: "lead-4",
      name: "Pooja Mehta",
      email: "pooja.mehta@gmail.com",
      phone: "+91 99300 56789",
      courseInterest: "Chartered Financial Analyst (CFA®) Level 1",
      leadStage: "Inquiry",
      city: "Pune",
      sourcePage: "/",
      utmSource: "linkedin",
      utmMedium: "post",
      createdAt: "2026-10-01T19:20:00Z",
      notes: [],
    },
    {
      id: "lead-5",
      name: "Vikram Singhania",
      email: "vikram.s@outlook.com",
      phone: "+91 98210 99887",
      courseInterest: "Chartered Financial Analyst (CFA®) Level 3",
      leadStage: "Contacted",
      city: "Mumbai",
      sourcePage: "/courses",
      createdAt: "2026-09-27T12:00:00Z",
      notes: [
        {
          id: "n-4",
          author: "Manoj Rajgopal",
          text: "Sent Level 3 curriculum and mock paper breakdown.",
          createdAt: "2026-09-27T14:15:00Z",
        },
      ],
    },
  ],
  courses: defaultCourses,
  homeContent: {
    heroBadge: "CFA® Program Preparation & Financial Modeling",
    heroHeadline: "Bridge Theory and Real-World Finance.",
    heroSubheadline:
      "Fin-Envision is Mumbai's premier CFA® and Financial Modeling training institute, led by charterholder Manoj Rajgopal. Master formulae conceptually with 100% curriculum coverage.",
    heroRatingText: "4.9 / 5.0 Rating based on 216+ Google Student Reviews",
    ctaPrimaryText: "Explore Courses",
    ctaPrimaryLink: "/courses",
    ctaSecondaryText: "Book Free Consultation",
    ctaSecondaryLink: "/contact",
    stats: defaultStats,
    whyUs: defaultWhyUs,
    whyUsBadge: "Ecosystem",
    whyUsHeadline: "Why Fin-Envision ?",
    whyUsCardTitle: "Proven Prep Ecosystem",
    whyUsCardDesc:
      "Our comprehensive, concept-first learning system is engineered for maximum first-attempt success.",
    whyUsFeatures: [
      "Practical teaching with Indian markets examples",
      "Handwritten notes for concept clarity with Indian examples",
      "Regular revision sessions",
      "Recorded videos with unlimited views",
      "Minimum 2 tests per subject",
      "Dedicated study timetable",
      "Personalised doubt solving sessions",
      "6 Mock tests",
      "Career Guidance",
      "Exam Support Mentoring",
    ],
    founderSpotlight: {
      eyebrow: "Lead Instructor",
      headline: "Lead Instructor",
      founderName: "Manoj Rajgopal, CFA",
      founderTitle: "Founder & Lead Instructor",
      founderPhoto: "/manoj-rajgopal.jpg",
      experienceYears: "8+",
      studentsTrained: "5,000+",
      attemptFocus: "1st",
      credentials: [
        "CFA® Charterholder",
        "Investment Banking",
        "Financial Modeling",
        "Portfolio Strategy",
      ],
      journey: [
        "Founder and Lead Instructor of Fin-Envision Learning.",
        "Cleared all three levels of the CFA® Program in the first attempt.",
        "Worked with reputed organizations such as CRISIL and JHP, gaining valuable industry exposure.",
        "Has successfully trained over 5,000 students across the globe.",
        "Known for simplifying complex financial concepts into easy-to-understand, practical lessons.",
        "Focuses on bridging the gap between academic learning and real-world finance.",
        "Dedicated to mentoring students for successful careers in finance through industry-oriented training and personalized guidance.",
      ],
    },
    demoVideos: {
      eyebrow: "Watch & Learn",
      headline: "Watch Demo Lectures & Conceptual Playlists",
      subheadline:
        "Curated by Manoj Rajgopal, CFA. Experience our concept-first methodology before enrolling.",
      channelUrl: "https://www.youtube.com/@financewithmanojrajgopal",
    },
    placementSection: {
      badge: "Numbers That Matter",
      headline: "5,000+ Learners Trained. Results That Speak.",
      subheadline:
        "Eight years of teaching, thousands of success stories, and a track record built on first-attempt clears.",
      studentsCount: 5000,
      studentsSuffix: "+",
      successRateMin: 80,
      successRateMax: 90,
    },
    appSection: {
      badge: "Mobile & Desktop App",
      headline: "Learn Anywhere, Anytime",
      subheadline:
        "Pick up exactly where you left off — across mobile, tablet and desktop. Offline lectures, sync'd notes, mock tests on the go.",
      orgCode: "RJQBWG",
      androidUrl: "https://play.google.com/store/apps/details?id=co.sansa.arwir",
      iosUrl: "https://apps.apple.com/us/app/fin-envision-learning/id6745217545",
      windowsUrl: "https://web.classplusapp.com",
      ratingText: "4.2★ App rating",
    },
    companiesSection: {
      headline: "Where our alumni go to work.",
    },
    finalCta: {
      eyebrow: "Ready when you are",
      headline: "Talk to a counsellor. Walk away with a roadmap.",
      subheadline: "A 20-minute, no-pressure call to map your goal and the fastest route there.",
      primaryButtonText: "Book Free Guidance",
      secondaryButtonText: "Chat on WhatsApp",
    },
    careerStages: [
      {
        title: "College Student",
        desc: "Build an unbeatable finance resume and crack CFA Level 1 in your final graduation year.",
        badge: "Undergrad & Freshers",
      },
      {
        title: "Young Professional",
        desc: "Break out of operations and back-office roles into core equity research, investment banking, and portfolio management.",
        badge: "1–3 Yrs Experience",
      },
      {
        title: "Career Switcher",
        desc: "Transition smoothly from engineering, IT, or sales into high-growth corporate finance with hands-on modeling skills.",
        badge: "Non-Finance Background",
      },
      {
        title: "Senior Professional",
        desc: "Complete your CFA charter to lead asset management teams, hedge funds, and corporate strategy.",
        badge: "Mid-Senior Level",
      },
    ],
    pedagogyHeadline: "How We Teach: Concepts First, Zero Rote Memorization",
    pedagogySubheadline:
      "Every financial equation is connected to a living business story, balance sheet, or market case study.",
  },
  coursesPageContent: {
    heroHeadline: "Master the CFA® Program with India's Most Trusted Prep",
    heroSubheadline:
      "Live practitioner-led cohorts for Level I, II & III. Comprehensive curriculum coverage, 2500+ solved practice questions, handwritten notes, and personalized mentorship.",
    ratingText: "4.9 / 5.0 Rating based on 216+ Google Student Reviews",
    whoItsFor: [
      "Finance professionals seeking global recognition and faster career growth.",
      "Career switchers targeting roles in banking, equity research, and risk management.",
      "College students aiming to clear CFA Level 1 on their first attempt before graduation.",
      "Non-finance professionals seeking benchmarked, real-world valuation modeling skills.",
    ],
    retakersHeadline: "Didn't Clear in Your Previous Attempt? Retakers Booster Pack",
    retakersBody:
      "We diagnose your weak topic areas, rebuild conceptual foundations, and train you on exam speed with 5 fresh full-length mock papers.",
    retakersFee: "Special 30% Fee Waiver for Retakers with Previous Exam Scorecard",
    importantNotes: [
      "Earning the CFA® Charter requires completing all three exams plus qualifying work experience.",
      "A valid international passport is mandatory for every CFA® exam candidate.",
      "Only TI BA II Plus (and Professional) and HP 12C (all models) calculators are permitted.",
      "Candidates must complete at least one Practical Skill Module (PSM) per level to receive results.",
    ],
    ctaHeadline: "Start Your Finance Journey with Manoj Rajgopal",
    ctaSubheadline: "Classroom in Thane (Mumbai) or HD Pre-recorded streaming worldwide.",
  },
  cfaPageContent: {
    heroHeadline: "CFA® Program Preparation — Level I, II & III",
    heroSubheadline:
      "Concept-focused training led by charterholder Manoj Rajgopal who cleared all three levels on the first attempt.",
    curriculumNotice:
      "100% Curriculum coverage in English + Hindi with unlimited recorded views until exam day.",
    levels: {
      L1: {
        badge: "Level I",
        tagline: "Foundations · Tools · Ethical Standards",
        description:
          "Build a rock-solid foundation across all 10 CFA topics. Level I introduces candidates to core tools and financial statement analysis.",
        duration: "140+ hours live classroom / streaming",
        views: "Unlimited views until exam",
        language: "English + Hindi explanations",
        coverage: "100% Institute Curriculum questions solved",
        pricingOffline: "₹36,000",
        pricingOnline: "₹20,000",
      },
      L2: {
        badge: "Level II",
        tagline: "Asset Valuation & Vignette Item Sets",
        description:
          "Deep dive into asset valuation: Equity, Fixed Income, Derivatives, and Alternative Investments with vignette-style exam strategy.",
        duration: "150+ hours live classroom / streaming",
        views: "Unlimited views until exam",
        language: "English + Hindi explanations",
        coverage: "100% Curriculum vignette item sets",
        pricingOffline: "₹40,000",
        pricingOnline: "₹25,000",
      },
      L3: {
        badge: "Level III",
        tagline: "Portfolio Management & Wealth Planning",
        description:
          "Master constructed-response essay questions and institutional portfolio management pathways led by experienced charterholders.",
        duration: "120+ hours structured modules",
        views: "Unlimited views until exam",
        language: "English + Hindi explanations",
        coverage: "Constructed-response essay workshops",
        pricingOffline: "₹25,000",
        pricingOnline: "₹25,000",
      },
    },
  },
  aboutContent: defaultAbout,
  resourcesContent: {
    heroHeading: "Free Finance & CFA Study Playlists",
    heroBlurb:
      "Curated by Manoj Rajgopal, CFA. Explore demo lectures, time value of money walkthroughs, and financial statement analysis playlists.",
    playlists: defaultPlaylists,
  },
  contactPageContent: {
    heroHeadline: "Visit Our Classroom or Schedule a 1-on-1 Mentorship Call",
    heroSubheadline:
      "Have questions about CFA exam eligibility, study planning, or batch schedules? Speak directly with Manoj Sir and our counseling team.",
    address:
      "Fin-Envision Learning, Near Thane Railway Station, Thane West, Mumbai, Maharashtra 400601",
    phone: "+91 7304833625",
    email: "contactfinenvision@gmail.com",
    whatsapp: "+91 7304833625",
    officeHours: "Monday to Sunday: 9:00 AM – 7:30 PM",
    consultationTitle: "Free In-Person Counseling at Thane Center",
    consultationDesc:
      "Walk in to inspect handwritten course materials, attend a live class demo, and design your 6-month study roadmap.",
  },
  faqs: defaultFaqs.map((f, i) => ({
    id: `faq-${i + 1}`,
    category: f.category,
    question: f.q,
    answer: f.a,
    isActive: true,
  })),
  testimonials: [
    {
      id: "t-1",
      name: "Karan Joshi",
      role: "Equity Research Analyst @ Nomura",
      cfaLevel: "Cleared CFA® Level 2 First Attempt",
      content:
        "Manoj Sir doesn't teach formulae to memorize; he explains the economic logic behind every curve. That is the exact reason I cleared both levels on my first attempt.",
      rating: 5,
      featured: true,
    },
    {
      id: "t-2",
      name: "Ananya Iyer",
      role: "Credit Risk Associate @ CRISIL",
      cfaLevel: "Financial Modeling & CFA® L1",
      content:
        "The financial modeling curriculum uses real Indian corporate annual reports. When I attended interviews, I was answering from hands-on DCF experience, not textbook theory.",
      rating: 5,
      featured: true,
    },
    {
      id: "t-3",
      name: "Devang Shah",
      role: "Investment Banking Analyst",
      cfaLevel: "Cleared CFA® Level 1",
      content:
        "Batch size capped at 35 meant Manoj Sir knew my weak areas in FSA and Quants before I even asked. The handwritten notes are pure gold.",
      rating: 5,
      featured: true,
    },
  ],
  announcements: defaultTickers.map((text, idx) => ({
    id: `ann-${idx + 1}`,
    text,
    isActive: true,
    priority: idx + 1,
  })),
  media: [
    {
      id: "m-1",
      name: "finenvision-logo.png",
      url: "/finenvision-logo.png",
      type: "image/png",
      size: "142 KB",
      uploadedAt: "2026-09-15T10:00:00Z",
      status: "approved",
    },
    {
      id: "m-2",
      name: "manoj-rajgopal-faculty.jpg",
      url: "/finenvision-icon.png",
      type: "image/jpeg",
      size: "380 KB",
      uploadedAt: "2026-09-18T14:20:00Z",
      status: "approved",
    },
    {
      id: "m-3",
      name: "cfa-l1-syllabus-2026.pdf",
      url: "#",
      type: "application/pdf",
      size: "2.4 MB",
      uploadedAt: "2026-09-25T16:45:00Z",
      status: "approved",
    },
  ],
  seo: {
    "/": {
      title: "Fin-Envision Learning — Master Financial Modelling & Crack the CFA®",
      description:
        "Fin-Envision is a leading finance training institute helping students master financial modelling and crack the CFA® with clarity and confidence.",
      ogImage: "/finenvision-logo.png",
    },
    "/cfa": {
      title: "CFA® Program Preparation (Level 1, 2 & 3) — Fin-Envision Mumbai",
      description:
        "Comprehensive CFA preparation led by first-attempt charterholder Manoj Rajgopal. 80-90% success rate with live classroom & pre-recorded batches.",
      ogImage: "/finenvision-logo.png",
    },
    "/courses": {
      title: "Finance & Financial Modeling Courses — Fin-Envision",
      description:
        "Practical Financial Modeling, Valuation, and Equity Research programs designed for real-world finance careers.",
      ogImage: "/finenvision-logo.png",
    },
    "/about": {
      title: "About Us — Fin-Envision Learning & Manoj Rajgopal, CFA",
      description:
        "Meet Manoj Rajgopal, CFA charterholder and founder of Fin-Envision. 5,000+ students trained with concept-driven coaching.",
      ogImage: "/finenvision-logo.png",
    },
    "/resources": {
      title: "Free Finance & CFA Study Resources — Fin-Envision",
      description:
        "Watch curated YouTube playlists and study guides for CFA Level 1, Level 2, and Financial Modeling.",
      ogImage: "/finenvision-logo.png",
    },
    "/contact": {
      title: "Contact Fin-Envision — Thane Mumbai Coaching Center",
      description:
        "Get in touch with Fin-Envision Learning. Book a free career guidance call or visit our Thane Mumbai classroom.",
      ogImage: "/finenvision-logo.png",
    },
  },
  redirects: [
    {
      id: "r-1",
      fromPath: "/cfa-classes-mumbai",
      toPath: "/cfa",
      statusCode: 301,
      isActive: true,
    },
    {
      id: "r-2",
      fromPath: "/financial-modeling-course",
      toPath: "/courses",
      statusCode: 301,
      isActive: true,
    },
  ],
  tracking: {
    ga4Id: "G-XXXXXXXXXX",
    gtmId: "GTM-XXXXXXX",
    metaPixelId: "987654321012345",
    searchConsoleToken: "google-site-verification=SAMPLE_TOKEN_HERE",
    customHeadScript: "",
    customBodyScript: "",
  },
  users: [
    {
      id: "u-1",
      name: "Manoj Rajgopal",
      email: "manoj@finenvision.com",
      role: "super_admin",
      status: "active",
      lastLogin: "2026-10-02T00:10:00Z",
    },
    {
      id: "u-2",
      name: "Admin Team",
      email: "contactfinenvision@gmail.com",
      role: "admin",
      status: "active",
      lastLogin: "2026-10-01T18:45:00Z",
    },
  ],
  smtp: {
    leadNotificationEmail: "contactfinenvision@gmail.com",
    sendLeadAlerts: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "contactfinenvision@gmail.com",
    smtpPass: "••••••••••••",
    senderName: "Fin-Envision Portal",
  },
  activityHistory: [
    {
      id: "act-1",
      user: "Manoj Rajgopal",
      action: "Updated Course Highlights",
      target: "CFA Level 1",
      timestamp: "2026-10-01T16:20:00Z",
    },
    {
      id: "act-2",
      user: "Admin Team",
      action: "Changed Lead Stage to Enrolled",
      target: "Rohan Deshmukh",
      timestamp: "2026-09-29T09:30:00Z",
    },
    {
      id: "act-3",
      user: "Manoj Rajgopal",
      action: "Approved New Media Asset",
      target: "cfa-l1-syllabus-2026.pdf",
      timestamp: "2026-09-25T16:50:00Z",
    },
  ],
};

// Storage helper functions
export function getAdminStore(): AdminStoreData {
  if (typeof window === "undefined") {
    return initialData;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(raw);
    // Deep merge missing keys if schema was updated
    return {
      ...initialData,
      ...parsed,
      visuals: { ...initialData.visuals, ...(parsed.visuals || {}) },
      identity: { ...initialData.identity, ...(parsed.identity || {}) },
      homeContent: {
        ...initialData.homeContent,
        ...(parsed.homeContent || {}),
        founderSpotlight: {
          ...initialData.homeContent.founderSpotlight,
          ...(parsed.homeContent?.founderSpotlight || {}),
        },
        demoVideos: {
          ...initialData.homeContent.demoVideos,
          ...(parsed.homeContent?.demoVideos || {}),
        },
        placementSection: {
          ...initialData.homeContent.placementSection,
          ...(parsed.homeContent?.placementSection || {}),
        },
        appSection: {
          ...initialData.homeContent.appSection,
          ...(parsed.homeContent?.appSection || {}),
        },
        companiesSection: {
          ...initialData.homeContent.companiesSection,
          ...(parsed.homeContent?.companiesSection || {}),
        },
        finalCta: {
          ...initialData.homeContent.finalCta,
          ...(parsed.homeContent?.finalCta || {}),
        },
      },
      coursesPageContent: {
        ...initialData.coursesPageContent,
        ...(parsed.coursesPageContent || {}),
      },
      cfaPageContent: {
        ...initialData.cfaPageContent,
        ...(parsed.cfaPageContent || {}),
      },
      aboutContent: {
        ...initialData.aboutContent,
        ...(parsed.aboutContent || {}),
      },
      resourcesContent: {
        ...initialData.resourcesContent,
        ...(parsed.resourcesContent || {}),
      },
      contactPageContent: {
        ...initialData.contactPageContent,
        ...(parsed.contactPageContent || {}),
      },
    };
  } catch (err) {
    console.error("Error reading admin store from localStorage:", err);
    return initialData;
  }
}

export function saveAdminStore(
  data: AdminStoreData,
  logAction?: { action: string; target: string },
): void {
  if (typeof window === "undefined") return;
  try {
    if (logAction) {
      const currentUser = getCurrentAdmin();
      const newLog: ActivityLogItem = {
        id: `act-${Date.now()}`,
        user: currentUser?.name || "Admin",
        action: logAction.action,
        target: logAction.target,
        timestamp: new Date().toISOString(),
      };
      data.activityHistory = [newLog, ...(data.activityHistory || [])].slice(0, 50);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("finenvision_store_updated", { detail: data }));
  } catch (err) {
    console.error("Error writing admin store to localStorage:", err);
  }
}

// Leads Management
export function addLead(leadData: Omit<Lead, "id" | "createdAt" | "notes">): Lead {
  const store = getAdminStore();
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    notes: [],
  };
  store.leads = [newLead, ...store.leads];
  saveAdminStore(store, {
    action: "New Lead Captured",
    target: `${newLead.name} (${newLead.phone})`,
  });
  return newLead;
}

export function updateLeadStage(leadId: string, stage: LeadStage): void {
  const store = getAdminStore();
  const lead = store.leads.find((l) => l.id === leadId);
  if (lead) {
    const oldStage = lead.leadStage;
    lead.leadStage = stage;
    saveAdminStore(store, {
      action: `Stage changed: ${oldStage} → ${stage}`,
      target: lead.name,
    });
  }
}

export function addLeadNote(leadId: string, text: string, authorName?: string): void {
  const store = getAdminStore();
  const lead = store.leads.find((l) => l.id === leadId);
  if (lead && text.trim()) {
    const current = getCurrentAdmin();
    lead.notes = [
      {
        id: `note-${Date.now()}`,
        author: authorName || current?.name || "Admin",
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
      ...lead.notes,
    ];
    saveAdminStore(store, { action: "Added Counselor Note", target: lead.name });
  }
}

export function importLeadsFromCsv(parsedLeads: Array<Partial<Lead>>): number {
  const store = getAdminStore();
  let count = 0;
  const newLeads: Lead[] = parsedLeads.map((item, idx) => {
    count++;
    return {
      id: `lead-import-${Date.now()}-${idx}`,
      name: item.name || "Unknown Candidate",
      email: item.email || "no-email@finenvision.com",
      phone: item.phone || "-",
      courseInterest: item.courseInterest || "CFA® Program",
      leadStage: (item.leadStage as LeadStage) || "Inquiry",
      city: item.city || "Mumbai",
      sourcePage: item.sourcePage || "/import",
      utmSource: item.utmSource || "csv_import",
      utmMedium: item.utmMedium,
      utmCampaign: item.utmCampaign,
      createdAt: new Date().toISOString(),
      notes: [],
    };
  });
  store.leads = [...newLeads, ...store.leads];
  saveAdminStore(store, { action: "Imported CSV Leads", target: `${count} records` });
  return count;
}

// Course Management Functions
export function updateCourseItem(slug: string, updatedFields: Partial<Course>): void {
  const store = getAdminStore();
  const idx = store.courses.findIndex((c) => c.slug === slug);
  if (idx !== -1) {
    store.courses[idx] = { ...store.courses[idx], ...updatedFields };
    saveAdminStore(store, { action: "Updated Program Details", target: store.courses[idx].title });
  }
}

export function addCourseItem(course: Course): void {
  const store = getAdminStore();
  store.courses.push(course);
  saveAdminStore(store, { action: "Created New Program", target: course.title });
}

export function deleteCourseItem(slug: string): void {
  const store = getAdminStore();
  const target = store.courses.find((c) => c.slug === slug)?.title || slug;
  store.courses = store.courses.filter((c) => c.slug !== slug);
  saveAdminStore(store, { action: "Deleted Program", target });
}

// Auth Helper
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === "undefined") return initialData.users[0];
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(initialData.users[0]));
      return initialData.users[0];
    }
    return JSON.parse(raw);
  } catch {
    return initialData.users[0];
  }
}

export function setCurrentAdmin(user: AdminUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(AUTH_KEY);
  } else {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export function useAdminStore(): AdminStoreData {
  const [data, setData] = useState<AdminStoreData>(getAdminStore());

  useEffect(() => {
    setData(getAdminStore());
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<AdminStoreData>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      } else {
        setData(getAdminStore());
      }
    };
    window.addEventListener("finenvision_store_updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("finenvision_store_updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return data;
}
