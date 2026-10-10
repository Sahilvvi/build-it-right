import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users2,
  FileEdit,
  GraduationCap,
  Image as ImageIcon,
  MessageSquareQuote,
  Megaphone,
  Globe,
  Activity,
  ShieldCheck,
  Settings,
  ExternalLink,
  LogOut,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  Bell,
  Search,
  Command,
  ArrowUpRight,
  Layers,
  BookOpen,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  Calendar,
  LayoutPanelTop,
  FilePlus2,
  Type as TypeIcon,
  History as HistoryIcon,
  type LucideIcon,
} from "lucide-react";
import {
  getCurrentAdmin,
  setCurrentAdmin,
  getAdminStore,
  getContentEpoch,
  useAdminStore,
  restoreAdminSession,
  loadAdminData,
  hasLegacyLocalStore,
  importLegacyLocalStore,
  dismissLegacyLocalStore,
  type SaveStatus,
} from "@/lib/admin-store";
import { PublishBar } from "@/components/admin/PublishBar";

interface AdminLayoutProps {
  children?: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badgeKey?: "leads";
  /** Only visible to Super Admins. */
  superOnly?: boolean;
}

/** Screens only a Super Admin may open (the database enforces the real rule). */
const SUPER_ONLY_PATHS = ["/admin/users", "/admin/settings"];

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "GROWTH & PIPELINE",
    items: [
      { label: "Executive Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { label: "Candidate Leads CRM", href: "/admin/leads", icon: Users2, badgeKey: "leads" },
    ],
  },
  {
    title: "WEBSITE PAGES & SECTIONS",
    items: [
      { label: "Website Pages CMS", href: "/admin/pages", icon: FileEdit },
      { label: "Courses & Batch Pricing", href: "/admin/courses", icon: GraduationCap },
      { label: "Page Text & Sections", href: "/admin/text", icon: TypeIcon },
      { label: "Pages You Create", href: "/admin/custom-pages", icon: FilePlus2 },
      { label: "Header & Footer Menus", href: "/admin/navigation", icon: LayoutPanelTop },
      { label: "Notice Marquee Ticker", href: "/admin/announcements", icon: Megaphone },
      { label: "Student Reviews", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Media & Documents", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "SYSTEM & MARKETING",
    items: [
      { label: "SEO Meta & 301 Redirects", href: "/admin/seo", icon: Globe },
      { label: "Tracking & Pixels", href: "/admin/tracking", icon: Activity },
      { label: "Version History", href: "/admin/history", icon: HistoryIcon },
      { label: "Admin Users & Roles", href: "/admin/users", icon: ShieldCheck, superOnly: true },
      { label: "System Settings & SMTP", href: "/admin/settings", icon: Settings, superOnly: true },
    ],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setUser] = useState(getCurrentAdmin());
  const [ready, setReady] = useState(false);
  const liveNotice = useAdminStore()
    .announcements.filter((a) => a.isActive && a.text.trim())
    .sort((a, b) => a.priority - b.priority)[0]?.text;
  const [loadError, setLoadError] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ state: "idle" });
  const [legacyAvailable, setLegacyAvailable] = useState(false);
  const [pendingLeads, setPendingLeads] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    // Verify the Supabase session server-side, then load everything this admin may see.
    // Editors are not rendered until this finishes so a save can never overwrite the
    // database with built-in defaults.
    (async () => {
      try {
        const user = await restoreAdminSession();
        if (cancelled) return;
        if (!user) {
          navigate({ to: "/admin-login" });
          return;
        }
        setUser(user);
        await loadAdminData();
        if (cancelled) return;
        setLegacyAvailable(hasLegacyLocalStore());
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load admin data.");
        }
      }
    })();

    const refreshCounts = () => {
      const store = getAdminStore();
      const count = store.leads.filter(
        (l) => l.leadStage === "Inquiry" || l.leadStage === "Interested",
      ).length;
      setPendingLeads(count);
    };
    const onStatus = (e: Event) => setSaveStatus((e as CustomEvent<SaveStatus>).detail);

    refreshCounts();
    window.addEventListener("finenvision_store_updated", refreshCounts);
    window.addEventListener("finenvision_save_status", onStatus);
    return () => {
      cancelled = true;
      window.removeEventListener("finenvision_store_updated", refreshCounts);
      window.removeEventListener("finenvision_save_status", onStatus);
    };
  }, [navigate]);

  const handleImportLegacy = () => {
    if (
      !window.confirm(
        "Copy the content and leads previously saved in this browser into the live database? " +
          "This replaces the current live website content.",
      )
    )
      return;
    const { leads } = importLegacyLocalStore();
    setLegacyAvailable(false);
    window.alert(`Imported site content and ${leads} lead(s).`);
  };

  const handleConfirmLogout = () => {
    setCurrentAdmin(null);
    setShowLogoutConfirm(false);
    navigate({ to: "/admin-login" });
  };

  useEffect(() => {
    document.body.classList.add("admin-body-override");
    return () => {
      document.body.classList.remove("admin-body-override");
    };
  }, []);

  const currentPath = location.pathname;
  const blockedForRole =
    ready &&
    currentUser?.role !== "super_admin" &&
    SUPER_ONLY_PATHS.some((p) => currentPath === p || currentPath.startsWith(`${p}/`));

  useEffect(() => {
    if (blockedForRole) navigate({ to: "/admin", replace: true });
  }, [blockedForRole, navigate]);

  if (!currentUser) {
    return (
      <div
        className="admin-scope min-h-screen bg-slate-50 flex items-center justify-center p-4"
        data-admin-portal="true"
      >
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Administrator Access Required</h2>
          <p className="text-xs text-slate-500 mt-1.5 mb-5">
            You must be signed in with authorized staff credentials to access the admin portal.
          </p>
          <Link
            to="/admin-login"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs"
          >
            <span>Proceed to Sign In</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-scope min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white"
      data-admin-portal="true"
    >
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              FE
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">Fin-Envision</span>
          </div>
        </div>

        <Link
          to="/"
          target="_blank"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/80 px-2.5 py-1.5 rounded-md"
        >
          <span>Live Site</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </header>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Detailed Premium Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-white border-r border-slate-200/80 z-40 flex flex-col transition-all duration-200 ease-out shadow-[1px_0_12px_rgba(0,0,0,0.02)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Workspace Brand Switcher */}
        <div className="h-18 px-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-xs ring-1 ring-blue-700/20 group-hover:scale-105 transition-transform">
              FE
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-slate-900 tracking-tight leading-tight truncate flex items-center gap-1.5">
                <span>Fin-Envision</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
                <span>CFA® Operations Portal</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
              {section.items
                .filter((item) => !item.superOnly || currentUser?.role === "super_admin")
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? currentPath === item.href
                    : currentPath.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_3px_10px_rgba(37,99,235,0.35)] ring-1 ring-white/20"
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/90 hover:translate-x-0.5"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badgeKey === "leads" && pendingLeads > 0 && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                            isActive
                              ? "bg-white/25 text-white"
                              : "bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs"
                          }`}
                        >
                          {pendingLeads} new
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* Currently live notice (edited under Notice Marquee Ticker) */}
        {liveNotice && (
          <div className="p-3.5 mx-3 mb-2 rounded-xl bg-gradient-to-br from-blue-50/60 via-slate-50 to-indigo-50/40 border border-blue-100/80 text-xs shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                Live notice
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug line-clamp-3">{liveNotice}</p>
          </div>
        )}

        {/* User Card & Logout Trigger */}
        <div className="p-3.5 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ring-1 ring-black/5">
                  {currentUser?.name?.[0] || "M"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || "Manoj Rajgopal"}
                </div>
                <div className="text-[10px] text-slate-500 font-medium capitalize">
                  {currentUser?.role === "super_admin"
                    ? "Charterholder / Super Admin"
                    : "Staff Admin"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 gap-3 items-center justify-between sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="hidden lg:inline text-slate-500 font-semibold">Admin Center</span>
              <ChevronRight className="hidden lg:block w-3.5 h-3.5 text-slate-300" />
              <span className="truncate text-slate-900 font-bold capitalize bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                {currentPath === "/admin"
                  ? "Executive Overview"
                  : currentPath.split("/")[2]?.replace("-", " ") || "Dashboard"}
              </span>
            </div>

            <div
              className={`items-center gap-2 whitespace-nowrap px-3 py-1 rounded-full border text-[11px] font-semibold ${
                saveStatus.state === "error"
                  ? "flex bg-rose-50 border-rose-200 text-rose-700"
                  : saveStatus.state === "saving"
                    ? "flex bg-amber-50 border-amber-200 text-amber-700"
                    : "hidden xl:flex bg-emerald-50/80 border-emerald-200/70 text-emerald-700"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              <span>
                {saveStatus.state === "saving"
                  ? "Saving to database…"
                  : saveStatus.state === "error"
                    ? `Save failed: ${saveStatus.message ?? "unknown error"}`
                    : "Draft saved automatically"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <Link
              to="/admin/leads"
              className="btn-sheen inline-flex items-center gap-1.5 whitespace-nowrap px-3 lg:px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record Lead</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 whitespace-nowrap px-3 lg:px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs hover:shadow-xs"
            >
              <span className="hidden lg:inline">View Live Website</span>
              <span className="lg:hidden">Live Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Content Render Outlet */}
        <main className="flex-1 p-4 md:p-8 max-w-[1440px] w-full mx-auto">
          {loadError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
              <p className="font-bold">Could not load the admin data</p>
              <p className="mt-1 text-xs">{loadError}</p>
              <p className="mt-2 text-xs">
                Check the Supabase env vars and that supabase/migrations/0001_init.sql has been run.
              </p>
            </div>
          ) : !ready || blockedForRole ? (
            <div className="py-24 text-center text-xs font-medium text-slate-500">
              Loading your workspace…
            </div>
          ) : (
            <>
              {legacyAvailable && (
                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    This browser still holds content and leads saved before the database was set up.
                    Import them once to keep your earlier edits.
                  </span>
                  <span className="flex shrink-0 gap-2">
                    <button
                      onClick={handleImportLegacy}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700"
                    >
                      Import to database
                    </button>
                    <button
                      onClick={() => {
                        dismissLegacyLocalStore();
                        setLegacyAvailable(false);
                      }}
                      className="rounded-lg border border-amber-300 px-3 py-1.5 font-semibold hover:bg-amber-100"
                    >
                      Discard
                    </button>
                  </span>
                </div>
              )}
              <PublishBar />
              {/* Remount the page when content is reloaded so no stale local copy survives. */}
              <div key={getContentEpoch()}>{children}</div>
            </>
          )}
        </main>
      </div>

      {/* Save failures must be visible at every screen size */}
      {saveStatus.state === "error" && (
        <div
          role="alert"
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-md rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 shadow-lg md:left-auto md:right-6"
        >
          <span className="font-bold">Changes not saved.</span>{" "}
          {saveStatus.message ?? "Unknown error."}
          {saveStatus.conflict && (
            <button
              onClick={() => window.location.reload()}
              className="ml-2 rounded-md bg-rose-600 px-2 py-0.5 font-bold text-white hover:bg-rose-700"
            >
              Reload
            </button>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Sign Out of Admin Portal?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Your active session will be closed. You will need your administrator credentials to
              sign back in.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
