import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Trash2,
  Copy,
  FileText,
  Clock,
  Filter,
  Check,
  Plus,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  type AdminStoreData,
  type MediaItem,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/media")({
  component: AdminMediaPage,
});

export function AdminMediaPage() {
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => setStore(getAdminStore());
    window.addEventListener("finenvision_store_updated", handleUpdate);
    return () => window.removeEventListener("finenvision_store_updated", handleUpdate);
  }, []);

  const filteredMedia = store.media.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = (id: string) => {
    const updated = store.media.map((m) =>
      m.id === id ? { ...m, status: "approved" as const } : m,
    );
    saveAdminStore({ ...store, media: updated }, { action: "Approved Media Asset", target: id });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this media file?")) {
      const updated = store.media.filter((m) => m.id !== id);
      saveAdminStore({ ...store, media: updated }, { action: "Deleted Media Asset", target: id });
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAsset: MediaItem = {
      id: `m-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type || "application/octet-stream",
      size: `${Math.round(file.size / 1024)} KB`,
      uploadedAt: new Date().toISOString(),
      status: "pending",
    };

    const updated = [newAsset, ...store.media];
    saveAdminStore(
      { ...store, media: updated },
      { action: "Uploaded New Asset", target: file.name },
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Media & Document Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, review, approve, and manage logos, banners, brochures, and student photos.
          </p>
        </div>

        <div>
          <input ref={fileInputRef} type="file" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "approved", "pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
              filter === tab
                ? "bg-white border-blue-600 text-blue-600 shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab} Assets ({store.media.filter((m) => tab === "all" || m.status === tab).length})
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No media files found in this category.
          </div>
        ) : (
          filteredMedia.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col group hover:border-slate-300 transition-all"
            >
              {/* Thumbnail Area */}
              <div className="h-36 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                {asset.type.startsWith("image/") ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-12 h-12 text-slate-400" />
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      asset.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {asset.status === "approved" ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <h3 className="font-semibold text-slate-900 truncate" title={asset.name}>
                    {asset.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {asset.size} · {new Date(asset.uploadedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(asset.id, asset.url)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" /> Copy URL
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {asset.status === "pending" && (
                      <button
                        onClick={() => handleApprove(asset.id)}
                        title="Approve Asset"
                        className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(asset.id)}
                      title="Delete Asset"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
