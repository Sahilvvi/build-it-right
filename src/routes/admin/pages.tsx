import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  FileEdit,
  Save,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  Award,
  Globe,
  Compass,
  GraduationCap,
  BookOpen,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  RotateCcw,
  Share2,
  Smartphone,
  Video,
  TrendingUp,
  Building2,
  User,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  type FaqItem,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPagesManager,
});

type NavPageKey =
  "visuals" | "global" | "home" | "courses" | "cfa" | "about" | "resources" | "contact" | "faqs";

export function AdminPagesManager() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [activePage, setActivePage] = useState<NavPageKey>("visuals");
  const [isSaved, setIsSaved] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newFaqCategory, setNewFaqCategory] = useState("CFA® Program");

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminStore(store, {
      action: "Updated Page Content",
      target: `Page: ${activePage.toUpperCase()}`,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      category: newFaqCategory,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      isActive: true,
    };

    const updated = [newFaq, ...store.faqs];
    setStore({ ...store, faqs: updated });
    saveAdminStore(
      { ...store, faqs: updated },
      { action: "Added New FAQ", target: newFaq.question },
    );
    setNewFaqQuestion("");
    setNewFaqAnswer("");
  };

  const handleDeleteFaq = (id: string, question: string) => {
    if (confirm(`Delete FAQ: "${question}"?`)) {
      const updated = store.faqs.filter((f) => f.id !== id);
      setStore({ ...store, faqs: updated });
      saveAdminStore({ ...store, faqs: updated }, { action: "Deleted FAQ", target: question });
    }
  };

  const navPages = [
    {
      id: "visuals",
      label: "Visuals & Images",
      badge: "Images",
      sections: "Brand Logo, App Icon, Manoj Sir Photo",
    },
    {
      id: "global",
      label: "Header & Footer",
      badge: "Site-wide",
      sections: "Contacts, Address, Copyright, Socials",
    },
    {
      id: "home",
      label: "Home Page (/)",
      badge: "Homepage",
      sections: "Hero, Why Us, Founder, Demo, App, CTA",
    },
    {
      id: "courses",
      label: "Courses (/courses)",
      badge: "Curriculum",
      sections: "Hero, Notes, Audience, Retakers",
    },
    {
      id: "cfa",
      label: "CFA® Prep (/cfa)",
      badge: "CFA®",
      sections: "Hero, Level I, II & III Specs & Fees",
    },
    {
      id: "about",
      label: "About Us (/about)",
      badge: "Story",
      sections: "Who We Are, Mission, Values, Manoj Sir",
    },
    {
      id: "resources",
      label: "Resources (/resources)",
      badge: "Videos",
      sections: "Hero Blurb, 6 Category Playlists",
    },
    {
      id: "contact",
      label: "Contact Us (/contact)",
      badge: "Classroom",
      sections: "Thane Classroom, Hours, Phone, Email",
    },
    {
      id: "faqs",
      label: "FAQ Library",
      badge: "Live FAQs",
      sections: "Global Questions & Answers",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Website Pages, Visuals & Section-by-Section CMS
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              WordPress-Grade
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit every single image, headline, paragraph, card, and section across the whole website
            in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Published Live!
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {navPages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => setActivePage(page.id as NavPageKey)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activePage === page.id
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="text-[11px] font-bold truncate">{page.badge}</div>
            <div
              className={`text-[9px] truncate mt-0.5 ${
                activePage === page.id ? "text-blue-100 font-medium" : "text-slate-400"
              }`}
            >
              {page.id.toUpperCase()}
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Content Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ────────────────── 0. VISUALS & IMAGES ────────────────── */}
        {activePage === "visuals" && (
          <div className="space-y-6">
            {/* Brand Logo Editor */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">Brand Logo Image</h2>
                </div>
                <span className="text-[10px] text-slate-400">Header & Footer Global</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-center min-h-[110px] border border-slate-800">
                  <img
                    src={store.visuals?.logoUrl || "/finenvision-logo-light.png"}
                    alt="Logo Preview"
                    className="max-h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/finenvision-logo-light.png";
                    }}
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Logo Image URL / Local Asset Path
                    </label>
                    <input
                      type="text"
                      value={store.visuals?.logoUrl || ""}
                      onChange={(e) =>
                        setStore({
                          ...store,
                          visuals: { ...store.visuals, logoUrl: e.target.value },
                        })
                      }
                      placeholder="/finenvision-logo-light.png or https://example.com/logo.png"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        setStore({
                          ...store,
                          visuals: { ...store.visuals, logoUrl: "/finenvision-logo-light.png" },
                        })
                      }
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
                    >
                      Default Light Logo
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStore({
                          ...store,
                          visuals: { ...store.visuals, logoUrl: "/finenvision-logo.png" },
                        })
                      }
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
                    >
                      Standard Dark Logo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* App & Favicon Icon */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-900">App Favicon & Square Icon</h2>
                </div>
                <span className="text-[10px] text-slate-400">Browser Tab & App Badge</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="p-4 bg-slate-100 rounded-xl flex items-center justify-center min-h-[110px] border border-slate-200">
                  <img
                    src={store.visuals?.iconUrl || "/finenvision-icon.png"}
                    alt="Icon Preview"
                    className="w-16 h-16 object-contain rounded-xl shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/finenvision-icon.png";
                    }}
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Favicon / App Icon URL
                    </label>
                    <input
                      type="text"
                      value={store.visuals?.iconUrl || ""}
                      onChange={(e) =>
                        setStore({
                          ...store,
                          visuals: { ...store.visuals, iconUrl: e.target.value },
                        })
                      }
                      placeholder="/finenvision-icon.png or https://example.com/icon.png"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setStore({
                        ...store,
                        visuals: { ...store.visuals, iconUrl: "/finenvision-icon.png" },
                      })
                    }
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-[11px] font-medium"
                  >
                    Reset to Default App Icon
                  </button>
                </div>
              </div>
            </div>

            {/* Manoj Sir Founder Portrait Photo */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Lead Faculty Portrait (Manoj Sir Photo)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">Featured across Home & About</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="p-2 bg-slate-900 rounded-2xl flex items-center justify-center min-h-[140px] border border-slate-800">
                  <img
                    src={store.visuals?.founderPhotoUrl || "/manoj-rajgopal.jpg"}
                    alt="Manoj Sir Preview"
                    className="h-28 w-24 object-cover object-top rounded-xl shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/manoj-rajgopal.jpg";
                    }}
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portrait Photo URL / Image Path
                    </label>
                    <input
                      type="text"
                      value={store.visuals?.founderPhotoUrl || ""}
                      onChange={(e) =>
                        setStore({
                          ...store,
                          visuals: { ...store.visuals, founderPhotoUrl: e.target.value },
                          homeContent: {
                            ...store.homeContent,
                            founderSpotlight: {
                              ...store.homeContent.founderSpotlight,
                              founderPhoto: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="/manoj-rajgopal.jpg or https://example.com/manoj-sir.jpg"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setStore({
                        ...store,
                        visuals: { ...store.visuals, founderPhotoUrl: "/manoj-rajgopal.jpg" },
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            founderPhoto: "/manoj-rajgopal.jpg",
                          },
                        },
                      })
                    }
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-[11px] font-medium"
                  >
                    Reset to Default Manoj Sir Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────── 0.5 GLOBAL HEADER & FOOTER ────────────────── */}
        {activePage === "global" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Institute Identity & Contacts</h2>
                <span className="text-[10px] text-slate-400">Header & Footer Global</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={store.identity.name}
                    onChange={(e) =>
                      setStore({ ...store, identity: { ...store.identity, name: e.target.value } })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={store.identity.tagline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        identity: { ...store.identity, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hotline / Phone
                  </label>
                  <input
                    type="text"
                    value={store.identity.phone}
                    onChange={(e) =>
                      setStore({ ...store, identity: { ...store.identity, phone: e.target.value } })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={store.identity.email}
                    onChange={(e) =>
                      setStore({ ...store, identity: { ...store.identity, email: e.target.value } })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={store.identity.whatsapp}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        identity: { ...store.identity, whatsapp: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Classroom Address
                  </label>
                  <input
                    type="text"
                    value={store.identity.address}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        identity: { ...store.identity, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Footer Description Blurb
                </label>
                <textarea
                  rows={2}
                  value={store.identity.footerBlurb}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      identity: { ...store.identity, footerBlurb: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Footer Copyright Notice
                </label>
                <input
                  type="text"
                  value={store.identity.footerCopyright}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      identity: { ...store.identity, footerCopyright: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono text-slate-700"
                />
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-[11px] text-blue-900">
                Social links, header menu, login button, footer columns and legal links now live in{" "}
                <a href="/admin/navigation" className="font-bold underline">
                  Header &amp; Footer Menus
                </a>
                .
              </div>
            </div>
          </div>
        )}

        {/* ────────────────── 1. HOME PAGE ────────────────── */}
        {activePage === "home" && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">Hero Section</h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 1</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Top Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.heroBadge}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, heroBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.heroHeadline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, heroHeadline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sub-headline / Hero Paragraph
                </label>
                <textarea
                  rows={3}
                  value={store.homeContent.heroSubheadline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      homeContent: { ...store.homeContent, heroSubheadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.ctaPrimaryText}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, ctaPrimaryText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.ctaSecondaryText}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, ctaSecondaryText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Credibility Stats Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h2 className="text-sm font-bold text-slate-900">Key Statistics Bar</h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {store.homeContent.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                  >
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...store.homeContent.stats];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, stats: updated },
                        });
                      }}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-black text-slate-900"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...store.homeContent.stats];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, stats: updated },
                        });
                      }}
                      className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white font-medium text-slate-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why Us (3 Pillars) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Why Us (The 3 Core Academic Pillars)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 3</span>
              </div>

              <div className="space-y-4">
                {store.homeContent.whyUs.map((pillar, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50"
                  >
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const updated = [...store.homeContent.whyUs];
                        updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, whyUs: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold text-slate-900"
                    />
                    <textarea
                      rows={2}
                      value={pillar.body}
                      onChange={(e) => {
                        const updated = [...store.homeContent.whyUs];
                        updated[pIdx] = { ...updated[pIdx], body: e.target.value };
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, whyUs: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Career Stages Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h2 className="text-sm font-bold text-slate-900">Career Stages Section</h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {store.homeContent.careerStages.map((stage, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={stage.title}
                        onChange={(e) => {
                          const updated = [...store.homeContent.careerStages];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          setStore({
                            ...store,
                            homeContent: { ...store.homeContent, careerStages: updated },
                          });
                        }}
                        className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded bg-white font-bold"
                      />
                      <input
                        type="text"
                        value={stage.badge}
                        onChange={(e) => {
                          const updated = [...store.homeContent.careerStages];
                          updated[sIdx] = { ...updated[sIdx], badge: e.target.value };
                          setStore({
                            ...store,
                            homeContent: { ...store.homeContent, careerStages: updated },
                          });
                        }}
                        className="w-36 px-2.5 py-1 text-[11px] border border-slate-300 rounded bg-white font-semibold text-blue-700"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={stage.desc}
                      onChange={(e) => {
                        const updated = [...store.homeContent.careerStages];
                        updated[sIdx] = { ...updated[sIdx], desc: e.target.value };
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, careerStages: updated },
                        });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why Us 10 Key Highlight Features */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Why Us — 10 Key Academic Highlights
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 5</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={store.homeContent.whyUsBadge}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, whyUsBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.whyUsHeadline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, whyUsHeadline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Summary Card Title
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.whyUsCardTitle}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, whyUsCardTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Summary Card Description
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.whyUsCardDesc}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: { ...store.homeContent, whyUsCardDesc: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  The 10 Key Highlight Features (Displayed on Homepage)
                </label>
                {store.homeContent.whyUsFeatures.map((feat, fIdx) => (
                  <div key={fIdx} className="flex gap-2">
                    <span className="w-6 text-xs font-bold text-slate-400 pt-1.5">{fIdx + 1}.</span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...store.homeContent.whyUsFeatures];
                        updated[fIdx] = e.target.value;
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, whyUsFeatures: updated },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = store.homeContent.whyUsFeatures.filter(
                          (_, i) => i !== fIdx,
                        );
                        setStore({
                          ...store,
                          homeContent: { ...store.homeContent, whyUsFeatures: updated },
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setStore({
                      ...store,
                      homeContent: {
                        ...store.homeContent,
                        whyUsFeatures: [
                          ...store.homeContent.whyUsFeatures,
                          "New Feature Highlight",
                        ],
                      },
                    })
                  }
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Highlight Feature
                </button>
              </div>
            </div>

            {/* Founder Spotlight Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Founder Spotlight (Manoj Rajgopal, CFA)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 6</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.eyebrow}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            eyebrow: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.headline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            headline: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.founderName}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            founderName: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Founder Title
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.founderTitle}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            founderTitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience Years Stat
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.experienceYears}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            experienceYears: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Students Trained Stat
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.studentsTrained}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            studentsTrained: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attempt Focus Badge / Tagline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.founderSpotlight.attemptFocus}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            attemptFocus: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Credentials tags */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Academic Credentials Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {store.homeContent.founderSpotlight.credentials.map((cred, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <input
                        type="text"
                        value={cred}
                        onChange={(e) => {
                          const updated = [...store.homeContent.founderSpotlight.credentials];
                          updated[cIdx] = e.target.value;
                          setStore({
                            ...store,
                            homeContent: {
                              ...store.homeContent,
                              founderSpotlight: {
                                ...store.homeContent.founderSpotlight,
                                credentials: updated,
                              },
                            },
                          });
                        }}
                        className="text-xs bg-transparent border-none focus:outline-hidden font-medium text-slate-800 w-32"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = store.homeContent.founderSpotlight.credentials.filter(
                            (_, i) => i !== cIdx,
                          );
                          setStore({
                            ...store,
                            homeContent: {
                              ...store.homeContent,
                              founderSpotlight: {
                                ...store.homeContent.founderSpotlight,
                                credentials: updated,
                              },
                            },
                          });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          founderSpotlight: {
                            ...store.homeContent.founderSpotlight,
                            credentials: [
                              ...store.homeContent.founderSpotlight.credentials,
                              "New Credential",
                            ],
                          },
                        },
                      })
                    }
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 px-2 py-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Credential
                  </button>
                </div>
              </div>

              {/* Journey Bullets */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Manoj Sir's Journey Highlights
                </label>
                {store.homeContent.founderSpotlight.journey.map((item, jIdx) => (
                  <div key={jIdx} className="flex gap-2">
                    <span className="w-5 text-xs font-bold text-slate-400 pt-1.5">{jIdx + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...store.homeContent.founderSpotlight.journey];
                        updated[jIdx] = e.target.value;
                        setStore({
                          ...store,
                          homeContent: {
                            ...store.homeContent,
                            founderSpotlight: {
                              ...store.homeContent.founderSpotlight,
                              journey: updated,
                            },
                          },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = store.homeContent.founderSpotlight.journey.filter(
                          (_, i) => i !== jIdx,
                        );
                        setStore({
                          ...store,
                          homeContent: {
                            ...store.homeContent,
                            founderSpotlight: {
                              ...store.homeContent.founderSpotlight,
                              journey: updated,
                            },
                          },
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setStore({
                      ...store,
                      homeContent: {
                        ...store.homeContent,
                        founderSpotlight: {
                          ...store.homeContent.founderSpotlight,
                          journey: [
                            ...store.homeContent.founderSpotlight.journey,
                            "New Career & Mentorship Milestone",
                          ],
                        },
                      },
                    })
                  }
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
              </div>
            </div>

            {/* Demo Videos Showcase */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <h2 className="text-sm font-bold text-slate-900">Demo Videos Library Header</h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={store.homeContent.demoVideos.eyebrow}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          demoVideos: { ...store.homeContent.demoVideos, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.demoVideos.headline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          demoVideos: { ...store.homeContent.demoVideos, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subheadline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.demoVideos.subheadline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          demoVideos: {
                            ...store.homeContent.demoVideos,
                            subheadline: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.demoVideos.channelUrl}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          demoVideos: {
                            ...store.homeContent.demoVideos,
                            channelUrl: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Placement Analytics Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Placement & Student Analytics
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 8</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={store.homeContent.placementSection.badge}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          placementSection: {
                            ...store.homeContent.placementSection,
                            badge: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.placementSection.headline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          placementSection: {
                            ...store.homeContent.placementSection,
                            headline: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subheadline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.placementSection.subheadline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          placementSection: {
                            ...store.homeContent.placementSection,
                            subheadline: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Students Count
                  </label>
                  <input
                    type="number"
                    value={store.homeContent.placementSection.studentsCount}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          placementSection: {
                            ...store.homeContent.placementSection,
                            studentsCount: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pass Rate Min (%)
                  </label>
                  <input
                    type="number"
                    value={store.homeContent.placementSection.successRateMin}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          placementSection: {
                            ...store.homeContent.placementSection,
                            successRateMin: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pass Rate Max (%)
                  </label>
                  <input
                    type="number"
                    value={store.homeContent.placementSection.successRateMax}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          placementSection: {
                            ...store.homeContent.placementSection,
                            successRateMax: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Mobile App Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-600" />
                  <h2 className="text-sm font-bold text-slate-900">Download Mobile App Section</h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 9</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.badge}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: { ...store.homeContent.appSection, badge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.headline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: { ...store.homeContent.appSection, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subheadline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.subheadline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: {
                            ...store.homeContent.appSection,
                            subheadline: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institute Org Code
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.orgCode}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: { ...store.homeContent.appSection, orgCode: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold font-mono text-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Android Play Store Link
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.androidUrl}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: {
                            ...store.homeContent.appSection,
                            androidUrl: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    iOS App Store Link
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.iosUrl}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: { ...store.homeContent.appSection, iosUrl: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating & Reviews Callout
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.appSection.ratingText}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          appSection: {
                            ...store.homeContent.appSection,
                            ratingText: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Corporate Employers Marquee Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  <h2 className="text-sm font-bold text-slate-900">Alumni Employers Marquee</h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 10</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marquee Headline
                </label>
                <input
                  type="text"
                  value={store.homeContent.companiesSection.headline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      homeContent: {
                        ...store.homeContent,
                        companiesSection: { headline: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Final Call to Action Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-900" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Final Call-to-Action (Page Footer CTA)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400">Section 11</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={store.homeContent.finalCta.eyebrow}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          finalCta: { ...store.homeContent.finalCta, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.finalCta.headline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          finalCta: { ...store.homeContent.finalCta, headline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={store.homeContent.finalCta.subheadline}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          finalCta: { ...store.homeContent.finalCta, subheadline: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.finalCta.primaryButtonText}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          finalCta: {
                            ...store.homeContent.finalCta,
                            primaryButtonText: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={store.homeContent.finalCta.secondaryButtonText}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        homeContent: {
                          ...store.homeContent,
                          finalCta: {
                            ...store.homeContent.finalCta,
                            secondaryButtonText: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────── 2. COURSES PAGE ────────────────── */}
        {activePage === "courses" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Courses Page Hero & Social Proof
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={store.coursesPageContent.heroHeadline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      coursesPageContent: {
                        ...store.coursesPageContent,
                        heroHeadline: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={store.coursesPageContent.heroSubheadline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      coursesPageContent: {
                        ...store.coursesPageContent,
                        heroSubheadline: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Reviews Rating Callout
                </label>
                <input
                  type="text"
                  value={store.coursesPageContent.ratingText}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      coursesPageContent: {
                        ...store.coursesPageContent,
                        ratingText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Who It's For Checklist */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                "Who This Is For" Audience Checklist
              </h2>
              <div className="space-y-2">
                {store.coursesPageContent.whoItsFor.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="w-6 text-xs font-bold text-slate-400 pt-1.5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...store.coursesPageContent.whoItsFor];
                        updated[idx] = e.target.value;
                        setStore({
                          ...store,
                          coursesPageContent: { ...store.coursesPageContent, whoItsFor: updated },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Retakers Booster Pack */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Retakers Booster Pack Banner
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Retakers Headline
                </label>
                <input
                  type="text"
                  value={store.coursesPageContent.retakersHeadline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      coursesPageContent: {
                        ...store.coursesPageContent,
                        retakersHeadline: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Retakers Description
                </label>
                <textarea
                  rows={2}
                  value={store.coursesPageContent.retakersBody}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      coursesPageContent: {
                        ...store.coursesPageContent,
                        retakersBody: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Fee Waiver Note
                </label>
                <input
                  type="text"
                  value={store.coursesPageContent.retakersFee}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      coursesPageContent: {
                        ...store.coursesPageContent,
                        retakersFee: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-emerald-700 font-semibold"
                />
              </div>
            </div>

            {/* Important Notes Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>"Important Note" Guidance Points</span>
                <span className="text-[10px] text-slate-400">Highlighted Callout Box</span>
              </h2>
              <div className="space-y-2">
                {(store.coursesPageContent.importantNotes || []).map((note, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="w-6 text-xs font-bold text-slate-400 pt-1.5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => {
                        const updated = [...(store.coursesPageContent.importantNotes || [])];
                        updated[idx] = e.target.value;
                        setStore({
                          ...store,
                          coursesPageContent: {
                            ...store.coursesPageContent,
                            importantNotes: updated,
                          },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (store.coursesPageContent.importantNotes || []).filter(
                          (_, i) => i !== idx,
                        );
                        setStore({
                          ...store,
                          coursesPageContent: {
                            ...store.coursesPageContent,
                            importantNotes: updated,
                          },
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setStore({
                    ...store,
                    coursesPageContent: {
                      ...store.coursesPageContent,
                      importantNotes: [
                        ...(store.coursesPageContent.importantNotes || []),
                        "New essential CFA® candidate instruction or note",
                      ],
                    },
                  })
                }
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Note
              </button>
            </div>
          </div>
        )}

        {/* ────────────────── 3. CFA PROGRAM PAGE ────────────────── */}
        {activePage === "cfa" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                CFA® Prep Page Hero
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={store.cfaPageContent.heroHeadline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      cfaPageContent: { ...store.cfaPageContent, heroHeadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={store.cfaPageContent.heroSubheadline}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      cfaPageContent: { ...store.cfaPageContent, heroSubheadline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* Level 1, 2, 3 Tabs in CFA */}
            {(["L1", "L2", "L3"] as const).map((lvl) => {
              const data = store.cfaPageContent.levels[lvl];
              return (
                <div
                  key={lvl}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">
                      CFA® {data.badge} Program Configuration
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {lvl}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={data.tagline}
                        onChange={(e) => {
                          const updatedLevels = { ...store.cfaPageContent.levels };
                          updatedLevels[lvl].tagline = e.target.value;
                          setStore({
                            ...store,
                            cfaPageContent: { ...store.cfaPageContent, levels: updatedLevels },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Duration Spec
                      </label>
                      <input
                        type="text"
                        value={data.duration}
                        onChange={(e) => {
                          const updatedLevels = { ...store.cfaPageContent.levels };
                          updatedLevels[lvl].duration = e.target.value;
                          setStore({
                            ...store,
                            cfaPageContent: { ...store.cfaPageContent, levels: updatedLevels },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Level Description
                    </label>
                    <textarea
                      rows={2}
                      value={data.description}
                      onChange={(e) => {
                        const updatedLevels = { ...store.cfaPageContent.levels };
                        updatedLevels[lvl].description = e.target.value;
                        setStore({
                          ...store,
                          cfaPageContent: { ...store.cfaPageContent, levels: updatedLevels },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Classroom Offline Fee
                      </label>
                      <input
                        type="text"
                        value={data.pricingOffline}
                        onChange={(e) => {
                          const updatedLevels = { ...store.cfaPageContent.levels };
                          updatedLevels[lvl].pricingOffline = e.target.value;
                          setStore({
                            ...store,
                            cfaPageContent: { ...store.cfaPageContent, levels: updatedLevels },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Online Pre-recorded Fee
                      </label>
                      <input
                        type="text"
                        value={data.pricingOnline}
                        onChange={(e) => {
                          const updatedLevels = { ...store.cfaPageContent.levels };
                          updatedLevels[lvl].pricingOnline = e.target.value;
                          setStore({
                            ...store,
                            cfaPageContent: { ...store.cfaPageContent, levels: updatedLevels },
                          });
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ────────────────── 4. ABOUT US PAGE ────────────────── */}
        {activePage === "about" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Who We Are Content
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={store.aboutContent.whoWeAreHeading}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      aboutContent: { ...store.aboutContent, whoWeAreHeading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={store.aboutContent.whoWeAre[0] || ""}
                  onChange={(e) => {
                    const updated = [...store.aboutContent.whoWeAre];
                    updated[0] = e.target.value;
                    setStore({
                      ...store,
                      aboutContent: { ...store.aboutContent, whoWeAre: updated },
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={store.aboutContent.whoWeAre[1] || ""}
                  onChange={(e) => {
                    const updated = [...store.aboutContent.whoWeAre];
                    updated[1] = e.target.value;
                    setStore({
                      ...store,
                      aboutContent: { ...store.aboutContent, whoWeAre: updated },
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>
            </div>

            {/* Manoj Sir Founder Credentials */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Lead Faculty Credentials (Manoj Rajgopal, CFA)
              </h2>

              <div className="space-y-2">
                {store.aboutContent.founderBullets.map((b, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="w-5 text-xs font-bold text-slate-400 pt-1.5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const updated = [...store.aboutContent.founderBullets];
                        updated[idx] = e.target.value;
                        setStore({
                          ...store,
                          aboutContent: { ...store.aboutContent, founderBullets: updated },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = store.aboutContent.founderBullets.filter(
                          (_, i) => i !== idx,
                        );
                        setStore({
                          ...store,
                          aboutContent: { ...store.aboutContent, founderBullets: updated },
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStore({
                    ...store,
                    aboutContent: {
                      ...store.aboutContent,
                      founderBullets: [
                        ...store.aboutContent.founderBullets,
                        "New credential highlight",
                      ],
                    },
                  });
                }}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Faculty Highlight
              </button>
            </div>

            {/* Mission, Vision & Core Values */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Mission, Vision & Core Values
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={store.aboutContent.mission || ""}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      aboutContent: { ...store.aboutContent, mission: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={2}
                  value={store.aboutContent.vision || ""}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      aboutContent: { ...store.aboutContent, vision: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-800">
                  Institutional Core Values
                </label>
                {(store.aboutContent.values || []).map((val, vIdx) => (
                  <div key={vIdx} className="flex gap-2">
                    <span className="w-5 text-xs font-bold text-slate-400 pt-1.5">{vIdx + 1}.</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const updated = [...(store.aboutContent.values || [])];
                        updated[vIdx] = e.target.value;
                        setStore({
                          ...store,
                          aboutContent: { ...store.aboutContent, values: updated },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (store.aboutContent.values || []).filter(
                          (_, i) => i !== vIdx,
                        );
                        setStore({
                          ...store,
                          aboutContent: { ...store.aboutContent, values: updated },
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setStore({
                      ...store,
                      aboutContent: {
                        ...store.aboutContent,
                        values: [...(store.aboutContent.values || []), "New Core Value"],
                      },
                    })
                  }
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Core Value
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────── 5. RESOURCES PAGE ────────────────── */}
        {activePage === "resources" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Free Resources Page & Video Playlists
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={store.resourcesContent.heroHeading}
                onChange={(e) =>
                  setStore({
                    ...store,
                    resourcesContent: { ...store.resourcesContent, heroHeading: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Access Blurb
              </label>
              <textarea
                rows={2}
                value={store.resourcesContent.heroBlurb}
                onChange={(e) =>
                  setStore({
                    ...store,
                    resourcesContent: { ...store.resourcesContent, heroBlurb: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            {/* 6 Category Playlists */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Video Playlists by Category
              </h3>
              {store.resourcesContent.playlists.map((cat, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 border border-slate-200 rounded-xl space-y-2.5 bg-slate-50/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{cat.category}</span>
                    <span className="text-[10px] text-slate-400">
                      {cat.playlists.length} playlists
                    </span>
                  </div>
                  {cat.playlists.map((pl, pIdx) => (
                    <input
                      key={pIdx}
                      type="text"
                      value={pl}
                      onChange={(e) => {
                        const updated = [...store.resourcesContent.playlists];
                        updated[cIdx].playlists[pIdx] = e.target.value;
                        setStore({
                          ...store,
                          resourcesContent: { ...store.resourcesContent, playlists: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── 6. CONTACT US PAGE ────────────────── */}
        {activePage === "contact" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Classroom Location & Consultation Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={store.contactPageContent.email}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      contactPageContent: { ...store.contactPageContent, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={store.contactPageContent.phone}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      contactPageContent: { ...store.contactPageContent, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Center Working Hours
                </label>
                <input
                  type="text"
                  value={store.contactPageContent.officeHours}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      contactPageContent: {
                        ...store.contactPageContent,
                        officeHours: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  In-Person Counseling Title
                </label>
                <input
                  type="text"
                  value={store.contactPageContent.consultationTitle}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      contactPageContent: {
                        ...store.contactPageContent,
                        consultationTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thane Classroom Address
                </label>
                <input
                  type="text"
                  value={store.contactPageContent.address}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      contactPageContent: { ...store.contactPageContent, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* ────────────────── 7. FAQ LIBRARY ────────────────── */}
        {activePage === "faqs" && (
          <div className="space-y-6">
            {/* Add New FAQ Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Add New Question & Answer</span>
                <span className="text-[10px] text-blue-600 font-bold">
                  Appears on Home, CFA & Courses
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="e.g. Can I attend CFA Level 1 demo lectures before paying fees?"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="CFA® Program">CFA® Program</option>
                    <option value="Financial Modeling">Financial Modeling</option>
                    <option value="Classroom & Batches">Classroom & Batches</option>
                    <option value="General Inquiries">General Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Answer
                </label>
                <textarea
                  rows={2}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Detailed answer provided by Manoj Sir..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-2xs"
              >
                Add to Website FAQs
              </button>
            </div>

            {/* Existing FAQs */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Configured FAQs ({store.faqs.length})
                </span>
                <span className="text-[10px] text-slate-400">Editable in real-time</span>
              </div>

              <div className="divide-y divide-slate-100">
                {store.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 hover:bg-slate-50/60 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                          {faq.category}
                        </span>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = store.faqs.map((f) =>
                              f.id === faq.id ? { ...f, question: e.target.value } : f,
                            );
                            setStore({ ...store, faqs: updated });
                          }}
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded font-bold text-slate-900 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id, faq.question)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded mt-5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = store.faqs.map((f) =>
                          f.id === faq.id ? { ...f, answer: e.target.value } : f,
                        );
                        setStore({ ...store, faqs: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-700 leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Publish All Section Edits Live</span>
          </button>
        </div>
      </form>
    </div>
  );
}
