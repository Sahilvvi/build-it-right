import { supabase } from "./supabase";
import { logActivity } from "./admin-store";

/** Media library: files live in the public Supabase Storage bucket "media"; metadata in `media_assets`. */
export interface MediaAsset {
  id: string;
  path: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  createdAt: string;
  url: string;
}

const BUCKET = "media";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "application/pdf",
];
/** Photos wider than this are downscaled before upload to keep pages fast. */
const MAX_IMAGE_WIDTH = 2400;

export const isImage = (mime: string) => mime.startsWith("image/");

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function requireClient() {
  if (!supabase) throw new Error("Backend is not configured (missing Supabase env vars).");
  return supabase;
}

export function publicUrl(path: string): string {
  return requireClient().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

type AssetRow = {
  id: string;
  path: string;
  name: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  created_at: string;
};

const toAsset = (r: AssetRow): MediaAsset => ({
  id: r.id,
  path: r.path,
  name: r.name,
  mimeType: r.mime_type,
  sizeBytes: Number(r.size_bytes),
  altText: r.alt_text,
  createdAt: r.created_at,
  url: publicUrl(r.path),
});

export async function listMedia(): Promise<MediaAsset[]> {
  const { data, error } = await requireClient()
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AssetRow[]).map(toAsset);
}

/** Validate a file before sending it; returns an error message or null. */
export function validateUpload(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}": only PNG, JPG, WebP, GIF, AVIF images and PDFs are allowed.`;
  }
  if (file.size > MAX_UPLOAD_BYTES * 3) return `"${file.name}" is too large.`;
  return null;
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "file";

/** Downscale very wide photos in the browser (keeps transparency by using WebP). */
async function downscaleIfNeeded(file: File): Promise<File> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type) || typeof createImageBitmap !== "function") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    if (bitmap.width <= MAX_IMAGE_WIDTH) {
      bitmap.close();
      return file;
    }
    const scale = MAX_IMAGE_WIDTH / bitmap.width;
    const canvas = document.createElement("canvas");
    canvas.width = MAX_IMAGE_WIDTH;
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", 0.88));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[a-z0-9]+$/i, ".webp"), { type: "image/webp" });
  } catch {
    return file;
  }
}

export async function uploadMedia(original: File): Promise<MediaAsset> {
  const client = requireClient();
  const problem = validateUpload(original);
  if (problem) throw new Error(problem);

  const file = await downscaleIfNeeded(original);
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`"${original.name}" is ${formatBytes(file.size)}; the limit is 10 MB.`);
  }

  const ext = file.type === "application/pdf" ? "pdf" : (file.type.split("/")[1] ?? "bin");
  const now = new Date();
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${Math.random()
    .toString(36)
    .slice(2, 8)}-${slugify(file.name)}.${ext}`;

  const { error: uploadError } = await client.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await client
    .from("media_assets")
    .insert({ path, name: original.name, mime_type: file.type, size_bytes: file.size })
    .select("*")
    .single();
  if (error) {
    await client.storage.from(BUCKET).remove([path]); // don't leave an orphan behind
    throw new Error(error.message);
  }
  logActivity("Uploaded media", original.name);
  return toAsset(data as AssetRow);
}

export async function updateMediaAlt(id: string, altText: string): Promise<void> {
  const { error } = await requireClient()
    .from("media_assets")
    .update({ alt_text: altText })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMedia(asset: MediaAsset): Promise<void> {
  const client = requireClient();
  const { error: storageError } = await client.storage.from(BUCKET).remove([asset.path]);
  if (storageError) throw new Error(storageError.message);
  const { error } = await client.from("media_assets").delete().eq("id", asset.id);
  if (error) throw new Error(error.message);
  logActivity("Deleted media", asset.name);
}
