import { useCallback, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Search, Trash2, Upload, X, FileText } from "lucide-react";
import { formatBytes, isImage, listMedia, uploadMedia, type MediaAsset } from "@/lib/media";

/** Modal that lists the media library, lets the admin upload, and returns the chosen file's URL. */
export function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  imagesOnly = true,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  imagesOnly?: boolean;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAssets(await listMedia());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const visible = assets.filter(
    (a) =>
      (!imagesOnly || isImage(a.mimeType)) &&
      (!query.trim() || a.name.toLowerCase().includes(query.trim().toLowerCase())),
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      let last: MediaAsset | null = null;
      for (const file of Array.from(files)) last = await uploadMedia(file);
      await refresh();
      // Uploading a single image from the picker selects it straight away.
      if (files.length === 1 && last && (!imagesOnly || isImage(last.mimeType))) onSelect(last);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div
      className="admin-scope fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Media library"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-bold text-slate-900">Media library</h2>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload"}
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={
                  imagesOnly ? "image/png,image/jpeg,image/webp,image/gif,image/avif" : undefined
                }
                className="hidden"
                disabled={uploading}
                onChange={(e) => void handleFiles(e.target.files)}
              />
            </label>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {error && (
          <div className="mx-3 mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="py-12 text-center text-xs text-slate-400">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="py-12 text-center text-xs text-slate-400">
              {assets.length === 0 ? "No files yet. Upload your first image." : "Nothing matches."}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {visible.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(a)}
                    className="group block w-full overflow-hidden rounded-xl border border-slate-200 text-left hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20"
                  >
                    <div className="grid aspect-square place-items-center bg-slate-50">
                      {isImage(a.mimeType) ? (
                        <img
                          src={a.url}
                          alt={a.altText || a.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div className="p-2">
                      <div className="truncate text-[11px] font-semibold text-slate-800">
                        {a.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{formatBytes(a.sizeBytes)}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** A labelled image setting: thumbnail, URL box, "Choose / upload" and "Remove". */
export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-slate-500">{label}</label>
      <div className="flex items-start gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus className="h-5 w-5 text-slate-300" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.trim())}
            placeholder="https://… or choose from the library"
            aria-label={`${label} URL`}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-mono text-xs"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Choose / upload
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
        </div>
      </div>
      <MediaLibraryModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(asset) => {
          onChange(asset.url);
          setOpen(false);
        }}
      />
    </div>
  );
}
