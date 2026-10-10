import type { CustomPage, PageBlock } from "./admin-store";

export const uid = (prefix = "b") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export type BlockType = PageBlock["type"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  text: "Text paragraph",
  image: "Image",
  list: "Bullet list",
  cta: "Call-to-action box",
  faq: "FAQ accordion",
  cards: "Cards grid",
  video: "YouTube video",
  divider: "Divider line",
};

export function newBlock(type: BlockType): PageBlock {
  const id = uid();
  switch (type) {
    case "heading":
      return { id, type, text: "New heading", level: 2 };
    case "text":
      return {
        id,
        type,
        markdown: "Write your text here. Use **bold**, *italic* and [links](/contact).",
      };
    case "image":
      return { id, type, url: "", alt: "", caption: "" };
    case "list":
      return { id, type, items: ["First point", "Second point"] };
    case "cta":
      return {
        id,
        type,
        heading: "Ready to get started?",
        body: "Talk to a counsellor and map your fastest route.",
        buttonText: "Contact us",
        buttonLink: "/contact",
      };
    case "faq":
      return { id, type, items: [{ q: "A common question?", a: "The answer." }] };
    case "cards":
      return {
        id,
        type,
        items: [
          { title: "Card one", body: "Short description.", link: "" },
          { title: "Card two", body: "Short description.", link: "" },
        ],
      };
    case "video":
      return { id, type, youtubeUrl: "", caption: "" };
    case "divider":
      return { id, type };
  }
}

export function cloneBlock(block: PageBlock): PageBlock {
  return { ...(JSON.parse(JSON.stringify(block)) as PageBlock), id: uid() };
}

/** Marker that every starter-template review notice begins with. */
export const REVIEW_NOTE_MARKER = "**Template text.**";

const REVIEW_NOTE =
  "**Template text.** This is a generic starting point, not legal advice. Have it reviewed against how your institute actually collects and uses data before publishing.";

export type TemplateKey = "blank" | "landing" | "privacy" | "terms" | "cookies";

export const TEMPLATES: Array<{ key: TemplateKey; label: string; hint: string }> = [
  { key: "blank", label: "Blank page", hint: "Start from scratch." },
  {
    key: "landing",
    label: "Simple landing page",
    hint: "Heading, text, benefits and a call-to-action.",
  },
  {
    key: "privacy",
    label: "Privacy Policy (template)",
    hint: "Starter text. Review before publishing.",
  },
  {
    key: "terms",
    label: "Terms & Conditions (template)",
    hint: "Starter text. Review before publishing.",
  },
  {
    key: "cookies",
    label: "Cookie Policy (template)",
    hint: "Starter text. Review before publishing.",
  },
];

export function templateBlocks(key: TemplateKey, orgName: string, email: string): PageBlock[] {
  const t = (markdown: string): PageBlock => ({ id: uid(), type: "text", markdown });
  const h = (text: string): PageBlock => ({ id: uid(), type: "heading", text, level: 2 });
  switch (key) {
    case "blank":
      return [];
    case "landing":
      return [
        t("Tell visitors what this page is about in a sentence or two."),
        h("Why choose us"),
        { id: uid(), type: "list", items: ["Benefit one", "Benefit two", "Benefit three"] },
        newBlock("cta"),
      ];
    case "privacy":
      return [
        t(REVIEW_NOTE),
        h("Information we collect"),
        t(
          `When you fill in an enquiry form on this website we collect the details you provide: your name, email address, phone number, the programme you are interested in, and any message you write. We also record basic technical information such as the page you came from.`,
        ),
        h("How we use it"),
        t(
          `- To respond to your enquiry and give career guidance\n- To tell you about batches, fees and study resources you asked about\n- To improve ${orgName}'s courses and website`,
        ),
        h("Who can see it"),
        t(
          `Your details are visible to ${orgName}'s counselling team and the service providers that host this website and deliver our emails. We do not sell your personal information.`,
        ),
        h("How long we keep it"),
        t(
          "We keep enquiry details for as long as needed to follow up and for a reasonable period afterwards. You can ask us to delete them at any time.",
        ),
        h("Your choices"),
        t(
          `To see, correct or delete your information, or to stop receiving messages, email us at ${email}.`,
        ),
      ];
    case "terms":
      return [
        t(REVIEW_NOTE),
        h("About these terms"),
        t(
          `By using this website you agree to these terms. They apply to all visitors to the ${orgName} website.`,
        ),
        h("Courses and fees"),
        t(
          "Course details, schedules and fees shown on this website are for guidance and may change. The fee and batch you are offered at enrolment is the one that applies.",
        ),
        h("Study material"),
        t(
          "Notes, recordings and other material are provided for the personal use of enrolled students. Please do not copy, share or resell them.",
        ),
        h("Results"),
        t(
          "Exam results depend on many factors, including a student's own preparation. We cannot guarantee any particular result.",
        ),
        h("Trademarks"),
        t(
          "CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA Institute.",
        ),
        h("Contact"),
        t(`Questions about these terms? Email ${email}.`),
      ];
    case "cookies":
      return [
        t(REVIEW_NOTE),
        h("What are cookies?"),
        t(
          "Cookies are small files stored on your device that help a website work and help its owner understand how it is used.",
        ),
        h("How we use them"),
        t(
          "- **Essential:** to keep the website working\n- **Analytics:** to understand which pages are useful, so we can improve them\n- **Advertising:** to measure how our adverts perform",
        ),
        h("Your choices"),
        t(
          "You can block or delete cookies in your browser settings. The website will still work, though some features may be limited.",
        ),
      ];
  }
}

export function newCustomPage(init: {
  title: string;
  slug: string;
  template: TemplateKey;
  orgName: string;
  email: string;
}): CustomPage {
  const now = new Date().toISOString();
  return {
    id: uid("page"),
    title: init.title,
    slug: init.slug,
    status: "hidden", // new pages start hidden until the admin chooses to publish them
    blocks: templateBlocks(init.template, init.orgName, init.email),
    seoTitle: "",
    seoDescription: "",
    ogImage: "",
    createdAt: now,
    updatedAt: now,
  };
}
