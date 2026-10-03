import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, Save, CheckCircle2, Code, ShieldAlert, Zap } from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  type TrackingSettings,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/tracking")({
  component: AdminTrackingPage,
});

export function AdminTrackingPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminStore(store, {
      action: "Updated Tracking & Analytics Tags",
      target: "GA4 / GTM / Meta Pixel",
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Marketing Analytics & Pixel Tag Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Install and manage Google Tag Manager, GA4, Search Console, and Meta Pixel without code
            edits.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Tracking Scripts Active!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Analytics IDs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            One-Click Tracking Tag Integrations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Google Analytics 4 (GA4 Measurement ID)
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={store.tracking.ga4Id}
                onChange={(e) =>
                  setStore({
                    ...store,
                    tracking: { ...store.tracking, ga4Id: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Tracks page views, course clicks, and lead conversion rates.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Google Tag Manager (GTM Container ID)
              </label>
              <input
                type="text"
                placeholder="GTM-XXXXXXX"
                value={store.tracking.gtmId}
                onChange={(e) =>
                  setStore({
                    ...store,
                    tracking: { ...store.tracking, gtmId: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Primary container for triggering custom tag events.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Meta Pixel ID (Facebook / Instagram Ads)
              </label>
              <input
                type="text"
                placeholder="e.g. 987654321012345"
                value={store.tracking.metaPixelId}
                onChange={(e) =>
                  setStore({
                    ...store,
                    tracking: { ...store.tracking, metaPixelId: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Tracks conversion funnels from Instagram & Facebook campaigns.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Google Search Console (HTML Verification Code)
              </label>
              <input
                type="text"
                placeholder="google-site-verification=SAMPLE_TOKEN"
                value={store.tracking.searchConsoleToken}
                onChange={(e) =>
                  setStore({
                    ...store,
                    tracking: { ...store.tracking, searchConsoleToken: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Meta verification token to register domain ownership.
              </span>
            </div>
          </div>
        </div>

        {/* Custom Header / Body Scripts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-600" />
            Custom Script Injection (No Code Changes Required)
          </h2>
          <p className="text-slate-500 text-xs">
            Approved tracking scripts, chat widgets, or conversion pixels injected directly into the
            HTML document.
          </p>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Header Code (Injected into &lt;head&gt;)
            </label>
            <textarea
              rows={4}
              placeholder="<!-- Paste your custom tracking scripts here -->"
              value={store.tracking.customHeadScript}
              onChange={(e) =>
                setStore({
                  ...store,
                  tracking: { ...store.tracking, customHeadScript: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Body Code (Injected before &lt;/body&gt;)
            </label>
            <textarea
              rows={4}
              placeholder="<!-- Paste your custom body or chat widgets here -->"
              value={store.tracking.customBodyScript}
              onChange={(e) =>
                setStore({
                  ...store,
                  tracking: { ...store.tracking, customBodyScript: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] bg-slate-50/50"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save & Deploy Tracking Scripts
          </button>
        </div>
      </form>
    </div>
  );
}
