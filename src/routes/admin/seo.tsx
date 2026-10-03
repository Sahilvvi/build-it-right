import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Globe,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  type RedirectRule,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/seo")({
  component: AdminSeoPage,
});

export function AdminSeoPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [selectedRoute, setSelectedRoute] = useState<string>("/");
  const [isSaved, setIsSaved] = useState(false);

  // New Redirect Form
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newStatus, setNewStatus] = useState<301 | 302>(301);

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const currentMeta = store.seo[selectedRoute] || {
    title: "Fin-Envision Learning",
    description: "Finance coaching and CFA training",
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminStore(store, { action: "Updated SEO Meta Tags", target: `Route: ${selectedRoute}` });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom.trim() || !newTo.trim()) return;

    const newRule: RedirectRule = {
      id: `r-${Date.now()}`,
      fromPath: newFrom.startsWith("/") ? newFrom.trim() : `/${newFrom.trim()}`,
      toPath: newTo.startsWith("/") ? newTo.trim() : `/${newTo.trim()}`,
      statusCode: newStatus,
      isActive: true,
    };

    const updated = [newRule, ...store.redirects];
    saveAdminStore(
      { ...store, redirects: updated },
      { action: "Added 301 Redirect Rule", target: newRule.fromPath },
    );
    setNewFrom("");
    setNewTo("");
  };

  const handleDeleteRedirect = (id: string, fromPath: string) => {
    if (confirm(`Delete redirect rule for ${fromPath}?`)) {
      const updated = store.redirects.filter((r) => r.id !== id);
      saveAdminStore(
        { ...store, redirects: updated },
        { action: "Removed Redirect Rule", target: fromPath },
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            SEO Meta Tags & URL Redirect Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Optimize search engine meta titles, descriptions, and create 301 redirects to protect
            Google rankings.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> SEO Changes Published!
          </span>
        )}
      </div>

      {/* 2 Tabs: Meta Editor & Redirect Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page SEO Meta Tags Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Page Meta Titles & Descriptions</span>
            <span className="text-[10px] text-blue-600 font-semibold">Google Snippet</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Select Page Route
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="/">Home Page (/)</option>
              <option value="/cfa">CFA® Program Preparation (/cfa)</option>
              <option value="/courses">Course Catalog (/courses)</option>
              <option value="/about">About Us (/about)</option>
              <option value="/resources">Free Resources (/resources)</option>
              <option value="/contact">Contact Us (/contact)</option>
            </select>
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Meta Title Tag (50-60 characters)
              </label>
              <input
                type="text"
                value={currentMeta.title}
                onChange={(e) => {
                  const updatedSeo = {
                    ...store.seo,
                    [selectedRoute]: { ...currentMeta, title: e.target.value },
                  };
                  setStore({ ...store, seo: updatedSeo });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {currentMeta.title.length} characters
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Meta Description (140-160 characters)
              </label>
              <textarea
                rows={3}
                value={currentMeta.description}
                onChange={(e) => {
                  const updatedSeo = {
                    ...store.seo,
                    [selectedRoute]: { ...currentMeta, description: e.target.value },
                  };
                  setStore({ ...store, seo: updatedSeo });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {currentMeta.description.length} characters
              </span>
            </div>

            {/* Google SERP Live Simulation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Google Search Preview
              </span>
              <div className="text-xs text-blue-700 font-medium hover:underline cursor-pointer truncate">
                {currentMeta.title}
              </div>
              <div className="text-[11px] text-emerald-700 truncate">
                https://finenvision.com{selectedRoute}
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-2">
                {currentMeta.description}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-2xs mt-2"
            >
              Save SEO Settings
            </button>
          </form>
        </div>

        {/* 301 URL Redirects Manager */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">301 / 302 URL Redirect Rules</h2>
          <p className="text-xs text-slate-500">
            Automatically forward legacy or changed URLs to prevent 404 errors for visitors and SEO
            bots.
          </p>

          <form onSubmit={handleAddRedirect} className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1">
                  Old URL (From)
                </label>
                <input
                  type="text"
                  required
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  placeholder="/old-cfa-page"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1">
                  New Target (To)
                </label>
                <input
                  type="text"
                  required
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  placeholder="/cfa"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(Number(e.target.value) as 301 | 302)}
                className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white font-medium"
              >
                <option value={301}>301 Permanent</option>
                <option value={302}>302 Temporary</option>
              </select>

              <button
                type="submit"
                className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Add Redirect Rule
              </button>
            </div>
          </form>

          {/* Existing Rules Table */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Active Redirect Rules ({store.redirects.length})
            </span>

            {store.redirects.map((r) => (
              <div
                key={r.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-600">{r.fromPath}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-blue-600 font-semibold">{r.toPath}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {r.statusCode}
                  </span>
                  <button
                    onClick={() => handleDeleteRedirect(r.id, r.fromPath)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
