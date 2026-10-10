import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FilePlus2,
  FileText,
  Copy,
  Trash2,
  Pencil,
  Eye,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Save,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  useAdminStore,
  type CustomPage,
  type RedirectRule,
} from "@/lib/admin-store";
import { AUTO_REDIRECT_PREFIX, checkCustomPageSlug, slugify } from "@/lib/pages";
import {
  BLOCK_LABELS,
  REVIEW_NOTE_MARKER,
  TEMPLATES,
  cloneBlock,
  newBlock,
  newCustomPage,
  uid,
  type BlockType,
  type TemplateKey,
} from "@/lib/page-blocks";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ImageField } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/admin/custom-pages")({
  component: AdminCustomPagesPage,
});

const inputCls =
  "w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600";
const cardCls = "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4";
const iconBtn =
  "p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent";

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function AdminCustomPagesPage() {
  const store = useAdminStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const editing = store.customPages.find((p) => p.id === editingId) ?? null;

  const handleDelete = (page: CustomPage) => {
    if (
      !confirm(
        `Delete "${page.title}"? Visitors will get a 404 for /${page.slug} once you publish.`,
      )
    )
      return;
    saveAdminStore(
      { ...getAdminStore(), customPages: store.customPages.filter((p) => p.id !== page.id) },
      { action: "Deleted page", target: page.title },
    );
  };

  const handleDuplicate = (page: CustomPage) => {
    let slug = `${page.slug}-copy`;
    for (let n = 2; store.customPages.some((p) => p.slug === slug); n++)
      slug = `${page.slug}-copy-${n}`;
    const now = new Date().toISOString();
    const copy: CustomPage = {
      ...JSON.parse(JSON.stringify(page)),
      id: uid("page"),
      title: `${page.title} (copy)`,
      slug,
      status: "hidden",
      blocks: page.blocks.map(cloneBlock),
      createdAt: now,
      updatedAt: now,
    };
    saveAdminStore(
      { ...getAdminStore(), customPages: [...store.customPages, copy] },
      { action: "Duplicated page", target: page.title },
    );
    setEditingId(copy.id);
  };

  if (editing) {
    return <PageEditor key={editing.id} page={editing} onClose={() => setEditingId(null)} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Pages You Create
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Build extra pages (Privacy Policy, Terms, a campaign landing page…) from simple content
            blocks and give each its own web address. The six main pages are edited under Website
            Pages CMS; their addresses under SEO.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <FilePlus2 className="h-3.5 w-3.5" /> New page
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        {store.customPages.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No pages yet. Click <strong>New page</strong>. The Privacy, Terms and Cookie starters
            are a quick way to fill the footer links.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {store.customPages.map((page) => (
              <li key={page.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {page.title}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                        page.status === "published"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-500"
                      }`}
                    >
                      {page.status === "published" ? "Published" : "Hidden"}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-400">/{page.slug}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/${page.slug}` as never}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Link>
                  <button
                    onClick={() => setEditingId(page.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    className={iconBtn}
                    title="Duplicate"
                    onClick={() => handleDuplicate(page)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className={`${iconBtn} hover:!text-rose-600`}
                    title="Delete"
                    onClick={() => handleDelete(page)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {creating && (
        <NewPageDialog
          onClose={() => setCreating(false)}
          onCreated={(id) => {
            setCreating(false);
            setEditingId(id);
          }}
        />
      )}
    </div>
  );
}

function NewPageDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const store = useAdminStore();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [template, setTemplate] = useState<TemplateKey>("blank");
  const [error, setError] = useState("");

  const pickTemplate = (key: TemplateKey) => {
    setTemplate(key);
    if (!title) {
      const t = TEMPLATES.find((x) => x.key === key);
      if (key !== "blank" && key !== "landing" && t) {
        const name = t.label.replace(" (template)", "");
        setTitle(name);
        if (!slugTouched) setSlug(slugify(name));
      }
    }
  };

  const create = () => {
    if (!title.trim()) return setError("Give the page a title.");
    const check = checkCustomPageSlug(slug || slugify(title), null, store);
    if (!check.ok) return setError(check.error);
    const page = newCustomPage({
      title: title.trim(),
      slug: check.slug,
      template,
      orgName: store.identity.name,
      email: store.identity.email,
    });
    saveAdminStore(
      { ...getAdminStore(), customPages: [...store.customPages, page] },
      { action: "Created page", target: page.title },
    );
    onCreated(page.id);
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-bold text-slate-900">New page</h2>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Start from</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => pickTemplate(t.key)}
                className={`rounded-xl border p-3 text-left text-xs transition ${
                  template === t.key
                    ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="font-semibold text-slate-900">{t.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{t.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Page title</label>
            <input
              type="text"
              className={inputCls}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Web address</label>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5">
              <span className="font-mono text-xs text-slate-400">/</span>
              <input
                type="text"
                className="w-full bg-transparent py-2 font-mono text-xs focus:outline-none"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value.toLowerCase());
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          New pages start <strong>hidden</strong>: only you can preview them until you publish.
        </p>
        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={create}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Create page
          </button>
        </div>
      </div>
    </div>
  );
}

function PageEditor({ page: saved, onClose }: { page: CustomPage; onClose: () => void }) {
  const store = useAdminStore();
  const [page, setPage] = useState<CustomPage>(() => JSON.parse(JSON.stringify(saved)));
  const [errors, setErrors] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const dirty = JSON.stringify(page) !== JSON.stringify(saved);

  const set = (patch: Partial<CustomPage>) => setPage((p) => ({ ...p, ...patch }));

  const handleSave = () => {
    const found: string[] = [];
    if (!page.title.trim()) found.push("The page needs a title.");
    const check = checkCustomPageSlug(page.slug, page.id, store);
    if (!check.ok) found.push(check.error);
    if (
      page.status === "published" &&
      page.blocks.some((b) => b.type === "text" && b.markdown.startsWith(REVIEW_NOTE_MARKER))
    ) {
      found.push(
        'This page still starts with the "Template text" notice. Review the wording, delete that first block, then publish.',
      );
    }
    page.blocks.forEach((b, i) => {
      if (b.type === "image" && !b.url) found.push(`Block ${i + 1} (image) has no picture yet.`);
    });
    setErrors(found);
    if (found.length || !check.ok) return;

    // Keep old links working if a page that was live changes address.
    let redirects: RedirectRule[] = [...store.redirects];
    const newPath = `/${check.slug}`;
    redirects = redirects.filter(
      (r) => !(r.id.startsWith(AUTO_REDIRECT_PREFIX) && r.fromPath.toLowerCase() === newPath),
    );
    if (saved.slug !== check.slug && saved.status === "published") {
      const oldPath = `/${saved.slug}`;
      redirects = redirects.filter((r) => r.fromPath.toLowerCase() !== oldPath);
      redirects.unshift({
        id: `${AUTO_REDIRECT_PREFIX}${Date.now()}`,
        fromPath: oldPath,
        toPath: newPath,
        statusCode: 301,
        isActive: true,
      });
    }

    const next: CustomPage = { ...page, slug: check.slug, updatedAt: new Date().toISOString() };
    saveAdminStore(
      {
        ...getAdminStore(),
        customPages: store.customPages.map((p) => (p.id === next.id ? next : p)),
        redirects,
      },
      { action: "Edited page", target: next.title },
    );
    setPage(next);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const updateBlock = (index: number, block: CustomPage["blocks"][number]) =>
    set({ blocks: page.blocks.map((b, i) => (i === index ? block : b)) });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All pages
        </button>
        <div className="flex items-center gap-2">
          {justSaved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Saved to draft
            </span>
          )}
          {dirty && !justSaved && (
            <span className="text-[11px] font-semibold text-amber-600">Unsaved changes</span>
          )}
          <Link
            to={`/${saved.slug}` as never}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Link>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" /> Save changes
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <p className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4" /> Fix these before saving
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={cardCls}>
        <h2 className="border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
          Page settings
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Title</label>
            <input
              type="text"
              className={inputCls}
              value={page.title}
              onChange={(e) => set({ title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Web address</label>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5">
              <span className="font-mono text-xs text-slate-400">/</span>
              <input
                type="text"
                aria-label="Web address"
                className="w-full bg-transparent py-2 font-mono text-xs focus:outline-none"
                value={page.slug}
                onChange={(e) => set({ slug: e.target.value.toLowerCase() })}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-700">Visibility</label>
            <select
              className={inputCls}
              value={page.status}
              onChange={(e) => set({ status: e.target.value as CustomPage["status"] })}
            >
              <option value="hidden">Hidden — only you can preview it</option>
              <option value="published">Published — anyone can open it (after you Publish)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Search title (optional)
            </label>
            <input
              type="text"
              className={inputCls}
              value={page.seoTitle}
              onChange={(e) => set({ seoTitle: e.target.value })}
              placeholder={`${page.title} — ${store.identity.name}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Search description (optional)
            </label>
            <input
              type="text"
              className={inputCls}
              value={page.seoDescription}
              onChange={(e) => set({ seoDescription: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageField
              label="Social share image (optional)"
              value={page.ogImage}
              onChange={(ogImage) => set({ ogImage })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {page.blocks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-xs text-slate-400">
            This page is empty. Add your first block below.
          </div>
        )}
        {page.blocks.map((block, i) => (
          <div
            key={block.id}
            className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {BLOCK_LABELS[block.type]}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  className={iconBtn}
                  disabled={i === 0}
                  aria-label="Move block up"
                  onClick={() => set({ blocks: move(page.blocks, i, -1) })}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  className={iconBtn}
                  disabled={i === page.blocks.length - 1}
                  aria-label="Move block down"
                  onClick={() => set({ blocks: move(page.blocks, i, 1) })}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  className={iconBtn}
                  aria-label="Duplicate block"
                  onClick={() => {
                    const copy = cloneBlock(block);
                    const next = [...page.blocks];
                    next.splice(i + 1, 0, copy);
                    set({ blocks: next });
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  className={`${iconBtn} hover:!text-rose-600`}
                  aria-label="Delete block"
                  onClick={() => set({ blocks: page.blocks.filter((b) => b.id !== block.id) })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <BlockEditor block={block} onChange={(b) => updateBlock(i, b)} />
          </div>
        ))}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Add a block
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => set({ blocks: [...page.blocks, newBlock(type)] })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" /> {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
