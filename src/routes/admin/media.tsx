import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  FileText,
  Check,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import {
  deleteMedia,
  formatBytes,
  isImage,
  listMedia,
  updateMediaAlt,
  uploadMedia,
  type MediaAsset,
} from "@/lib/media";

export const Route = createFileRoute("/admin/media")({
  component: AdminMediaPage,
});

type Filter = "all" | "images" | "documents";

export function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      setAssets(await listMedia());
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Could not load the media library."]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleFiles = async (files: FileList | File[] | null) => {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;
    setErrors([]);
    setUploading(list.length);
    const failures: string[] = [];
    for (const file of list) {
      try {
        const asset = await uploadMedia(file);
        setAssets((prev) => [asset, ...prev]);
      } catch (e) {
        failures.push(e instanceof Error ? e.message : `Could not upload ${file.name}.`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    setErrors(failures);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = async (asset: MediaAsset) => {
    await navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (
      !confirm(
        `Delete "${asset.name}"? Pages that still use this file will show a broken image until you replace it.`,
      )
    )
      return;
    try {
      await deleteMedia(asset);
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Could not delete the file."]);
    }
  };

  const handleAlt = async (asset: MediaAsset, altText: string) => {
    if (altText === asset.altText) return;
    try {
      await updateMediaAlt(asset.id, altText);
      setAssets((prev) => prev.map((a) => (a.id === asset.id ? { ...a, altText } : a)));
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Could not save the description."]);
    }
  };

  const visible = assets.filter(
    (a) =>
      (filter === "all" || (filter === "images" ? isImage(a.mimeType) : !isImage(a.mimeType))) &&
      (!query.trim() || a.name.toLowerCase().includes(query.trim().toLowerCase())),
  );
  const count = (f: Filter) =>
    assets.filter(
      (a) => f === "all" || (f === "images" ? isImage(a.mimeType) : !isImage(a.mimeType)),
    ).length;

  return (
    <div
      className="mx-auto max-w-6xl space-y-6"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            Media & Document Library
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Upload logos, photos, banners and brochures, then pick them anywhere on the site. Files
            are served from fast public storage. Drag files anywhere on this page to upload.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf"
            onChange={(e) => void handleFiles(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading > 0}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading > 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading > 0 ? `Uploading ${uploading}…` : "Upload files"}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <p className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4" /> Some files could not be processed
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["all", "images", "documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? "border-blue-600 bg-white text-blue-600 shadow-2xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab} ({count(tab)})
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-1 gap-4 rounded-2xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
          dragging ? "outline-dashed outline-2 outline-offset-4 outline-blue-500" : ""
        }`}
      >
        {loading ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
            {assets.length === 0
              ? "Your library is empty. Upload your first file, or drop it here."
              : "No files match."}
          </div>
        ) : (
          visible.map((asset) => (
            <div
              key={asset.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:border-slate-300"
            >
              <div className="relative flex h-36 items-center justify-center overflow-hidden bg-slate-100">
                {isImage(asset.mimeType) ? (
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-slate-400" />
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between p-3.5 text-xs">
                <div>
                  <h3 className="truncate font-semibold text-slate-900" title={asset.name}>
                    {asset.name}
                  </h3>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {formatBytes(asset.sizeBytes)} ·{" "}
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                  {isImage(asset.mimeType) && (
                    <input
                      type="text"
                      defaultValue={asset.altText}
                      onBlur={(e) => void handleAlt(asset, e.target.value.trim())}
                      placeholder="Image description"
                      aria-label={`Description of ${asset.name}`}
                      className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1 text-[11px] placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <button
                    onClick={() => void handleCopy(asset)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-400" /> Copy URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => void handleDelete(asset)}
                    title="Delete file"
                    aria-label={`Delete ${asset.name}`}
                    className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
