## Goal

Replace the dummy copy on the three pages covered by the uploaded `WEBSITE_CONTENT_1_1.xlsx` with the real content the client provided, and verify the live preview.

The spreadsheet has 3 sheets: **Home**, **About Us**, **Resources**. Other pages (Courses, CFA, Career Guidance, Contact) are not in the file — I'll leave them alone.

## Content mapping

### `src/data/site.ts` (single source of truth)
Update these exports to match the sheet:

- `brand.tagline` → "Learn Finance the Way the Industry Works." (About sheet headline reused as tagline is fine, but the Home sheet has no explicit tagline — I'll keep the current hero headline "Learn What Finance Really Feels Like" since the sheet only says `1. Tagline` with no value).
- `stats` → Students Trained **5,000+**, Success Rate **80–90%**, Teaching Experience **8+ years**, plus Google reviews (keep count) and 1st Attempt focus.
- Add a new `whyUs` array with the three Home pillars: **Comprehensive Learning**, **Practical Teaching Methodology**, **Dedicated Mentorship** (with the exact body text from the sheet).
- Add `careerStages`: Student, Young Professional, Career Switcher, Senior Professional.
- Add `aboutPage` object:
  - `whoWeAre` heading + two paragraphs from sheet section 1.
  - `mission`, `vision`, `values` (5 values from sheet section 2).
  - `founder` — Manoj Sir bio bullets from section 3 (CFA charterholder, all 3 levels first attempt, CRISIL & JHP, 5,000+ students, etc.).
- Add `resourcesContent` with sheet's playlist categories and titles:
  - CFA Level I (9 playlists), CFA Level II (5), Financial Modelling (2), Stock Market (2), Banking & Industry Analysis (1), Professional Finance Programs (1 — "Mini MBA in Finance").
  - Intro line: "Learn Finance with Manoj Rajgopal" + the access blurb from the sheet.

### `src/routes/index.tsx` (Home)
- `LearningToLeadership` / "Why Us" section → rewrite the three pillars to use the new **Comprehensive Learning / Practical Teaching Methodology / Dedicated Mentorship** copy.
- `CareerStage` → use the four stages from the sheet (Student, Young Professional, Career Switcher, Senior Professional) instead of current copy.
- Stats badges anywhere on Home → point at updated `stats`.

### `src/routes/about.tsx`
- "Who We Are" intro → sheet's two paragraphs.
- Stats row → 5,000+ students, 80–90% success, 8+ years teaching, Google reviews.
- Mission / Vision / Values blocks → sheet content.
- Manoj Sir bio bullets → sheet content.
- Keep existing Testimonials + FAQ sections (sheet lists them as-is).

### `src/routes/resources.tsx`
- Page hero copy → sheet intro line + access blurb.
- Replace the current `resources` list with the categorised playlist structure from the sheet, grouped by CFA L1 / L2 / Financial Modelling / Stock Market / Banking / Professional Programs.

## Verification

After edits:
1. Run typecheck via the harness build.
2. Load `/`, `/about`, `/resources` in the preview with Playwright, screenshot each, confirm the new headings and copy render.
3. Report back with the screenshots.

## Not in scope

- Courses / CFA / Career Guidance / Contact routes — the sheet has no content for these, so I won't touch them.
- The "Tagline" row on Home is blank in the sheet — I'll leave the current hero headline unless you want a specific replacement.
- No design/layout changes, no new sections beyond what the sheet implies.
