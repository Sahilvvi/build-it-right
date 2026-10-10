# Fin-Envision Learning — setup & admin guide

A public website (home, courses, CFA, about, resources, contact) with a WordPress-style admin portal at
`/admin`. Everything an admin edits is saved to a private **draft**; nothing reaches visitors until someone
presses **Publish**.

**Stack:** TanStack Start (React 19) · Tailwind v4 · Supabase (Postgres, Auth, Storage) · deploys to Vercel.

---

## 1. One-time setup

### 1.1 Create the Supabase project
1. Create a project at supabase.com. Note the **Project URL**, the **anon key** and the **service-role key**
   (Project Settings → API).
2. Open **SQL editor** and run, in this order, the full contents of:
   1. `supabase/migrations/0001_init.sql`
   2. `supabase/migrations/0002_cms_v2.sql`
3. **Authentication → URL Configuration:** set *Site URL* to your website address and add
   `https://YOUR-SITE/admin-login` to *Redirect URLs* (needed for "Forgot password").

### 1.2 Create the first Super Admin
1. **Authentication → Users → Add user**: your email + a strong password, tick *Auto Confirm User*.
2. In the SQL editor (use your email):
   ```sql
   insert into public.admin_profiles (user_id, name, email, role)
   select id, 'Your Name', email, 'super_admin'
   from auth.users where email = 'you@example.com';
   ```
3. Sign in at `/admin-login`. Further admins are added from **Admin Users & Roles**.

> There are no default passwords. Nothing works at `/admin` until you do this step.

### 1.3 Environment variables
Copy `.env.example` to `.env.local` for local work, and add the **same variables in Vercel →
Project → Settings → Environment Variables**.

| Variable | Needed for |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | everything |
| `SUPABASE_SERVICE_ROLE_KEY` | website enquiries, adding admins, test email (**server only**) |
| `VITE_SITE_URL` | correct canonical / social-image / sitemap URLs |
| `SMTP_PASS` | email alerts for new enquiries |
| `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | optional bot check on the enquiry forms |

Then in **Admin → System Settings & SMTP** (Super Admin) enter the SMTP host, port, username and the
recipient address, and press **Send Test Email**.

### 1.4 Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build (Vercel runs this)
```

---

## 2. Day-to-day use

| I want to… | Go to |
|---|---|
| Change wording, links or images on any page | Open the site, click **Edit this page** (bottom-left) |
| Hide or show a section of a page | **Edit this page → Sections** |
| See / undo every wording edit | **Page Text & Sections** |
| Change the menu, login button, footer, social icons | **Header & Footer Menus** |
| Change the top notice bar | **Notice Marquee Ticker** (speed in Header & Footer Menus) |
| Change a page's web address (e.g. `/cfa` → `/cfa-classes`) | **SEO Meta & 301 Redirects → Page Web Addresses** |
| Add a new page (Privacy, landing pages…) | **Pages You Create** |
| Upload images / PDFs | **Media & Documents** (or the picker anywhere an image is needed) |
| Titles, descriptions, share images, redirects | **SEO Meta & 301 Redirects** |
| Analytics / ad pixels | **Tracking & Pixels** |
| See and follow up enquiries | **Candidate Leads CRM** |
| Go back to an earlier published version | **Version History** |

### Draft → Publish
* Every save goes to your **draft**. An amber bar appears: **Preview** (see the site with your changes),
  **Discard** (throw the draft away), **Publish** (make it live; a restorable copy is kept).
* The last 40 published versions are kept; **Restore to draft** loads one back so you can review and republish.
* If two admins edit at once, the second save is refused with a "Reload" prompt rather than overwriting.

### Roles
| | Admin | Super Admin |
|---|---|---|
| Edit content, pages, media, SEO, menus, leads | ✅ | ✅ |
| Publish, discard, restore | ✅ | ✅ |
| Custom scripts (Tracking), SMTP settings, add/deactivate admins | ❌ | ✅ |

These limits are enforced by the database, not just hidden in the interface.

---

## 3. Testing

```bash
npm run check      # type-check + lint + unit tests
npm run test:sql   # 47 security tests against a real throwaway Postgres (downloads it on first run)
```

`test:sql` applies both migrations and attacks them as an anonymous visitor, a signed-in non-admin, a
deactivated admin, a regular admin and a Super Admin.

---

## 4. Good to know

* **Legal pages:** *Pages You Create → New page* offers Privacy, Terms and Cookie **templates**. They are
  generic starting points, not legal advice. Have them reviewed; the page cannot be published until the
  "Template text" notice block is removed.
* **How text editing works:** public-site files opt in with `/** @jsxImportSource @/lib/editable */`, and
  replacements are keyed by the *original* wording. If a developer later rewrites a sentence in the code, any
  edit made to the old sentence stops applying (it stays listed under *Page Text & Sections* so it can be
  removed). A change applies to every place that exact wording appears.
* **Page addresses** take effect for visitors after you publish. The old address redirects automatically.
* **Sections** can be hidden but not reordered.
* **Service-role key** must never be given a `VITE_` prefix or committed.
