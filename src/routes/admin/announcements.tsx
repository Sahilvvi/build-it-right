import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, CheckCircle2, Power } from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  type AnnouncementItem,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncementsPage,
});

export function AdminAnnouncementsPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [newText, setNewText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      text: newText.trim(),
      isActive: true,
      priority: store.announcements.length + 1,
    };

    const updated = [newItem, ...store.announcements];
    saveAdminStore(
      { ...store, announcements: updated },
      { action: "Added Marquee Announcement", target: newText.trim() },
    );
    setNewText("");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggle = (id: string) => {
    const updated = store.announcements.map((a) =>
      a.id === id ? { ...a, isActive: !a.isActive } : a,
    );
    saveAdminStore({ ...store, announcements: updated });
  };

  const handleDelete = (id: string, text: string) => {
    if (confirm(`Remove announcement: "${text}"?`)) {
      const updated = store.announcements.filter((a) => a.id !== id);
      saveAdminStore(
        { ...store, announcements: updated },
        { action: "Deleted Marquee Announcement", target: text },
      );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            Marquee Ticker & Notice Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control the live scrolling announcement ticker across the top of the Fin-Envision
            website.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Updated Live Ticker!
          </span>
        )}
      </div>

      {/* Add Announcement Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Add New Announcement Notice
        </h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            required
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="e.g. Free CFA® L1 demo lecture this Saturday at 11:00 AM..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-2xs"
          >
            Add Notice
          </button>
        </form>
      </div>

      {/* Active Notices List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Configured Marquee Notices</span>
          <span className="text-[11px] text-slate-400">
            {store.announcements.filter((a) => a.isActive).length} active notices scrolling
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {store.announcements.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                item.isActive ? "bg-white" : "bg-slate-50/70 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => handleToggle(item.id)}
                  title={item.isActive ? "Click to deactivate" : "Click to activate"}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    item.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-slate-800 font-medium truncate">{item.text}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {item.isActive ? "Live" : "Disabled"}
                </span>

                <button
                  onClick={() => handleDelete(item.id, item.text)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
