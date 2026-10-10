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
  navLinks as defaultNavLinks,
} from "../data/site";
import type { Course } from "../data/site";
import { supabase } from "./supabase";
import { createAdminUserFn } from "./admin-users";

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

export interface MenuLink {
  id: string;
  label: string;
  /** Site path ("/about"), or a full http(s):// / mailto: / tel: URL. */
  to: string;
  isActive: boolean;
  openInNewTab: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: MenuLink[];
}

export type SocialPlatform = "linkedin" | "instagram" | "youtube" | "whatsapp" | "facebook" | "x";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  isActive: boolean;
}

export interface NavigationSettings {
  announcementBar: { enabled: boolean; rotateSeconds: number };
  links: MenuLink[];
  showPhoneButton: boolean;
  loginButton: {
    enabled: boolean;
    label: string;
    url: string;
    openInNewTab: boolean;
    tooltipTitle: string;
    showOrgCode: boolean;
  };
}

export interface FooterSettings {
  columns: FooterColumn[];
  socials: SocialLink[];
  legalLinks: MenuLink[];
  showStaffPortalLink: boolean;
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
  navigation: NavigationSettings;
  footer: FooterSettings;
  /** built-in page address -> custom public address (only pages the admin renamed) */
  pageSlugs: Record<string, string>;
  media: MediaItem[];
  seo: Record<string, SeoPageMeta>;
  redirects: RedirectRule[];
  tracking: TrackingSettings;
  users: AdminUser[];
  smtp: SmtpSettings;
  activityHistory: ActivityLogItem[];
}

const AUTH_KEY = "finenvision_staff_session_v3";

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
    footerCopyright:
      "© 2026 Fin-Envision Learning. All rights reserved. CFA® and Chartered Financial Analyst are registered trademarks owned by CFA Institute.",
    footerBlurb: defaultBrand.description,
  },
  leads: [],
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
    category: "General",
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
  pageSlugs: {},
  navigation: {
    announcementBar: { enabled: true, rotateSeconds: 5 },
    links: defaultNavLinks.map((l, i) => ({
      id: `nav-${i + 1}`,
      label: l.label,
      to: l.to,
      isActive: true,
      openInNewTab: false,
    })),
    showPhoneButton: true,
    loginButton: {
      enabled: true,
      label: "Login",
      url: "https://web.classplusapp.com",
      openInNewTab: true,
      tooltipTitle: "Classplus Login Portal",
      showOrgCode: true,
    },
  },
  footer: {
    columns: [
      {
        id: "col-company",
        title: "Company",
        links: [
          { id: "fl-1", label: "About Us", to: "/about", isActive: true, openInNewTab: false },
        ],
      },
      {
        id: "col-resources",
        title: "Resources",
        links: [
          { id: "fl-2", label: "Blog", to: "/resources", isActive: true, openInNewTab: false },
          {
            id: "fl-3",
            label: "Case Studies",
            to: "/resources",
            isActive: true,
            openInNewTab: false,
          },
          {
            id: "fl-4",
            label: "YouTube",
            to: "https://www.youtube.com/@financewithmanojrajgopal",
            isActive: true,
            openInNewTab: true,
          },
        ],
      },
      {
        id: "col-support",
        title: "Support",
        links: [
          { id: "fl-5", label: "Contact Us", to: "/contact", isActive: true, openInNewTab: false },
        ],
      },
    ],
    socials: [
      {
        id: "soc-1",
        platform: "linkedin",
        url: "https://www.linkedin.com/in/manojrajgopal",
        isActive: true,
      },
      {
        id: "soc-2",
        platform: "instagram",
        url: "https://www.instagram.com/finenvision.cfa",
        isActive: true,
      },
      {
        id: "soc-3",
        platform: "youtube",
        url: "https://www.youtube.com/@financewithmanojrajgopal",
        isActive: true,
      },
      {
        id: "soc-4",
        platform: "whatsapp",
        url: "https://wa.me/917304833625?text=Hello%20Team%20Fin%20Envision%2C%20I%20have%20a%20few%20queries%20regarding%20the%20courses!",
        isActive: true,
      },
    ],
    legalLinks: [
      { id: "lg-1", label: "Privacy", to: "/contact", isActive: true, openInNewTab: false },
      { id: "lg-2", label: "Terms", to: "/contact", isActive: true, openInNewTab: false },
      { id: "lg-3", label: "Cookies", to: "/contact", isActive: true, openInNewTab: false },
    ],
    showStaffPortalLink: true,
  },
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
      title: "Fin-Envision Learning — Learn What Finance Really Feels Like",
      description:
        "Fin-Envision Learning — leading CFA® classes in Mumbai. CFA® Level 1, 2, 3 and Financial Modeling, taught by Manoj Rajgopal, CFA. ~80–90% success rate, 1,500+ students trained.",
      ogImage: "/finenvision-logo.png",
    },
    "/cfa": {
      title: "CFA® Program — Level I, II & III Prep | Fin-Envision Learning",
      description:
        "Self-paced CFA® Level I, II & III prep with one mentor, real-life examples, and 100% coverage in English + Hindi. Trusted by candidates worldwide.",
      ogImage: "/finenvision-logo.png",
    },
    "/courses": {
      title: "CFA® Prep Program — Fin-Envision Learning",
      description:
        "Master the CFA® Program with India's most trusted prep — live mentors, 216+ Google reviews at 4.9★. Levels I, II, III with structured curriculum, mocks, doubt clinics and placement support.",
      ogImage: "/finenvision-logo.png",
    },
    "/about": {
      title: "About — Learn Finance the Way the Industry Works | Fin-Envision Learning",
      description:
        "Fin-Envision offers certified programs in CFA® and Financial Modelling — 5,000+ students trained, ~80–90% success rate, 8+ years of teaching experience, led by Manoj Rajgopal, CFA.",
      ogImage: "/finenvision-logo.png",
    },
    "/resources": {
      title: "Resources — Learn Finance with Manoj Rajgopal | Fin-Envision Learning",
      description:
        "Free YouTube playlists on CFA® Level I & II, Financial Modelling, Stock Markets, Corporate Finance and Investment Banking — taught by Manoj Rajgopal, CFA.",
      ogImage: "/finenvision-logo.png",
    },
    "/contact": {
      title: "Contact — Fin-Envision Learning",
      description: "Talk to our team. WhatsApp, email, phone or visit us in Mumbai.",
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
    ga4Id: "",
    gtmId: "",
    metaPixelId: "",
    searchConsoleToken: "",
    customHeadScript: "",
    customBodyScript: "",
  },
  users: [],
  smtp: {
    leadNotificationEmail: "contactfinenvision@gmail.com",
    sendLeadAlerts: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "contactfinenvision@gmail.com",
    smtpPass: "",
    senderName: "Fin-Envision Portal",
  },
  activityHistory: [],
};

// ---------------------------------------------------------------------------
// Persistence — Supabase is the source of truth (see supabase/migrations).
//
//  * Public site content   -> site_content row 'public'  (world-readable, loaded on the server)
//  * Admin-only settings   -> site_content row 'private' (SMTP, activity log; RLS: admins only)
//  * Leads                 -> leads table                (visitors may only INSERT)
//  * Admin accounts        -> Supabase Auth + admin_profiles
//
// `getAdminStore()` / `saveAdminStore()` keep their old synchronous signatures so the admin
// pages did not need to change: reads come from an in-memory copy, writes are applied
// immediately and flushed to Supabase in the background (see `schedulePersist`).
// ---------------------------------------------------------------------------

const LEGACY_STORAGE_KEY = "finenvision_admin_store_v2";
const SEED_LEAD_IDS = /^lead-[1-5]$/;

type PublicContent = Omit<AdminStoreData, "leads" | "users" | "smtp" | "activityHistory">;
type PrivateContent = Pick<AdminStoreData, "smtp" | "activityHistory">;
export type ContentRow = { data: Partial<AdminStoreData> | null; updated_at: string };

export type SaveStatus = { state: "idle" | "saving" | "saved" | "error"; message?: string };

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function pickPublic(d: AdminStoreData): PublicContent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { leads, users, smtp, activityHistory, ...rest } = d;
  return rest;
}

function pickPrivate(d: AdminStoreData): PrivateContent {
  return { smtp: d.smtp, activityHistory: d.activityHistory };
}

/** Layer saved content over the built-in defaults so newly added fields always exist. */
function mergeWithDefaults(saved: Partial<AdminStoreData> | null | undefined): AdminStoreData {
  const base = clone(initialData);
  const parsed = saved ?? {};
  return {
    ...base,
    ...parsed,
    leads: base.leads,
    users: base.users,
    visuals: { ...base.visuals, ...(parsed.visuals || {}) },
    identity: { ...base.identity, ...(parsed.identity || {}) },
    homeContent: {
      ...base.homeContent,
      ...(parsed.homeContent || {}),
      founderSpotlight: {
        ...base.homeContent.founderSpotlight,
        ...(parsed.homeContent?.founderSpotlight || {}),
      },
      demoVideos: {
        ...base.homeContent.demoVideos,
        ...(parsed.homeContent?.demoVideos || {}),
      },
      placementSection: {
        ...base.homeContent.placementSection,
        ...(parsed.homeContent?.placementSection || {}),
      },
      appSection: {
        ...base.homeContent.appSection,
        ...(parsed.homeContent?.appSection || {}),
      },
      companiesSection: {
        ...base.homeContent.companiesSection,
        ...(parsed.homeContent?.companiesSection || {}),
      },
      finalCta: {
        ...base.homeContent.finalCta,
        ...(parsed.homeContent?.finalCta || {}),
      },
    },
    coursesPageContent: { ...base.coursesPageContent, ...(parsed.coursesPageContent || {}) },
    cfaPageContent: { ...base.cfaPageContent, ...(parsed.cfaPageContent || {}) },
    aboutContent: { ...base.aboutContent, ...(parsed.aboutContent || {}) },
    resourcesContent: { ...base.resourcesContent, ...(parsed.resourcesContent || {}) },
    contactPageContent: { ...base.contactPageContent, ...(parsed.contactPageContent || {}) },
    navigation: {
      ...base.navigation,
      ...(parsed.navigation || {}),
      announcementBar: {
        ...base.navigation.announcementBar,
        ...(parsed.navigation?.announcementBar || {}),
      },
      loginButton: {
        ...base.navigation.loginButton,
        ...(parsed.navigation?.loginButton || {}),
      },
    },
    footer: { ...base.footer, ...(parsed.footer || {}) },
    pageSlugs: { ...(parsed.pageSlugs || {}) },
    smtp: { ...base.smtp, ...(parsed.smtp || {}) },
    activityHistory: parsed.activityHistory ?? base.activityHistory,
  };
}

// In-memory state. On the server this holds the latest *public* content only.
let current: AdminStoreData = clone(initialData);
// Epoch ms of the newest public-content row we have applied or written ourselves. Content is only
// ever replaced by a *newer* row, so a stale copy (e.g. the root loader's original data being
// re-applied on a later render) can never overwrite fresher edits.
let newestSeen: number | null = null;
const persisted = { public: "", private: "", leads: new Map<string, string>() };

/** True once real content from the database has been applied (vs. built-in defaults). */
export function isStoreHydrated(): boolean {
  return newestSeen !== null;
}

export function getAdminStore(): AdminStoreData {
  return current;
}

function emitStoreUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("finenvision_store_updated", { detail: current }));
}

function emitStatus(status: SaveStatus) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("finenvision_save_status", { detail: status }));
}

/** Read the public content row. Works on the server (SSR) and in the browser. */
export async function fetchPublicContent(): Promise<ContentRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_content")
    .select("data, updated_at")
    .eq("id", "public")
    .maybeSingle();
  if (error) {
    console.error("Failed to load site content:", error.message);
    return null;
  }
  return (data as ContentRow | null) ?? null;
}

/**
 * Apply the public content row to the in-memory store. Called from the root route during
 * render (server and client) so the first paint already shows live content. It is a no-op
 * unless the row is newer than anything already applied or saved, so re-renders with stale
 * loader data never clobber fresher edits.
 */
export function hydratePublicContent(row: ContentRow | null | undefined, force = false): void {
  const ts = row?.updated_at ? Date.parse(row.updated_at) : 0;
  if (!force && newestSeen !== null && ts <= newestSeen) return;
  newestSeen = Math.max(ts, newestSeen ?? 0);
  const merged = mergeWithDefaults(row?.data);
  current = {
    ...merged,
    leads: current.leads,
    users: current.users,
    smtp: current.smtp,
    activityHistory: current.activityHistory,
  };
}

export function saveAdminStore(
  data: AdminStoreData,
  logAction?: { action: string; target: string },
): void {
  if (typeof window === "undefined") return;
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
  current = data;
  emitStoreUpdated();
  schedulePersist();
}

let persisting = false;
let dirty = false;

function schedulePersist() {
  dirty = true;
  if (!persisting) void runPersist();
}

async function runPersist() {
  persisting = true;
  emitStatus({ state: "saving" });
  try {
    while (dirty) {
      dirty = false;
      await persistOnce(current);
    }
    emitStatus({ state: "saved" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save changes.";
    console.error("Supabase save failed:", err);
    emitStatus({ state: "error", message });
  } finally {
    persisting = false;
  }
}

async function persistOnce(data: AdminStoreData) {
  if (!supabase) throw new Error("Backend is not configured (missing Supabase env vars).");
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("Your session expired. Please sign in again.");

  const publicJson = JSON.stringify(pickPublic(data));
  if (publicJson !== persisted.public) {
    const { data: row, error } = await supabase
      .from("site_content")
      .upsert({ id: "public", data: JSON.parse(publicJson) })
      .select("updated_at")
      .single();
    if (error) throw new Error(error.message);
    persisted.public = publicJson;
    // Anything older than our own write is stale and must never be re-applied.
    newestSeen = Math.max(newestSeen ?? 0, Date.parse((row as { updated_at: string }).updated_at));
  }

  const privateJson = JSON.stringify(pickPrivate(data));
  if (privateJson !== persisted.private) {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: "private", data: JSON.parse(privateJson) });
    if (error) throw new Error(error.message);
    persisted.private = privateJson;
  }

  const next = new Map(data.leads.map((l) => [l.id, JSON.stringify(l)]));
  const changed = data.leads.filter((l) => persisted.leads.get(l.id) !== next.get(l.id));
  const removed = [...persisted.leads.keys()].filter((id) => !next.has(id));
  if (changed.length) {
    const { error } = await supabase
      .from("leads")
      .upsert(changed.map((l) => ({ id: l.id, data: l, created_at: l.createdAt })));
    if (error) throw new Error(error.message);
  }
  if (removed.length) {
    const { error } = await supabase.from("leads").delete().in("id", removed);
    if (error) throw new Error(error.message);
  }
  persisted.leads = next;
}

type ProfileRow = {
  user_id: string;
  name: string;
  email: string;
  role: AdminUser["role"];
  status: AdminUser["status"];
  last_login: string | null;
};

function toAdminUser(p: ProfileRow): AdminUser {
  return {
    id: p.user_id,
    name: p.name,
    email: p.email,
    role: p.role,
    status: p.status,
    lastLogin: p.last_login ?? undefined,
  };
}

/**
 * Pull everything an admin is allowed to see (private settings, leads, admin accounts) and the
 * freshest public content. The admin shell must await this before rendering editors, otherwise
 * a save could overwrite the database with built-in defaults.
 */
export async function loadAdminData(): Promise<void> {
  if (!supabase) throw new Error("Backend is not configured (missing Supabase env vars).");
  const [publicRow, privateRes, leadsRes, profilesRes] = await Promise.all([
    fetchPublicContent(),
    supabase.from("site_content").select("data").eq("id", "private").maybeSingle(),
    supabase.from("leads").select("id, data").order("created_at", { ascending: false }),
    supabase.from("admin_profiles").select("*").order("created_at", { ascending: true }),
  ]);
  const failure = privateRes.error || leadsRes.error || profilesRes.error;
  if (failure) throw new Error(failure.message);

  hydratePublicContent(publicRow, true);
  const priv = (privateRes.data?.data ?? {}) as Partial<PrivateContent>;
  const leads = (leadsRes.data ?? []).map((r) => r.data as Lead);

  current = {
    ...current,
    smtp: { ...initialData.smtp, ...(priv.smtp || {}) },
    activityHistory: priv.activityHistory ?? [],
    leads,
    users: (profilesRes.data as ProfileRow[]).map(toAdminUser),
  };
  persisted.public = JSON.stringify(pickPublic(current));
  persisted.private = JSON.stringify(pickPrivate(current));
  persisted.leads = new Map(leads.map((l) => [l.id, JSON.stringify(l)]));
  emitStoreUpdated();
}

function resetAdminOnlyState() {
  current = {
    ...current,
    leads: [],
    users: [],
    smtp: clone(initialData.smtp),
    activityHistory: [],
  };
  persisted.public = "";
  persisted.private = "";
  persisted.leads = new Map();
}

// ---------------------------------------------------------------- legacy migration
// Before Supabase, edits lived in this browser's localStorage. Offer a one-time import.

function readLegacy(): Partial<AdminStoreData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<AdminStoreData>) : null;
  } catch {
    return null;
  }
}

export function hasLegacyLocalStore(): boolean {
  return readLegacy() !== null;
}

export function dismissLegacyLocalStore(): void {
  if (typeof window !== "undefined") localStorage.removeItem(LEGACY_STORAGE_KEY);
}

/** Copies the old browser-only content (and any non-demo leads) into Supabase. */
export function importLegacyLocalStore(): { leads: number } {
  const legacy = readLegacy();
  if (!legacy) return { leads: 0 };
  const merged = mergeWithDefaults(legacy);
  const legacyLeads = (Array.isArray(legacy.leads) ? legacy.leads : []).filter(
    (l) => !SEED_LEAD_IDS.test(l.id),
  );
  const known = new Set(current.leads.map((l) => l.id));
  const newLeads = legacyLeads.filter((l) => !known.has(l.id));
  saveAdminStore(
    { ...current, ...pickPublic(merged), leads: [...newLeads, ...current.leads] },
    { action: "Imported previous browser data", target: `${newLeads.length} leads + site content` },
  );
  dismissLegacyLocalStore();
  return { leads: newLeads.length };
}

// ---------------------------------------------------------------- public lead capture

/** Called by the public lead form. Anonymous INSERT only — RLS blocks reading it back. */
export async function submitPublicLead(
  leadData: Omit<Lead, "id" | "createdAt" | "notes" | "leadStage">,
): Promise<void> {
  if (!supabase) throw new Error("Backend is not configured (missing Supabase env vars).");
  const createdAt = new Date().toISOString();
  const lead: Lead = {
    ...leadData,
    leadStage: "Inquiry",
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    notes: [],
  };
  const { error } = await supabase
    .from("leads")
    .insert({ id: lead.id, data: lead, created_at: createdAt });
  if (error) throw new Error(error.message);
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

// ---------------------------------------------------------------- Auth (Supabase Auth)

const NOT_CONFIGURED =
  "Backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";

async function fetchOwnProfile(userId: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as ProfileRow | null) ?? null;
}

export async function signInAdmin(email: string, password: string): Promise<AdminUser> {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error("Invalid email or password.");
  const profile = await fetchOwnProfile(data.user.id);
  if (!profile || profile.status !== "active") {
    await supabase.auth.signOut();
    throw new Error("This account is not authorised for the admin portal or is deactivated.");
  }
  await supabase.rpc("touch_last_login");
  const user = toAdminUser({ ...profile, last_login: new Date().toISOString() });
  setCurrentAdmin(user);
  return user;
}

/** Verifies the stored Supabase session is still valid and the account is still active. */
export async function restoreAdminSession(): Promise<AdminUser | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    setCurrentAdmin(null);
    return null;
  }
  const profile = await fetchOwnProfile(data.session.user.id);
  if (!profile || profile.status !== "active") {
    setCurrentAdmin(null);
    return null;
  }
  const user = toAdminUser(profile);
  setCurrentAdmin(user);
  return user;
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin-login`,
  });
  if (error) throw new Error(error.message);
}

export async function setNewPassword(password: string): Promise<void> {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  const me = getCurrentAdmin();
  if (!me) throw new Error("No active admin session found.");
  const check = await supabase.auth.signInWithPassword({
    email: me.email,
    password: currentPassword,
  });
  if (check.error) throw new Error("Current password is incorrect.");
  await setNewPassword(newPassword);
  saveAdminStore({ ...current }, { action: "Updated Password", target: me.name });
}

export async function setAdminUserStatus(userId: string, status: AdminUser["status"]) {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  const { error } = await supabase.from("admin_profiles").update({ status }).eq("user_id", userId);
  if (error) throw new Error(error.message);
  current = {
    ...current,
    users: current.users.map((u) => (u.id === userId ? { ...u, status } : u)),
  };
  emitStoreUpdated();
}

export async function createAdminUser(input: {
  name: string;
  email: string;
  password: string;
  role: AdminUser["role"];
}): Promise<void> {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Your session expired. Please sign in again.");
  const created = await createAdminUserFn({
    data: { ...input, accessToken: data.session.access_token },
  });
  current = { ...current, users: [...current.users, created] };
  saveAdminStore({ ...current }, { action: "Added Admin User", target: created.name });
}

// Auth Helper — a UI cache of who is signed in. It grants nothing: Supabase RLS decides access.
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    // Purge legacy auto-login keys from earlier releases if present
    localStorage.removeItem("finenvision_current_admin_user");
    localStorage.removeItem("finenvision_current_admin");

    const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentAdmin(user: AdminUser | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("finenvision_current_admin_user");
    localStorage.removeItem("finenvision_current_admin");
    void supabase?.auth.signOut();
    resetAdminOnlyState();
  } else {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
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
