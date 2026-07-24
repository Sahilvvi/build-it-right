// Static content store. Sourced from finenvision.com — dummy where unspecified.

export const brand = {
  name: "Fin-Envision Learning",
  shortName: "Fin-Envision",
  tagline: "Your Path to CFA Success Starts Here",
  description:
    "Fin-Envision is amongst the leading CFA classes in Mumbai, offering certified programs in CFA and Financial Modeling. Our concept-focused, practical approach helps students realise their potential and build a future in finance.",
  email: "info@finenvision.com",
  phone: "+91 73048 33625",
  whatsapp: "+917304833625",
  address: "Thane, Mumbai, Maharashtra, India",
};


export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "CFA", to: "/cfa" },
  { label: "About", to: "/about" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
];

export const stats = [
  { value: "80–90%", label: "Success rate" },
  { value: "5,000+", label: "Students trained" },
  { value: "216", label: "Google reviews" },
  { value: "8+ yrs", label: "Teaching experience" },
  { value: "1st", label: "Attempt focus" },
];

export const whyUs = [
  {
    title: "Comprehensive Learning",
    body: "Our programs are designed to take you from the fundamentals to advanced concepts with complete syllabus coverage, structured study plans, mock tests, revision sessions, and continuous support throughout your learning journey.",
    items: [
      "Regular revision lectures",
      "2500+ Practice questions",
      "Handwritten Notes",
      "Recorded videos with unlimited views",
    ],
  },
  {
    title: "Practical Teaching Methodology",
    body: "Finance becomes easier when concepts are connected to the real world. We simplify complex topics using live business examples, case studies, visual explanations, and practical applications that make learning engaging and memorable.",
    items: [
      "Indian Market Focused Examples",
      "Recorded videos and notes of curriculum solving",
      "Career Oriented Approach",
      "Study Planner",
    ],
  },
  {
    title: "Dedicated Mentorship",
    body: "Learning doesn't end after the lecture. Receive continuous guidance through doubt-solving sessions, personalized mentoring, exam strategies, and career advice to help you stay on track and achieve your goals.",
    items: [
      "Personalised Doubt solving sessions",
      "Career Guidance",
      "Exam Support & Mentoring",
    ],
  },
];

export const aboutContent = {
  whoWeAreHeading: "Learn Finance the Way the Industry Works.",
  whoWeAre: [
    "Fin-Envision is a leading training institute, where we provide certified programs in Financial Modelling and CFA. As the name suggests \u201CFinancial Envision\u201D is to give a future perspective to your career. Our approach is to help individuals realize their potential by mentoring and imparting skills.",
    "Formulated through years of teaching experience, our coaching methodology places utmost emphasis on problem solving and conceptual clarity. Ultimately, it is the people that make Fin-Envision the success story it is today, with every instructor carefully selected for their blend of expertise and passion for teaching. The human touch, caring for each and every candidate, and providing them with the best preparation for success, is the real hallmark of Fin-Envision.",
  ],
  mission:
    "To simplify finance education and equip every learner with practical skills required for successful careers in global finance.",
  vision:
    "To become the most trusted finance learning platform by making quality education accessible, practical, and career-oriented.",
  values: [
    "Practical Learning",
    "Student First",
    "Industry Relevance",
    "Continuous Mentorship",
    "Excellence Through Consistency",
  ],
  founderBullets: [
    "Founder and Lead Instructor of Fin-Envision Learning.",
    "Cleared all three levels of the CFA\u00AE Program in the first attempt.",
    "Worked with reputed organizations such as CRISIL and JHP, gaining valuable industry exposure.",
    "Has successfully trained over 5,000 students across Mumbai.",
    "Known for simplifying complex financial concepts into easy-to-understand, practical lessons.",
    "Focuses on bridging the gap between academic learning and real-world finance.",
    "Dedicated to mentoring students for successful careers in finance through industry-oriented training and personalized guidance.",
  ],
};

export type PlaylistCategory = {
  category: string;
  playlists: string[];
};

export const resourcePlaylists: PlaylistCategory[] = [
  {
    category: "CFA Level I",
    playlists: [
      "CFA Level 1 \u2013 FSA \u2013 Financial Analysis Techniques (Ratios)",
      "CFA Level 1 \u2013 FSA | Income Statement",
      "CFA Level 1 \u2013 Quants | Time Value of Money",
    ],
  },
  {
    category: "CFA Level II",
    playlists: [
      "CFA Level 2 Pre-Requisite",
      "CFA Level 2 \u2013 FSA | Intercorporate Investments",
      "CFA Level 2 \u2013 Derivatives | Contingent Claims",
      "CFA Level 2 \u2013 Equity | Private Company Valuation",
      "CFA Level 2 \u2013 Alternative Investments | Investments in Real Estate",
    ],
  },
  {
    category: "Financial Modelling",
    playlists: [
      "Financial Modeling Demo Sessions",
      "Company Analysis",
    ],
  },
  {
    category: "Stock Market",
    playlists: [
      "Basics of Stock Market",
      "Watch List Vs Warn List",
    ],
  },
  {
    category: "Banking & Industry Analysis",
    playlists: ["Banking Series"],
  },
  {
    category: "Professional Finance Programs",
    playlists: ["Mini MBA in Finance"],
  },
];

export const tickerItems = [
  "CFA Level 1 — Feb, May, Aug & Nov windows open",
  "New CFA Level 2 weekend batch starting soon",
  "Free CFA L1 demo lecture every Saturday",
  "Financial Modeling Programme — limited seats",
  "Weekend batches available for working professionals",
  "100% institute curriculum questions solved in class",
];

export const categories = [
  { slug: "cfa", title: "CFA Program", count: 3, hue: "from-blue-500 to-indigo-500" },
  { slug: "financial-modeling", title: "Financial Modeling", count: 1, hue: "from-indigo-500 to-violet-500" },
  { slug: "resources", title: "Self-study Resources", count: 4, hue: "from-amber-500 to-orange-500" },
];

export type Course = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "Live cohort" | "Self-paced" | "Hybrid";
  price: string;
  outcomes: string[];
  highlights: string[];
  rating: number;
  learners: number;
  badge?: string;
};

export const courses: Course[] = [
  {
    slug: "cfa-level-1",
    title: "Chartered Financial Analyst (CFA) Level 1",
    category: "cfa",
    duration: "Classroom + Online · Weekday & Weekend batches",
    level: "Beginner",
    format: "Hybrid",
    price: "₹36,000 classroom / ₹20,000 online",
    rating: 4.9,
    learners: 900,
    badge: "Most popular",
    outcomes: [
      "Understanding formulae from scratch — no rote learning",
      "All 10 CFA L1 topics: Ethics, Quants, Economics, FSA, Corporate Issuers, Equity, Fixed Income, Derivatives, Alternatives, Portfolio Management",
      "5 full mock exams before the exam window",
      "Subject-wise tests through the program",
    ],
    highlights: [
      "100% institute End-of-Chapter (EOC) questions solved in class",
      "Batch size capped at 35 students for focused learning",
      "Handwritten notes + online recorded lectures in the LMS",
      "Weekly doubt-solving sessions",
      "Weekday (Wed & Fri) or Weekend (Sat & Sun) batches",
    ],
  },
  {
    slug: "cfa-level-2",
    title: "Chartered Financial Analyst (CFA) Level 2",
    category: "cfa",
    duration: "Classroom + Online",
    level: "Intermediate",
    format: "Hybrid",
    price: "On request",
    rating: 4.9,
    learners: 420,
    outcomes: [
      "Asset valuation focus — Equity, Fixed Income, Derivatives",
      "22 item sets · 88 vignette-style questions practice",
      "Application of Level I concepts to real cases",
      "Mock papers, subject tests and doubt clinics",
    ],
    highlights: [
      "Taught by Manoj Rajgopal, CFA",
      "Concept-first teaching with real market examples",
      "Recorded lectures for unlimited revision",
      "One-to-one subject-wise doubt support",
    ],
  },
  {
    slug: "cfa-level-3",
    title: "Chartered Financial Analyst (CFA) Level 3",
    category: "cfa",
    duration: "Classroom + Online",
    level: "Advanced",
    format: "Hybrid",
    price: "On request",
    rating: 4.9,
    learners: 220,
    outcomes: [
      "Portfolio management mastery",
      "Essay + item-set practice (11 essay sets · 11 item sets)",
      "Exam day strategy for the constructed-response sections",
      "Personalised mentoring through revision",
    ],
    highlights: [
      "Charterholder-led sessions",
      "Past-paper walkthroughs",
      "Handwritten notes + LMS access",
      "Doubt-solving until exam day",
    ],
  },
  {
    slug: "financial-modeling",
    title: "Financial Modeling Certificate Programme (Holistic Finance)",
    category: "financial-modeling",
    duration: "15 weeks · 100+ hrs",
    level: "Intermediate",
    format: "Live cohort",
    price: "₹25,000 classroom / ₹20,000 online",
    rating: 4.8,
    learners: 600,
    badge: "Internship included",
    outcomes: [
      "Build a full 3-statement model on a listed company",
      "Income Statement, Balance Sheet & Cashflow modelling",
      "Forecasting, scenario building & valuation (DCF, comparables)",
      "Sell-side report + pitch deck in a group of 3",
    ],
    highlights: [
      "30 hrs concept learning + 5 hrs Excel & Advanced Excel",
      "50 hrs project learning + 20 hrs presentation",
      "Guaranteed internship at the end of the course",
      "Real case studies (e.g. Relaxo) — fictitious + actual companies",
      "2 projects with podium presentation",
    ],
  },
];

export const courseHighlights = [
  { title: "Understanding Formulae", body: "Understand every formula from scratch instead of mugging it up." },
  { title: "Focus on WHY", body: "Focusing on why helps you acquire knowledge and actually apply it." },
  { title: "Practical Examples", body: "Practical, real-world examples to sharpen problem-solving." },
  { title: "Subject-Wise Tests", body: "Regular subject-wise tests through the program." },
  { title: "Batch Size", body: "Capped at 35 students per batch for focused learning." },
  { title: "Online Videos", body: "Recorded videos of every topic available in the LMS." },
  { title: "Student Support", body: "Doubt-solving sessions held every week." },
  { title: "Mock Series", body: "Minimum 5 mock exams before every CFA exam window." },
];

export const modelingSyllabus = [
  "Introduction to Financial Statements",
  "Scenario Building Model",
  "Advanced Excel",
  "Ratio Analysis",
  "Sales Data Analysis (Advanced Excel)",
  "Project Finance Model",
  "Financial Model — Actual Company",
  "Forecasting of Business",
  "Market Valuation",
  "Final Valuation",
];

export const cfaExamPattern = {
  level1: {
    when: "Conducted 4 times a year — February, May, August and November",
    format: "180 MCQs split across two 135-minute sessions, with an optional break in between.",
    sessions: [
      "Session 1 (2h 15m): 90 MCQs — Ethics, Quants, Economics, Financial Statement Analysis",
      "Session 2 (2h 15m): 90 MCQs — Corporate Issuers, Equity, Fixed Income, Derivatives, Alternatives, Portfolio Management",
    ],
    results: "Results released within 60 days · No negative marking",
  },
  level2: {
    when: "Conducted 3 times a year — May, August and November",
    format: "22 item sets (vignettes) with 88 accompanying multiple-choice questions.",
    sessions: [
      "Session 1 (2h 12m): item sets covering Ethics, Quants, Economics & FSA",
      "Session 2 (2h 12m): item sets covering Corporate Issuers, Equity, Fixed Income, Derivatives, Alternatives & PM",
    ],
    results: "Results released within 60 days · No negative marking",
  },
  level3: {
    when: "Conducted 2 times a year — February and August",
    format: "Each session has a mix of item sets and essay sets — 11 essay sets and 11 item sets in total, 12 points each.",
    sessions: [
      "Constructed-response (essay) sets test written analysis",
      "Item sets test applied portfolio management decisions",
    ],
    results: "Results released within 10 weeks · No negative marking",
  },
};


export const testimonials = [
  {
    name: "Shidil V.R.",
    role: "CFA Aspirant",
    quote:
      "Manoj sir teaches every subject in detail with realistic examples. His guidance through the CFA journey and his grasp of the financial markets is excellent.",
    rating: 5,
  },
  {
    name: "Rithik Rajput",
    role: "CFA Level 1 Student",
    quote:
      "Every concept of CFA L1 is explained in genuine detail. I would recommend anyone serious about CFA to learn from Fin-Envision Learning.",
    rating: 5,
  },
  {
    name: "Pratik Nagle",
    role: "CFA Student",
    quote:
      "I've been with the class for six months. The way Manoj sir teaches is phenomenal — I learn something new every single day.",
    rating: 5,
  },
  {
    name: "Hrishik Mendonca",
    role: "Science background · CFA",
    quote:
      "Even from a science background, CFA is doable here. Manoj sir is knowledgeable, patient and the schedule is flexible and practical.",
    rating: 5,
  },
  {
    name: "S.",
    role: "Google review",
    quote:
      "Best CFA tutor in Mumbai. Very experienced and knowledgeable mentor — there is a lot to learn from Manoj sir.",
    rating: 5,
  },
];

export const hiringCompanies = [
  "JP Morgan", "CRISIL", "Morgan Stanley", "KPMG", "Barclays", "HSBC",
  "Mirae Asset Capital Markets", "NSE Indices Ltd", "PL Capital",
  "Caprize Investment Managers", "Negen Capital Services Pvt Ltd",
  "Philip Capital", "Motilal Oswal",
];

export const journey = [
  { step: "01", title: "Enquire", body: "Tell us your goal — CFA level, Financial Modeling, or career switch." },
  { step: "02", title: "Counselling", body: "Speak with our team to map the right batch and study plan." },
  { step: "03", title: "Classroom + Online", body: "Learn concepts first, then apply with curriculum questions and mocks." },
  { step: "04", title: "Practice & mocks", body: "Subject tests, mock exams, handwritten notes and doubt clinics." },
  { step: "05", title: "Clear the exam", body: "Walk into the exam prepared — and step into a finance career." },
];

export const values = [
  { title: "Concept Focused", body: "Learning the concept, not just mugging up formulas." },
  { title: "Practical Learning", body: "CFA concepts taught with real-world practical application." },
  { title: "Student Support", body: "Ongoing doubt-solving and mentor access through the course." },
  { title: "Full Curriculum", body: "100% of the institute curriculum questions are solved in class." },
];

export const faqs = [
  {
    q: "How do I prepare for the CFA exams and what study materials do you provide?",
    a: "All concepts are covered in-depth in classroom sessions with practical examples and curriculum questions solved. You also get pre-recorded lectures for reference, subject tests, mock tests, handwritten notes and any guidance needed for CFA.",
  },
  {
    q: "Can I balance work or other commitments while pursuing the CFA program?",
    a: "Yes — you can balance work and CFA at the same time. For working professionals we run dedicated weekend batches.",
  },
  {
    q: "What career opportunities can I expect after completing the CFA program?",
    a: "The CFA program opens up several roles in finance — Equity Research, Investment Banking, Credit Rating, Derivatives, Portfolio Management and more, with top firms.",
  },
  {
    q: "What are the fees for the CFA Program?",
    a: "The CFA Institute exam fee is $940 (early) and $1,290 (standard) per level, plus a one-time enrolment fee for Level 1. The enrolment fee is not charged for further attempts or higher levels. Coaching fees are shared on enquiry.",
  },
  {
    q: "How often is the CFA Level 1 exam conducted?",
    a: "CFA Level 1 exams are conducted four times a year — February, May, August and November.",
  },
  {
    q: "Is there negative marking in the CFA exam?",
    a: "No, the CFA exam does not have negative marking. Results are typically released within 60 days for Levels 1 & 2 and within 10 weeks for Level 3.",
  },
];

export const resources = [
  { type: "Video", title: "Understanding Income Statement — FSA — CFA L1", reads: "44 min" },
  { type: "Video", title: "Financial Analysis Techniques (Ratios) — FSA — CFA L1", reads: "3-part series" },
  { type: "Video", title: "Working Capital & Liquidity — Corporate Issuers — CFA L1", reads: "1h 07m" },
  { type: "Video", title: "Intercorporate Investments — FSA — CFA L2 (4 parts)", reads: "Series" },
  { type: "Video", title: "Valuation of Contingent Claims — Derivatives — CFA L2", reads: "3 lectures" },
  { type: "Video", title: "Financial Modeling — Relaxo case study", reads: "Full walkthrough" },
];

export const resourceCategories = ["CFA Level 1", "CFA Level 2", "CFA Level 3", "Financial Modeling"];

export const services = [
  { title: "Classroom Coaching", body: "In-person CFA & Financial Modeling classes in Mumbai." },
  { title: "Online Lectures", body: "Pre-recorded lectures for reference and revision." },
  { title: "Doubt Clinics", body: "Ongoing doubt-solving sessions through the program." },
  { title: "Mock Tests", body: "Subject tests and full mock exams under timed conditions." },
  { title: "Handwritten Notes", body: "Concise, concept-first notes for every topic." },
];

export const enrollmentSteps = [
  { title: "Enquire", body: "Share your details — we get back within a few minutes." },
  { title: "Counselling", body: "Free counselling on level, batch and study plan." },
  { title: "Enrol", body: "Confirm your batch and complete the enrolment." },
  { title: "Start learning", body: "Join classroom + online sessions and begin." },
];
