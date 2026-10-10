import { Plus, Trash2 } from "lucide-react";
import type { PageBlock } from "@/lib/admin-store";
import { ImageField } from "./MediaPicker";
import { LinkTargetField } from "./LinkTargetField";
import { youtubeId } from "@/components/site/CustomPageView";

const inputCls =
  "w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600";
const labelCls = "mb-1 block text-[11px] font-semibold text-slate-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

const addBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50";
const rmBtn = "rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600";

/** The form for one content block. Pure: it reports changes through `onChange`. */
export function BlockEditor({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (next: PageBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
          <Field label="Heading text">
            <input
              type="text"
              className={inputCls}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </Field>
          <Field label="Size">
            <select
              className={inputCls}
              value={block.level}
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 })}
            >
              <option value={2}>Large</option>
              <option value={3}>Smaller</option>
            </select>
          </Field>
        </div>
      );

    case "text":
      return (
        <Field label="Text">
          <textarea
            rows={7}
            className={`${inputCls} leading-relaxed`}
            value={block.markdown}
            onChange={(e) => onChange({ ...block, markdown: e.target.value })}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Leave a blank line between paragraphs. <code>**bold**</code> · <code>*italic*</code> ·{" "}
            <code>[link text](/contact)</code> · start lines with <code>- </code> for bullets or{" "}
            <code>1. </code> for numbers.
          </p>
        </Field>
      );

    case "image":
      return (
        <div className="space-y-3">
          <ImageField
            label="Image"
            value={block.url}
            onChange={(url) => onChange({ ...block, url })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Description (for screen readers & search)">
              <input
                type="text"
                className={inputCls}
                value={block.alt}
                onChange={(e) => onChange({ ...block, alt: e.target.value })}
              />
            </Field>
            <Field label="Caption (optional)">
              <input
                type="text"
                className={inputCls}
                value={block.caption}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
              />
            </Field>
          </div>
        </div>
      );

    case "list":
      return (
        <Field label="Bullet points (one per line)">
          <textarea
            rows={5}
            className={inputCls}
            value={block.items.join("\n")}
            onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })}
          />
        </Field>
      );

    case "cta":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Heading">
            <input
              type="text"
              className={inputCls}
              value={block.heading}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label="Button text">
            <input
              type="text"
              className={inputCls}
              value={block.buttonText}
              onChange={(e) => onChange({ ...block, buttonText: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Supporting text">
              <textarea
                rows={2}
                className={inputCls}
                value={block.body}
                onChange={(e) => onChange({ ...block, body: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Button goes to">
              <LinkTargetField
                value={block.buttonLink}
                onChange={(buttonLink) => onChange({ ...block, buttonLink })}
                invalid={false}
              />
            </Field>
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-slate-200 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Question"
                  aria-label="Question"
                  className={inputCls}
                  value={item.q}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      items: block.items.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)),
                    })
                  }
                />
                <button
                  type="button"
                  className={rmBtn}
                  aria-label="Remove question"
                  onClick={() =>
                    onChange({ ...block, items: block.items.filter((_, j) => j !== i) })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Answer"
                aria-label="Answer"
                className={inputCls}
                value={item.a}
                onChange={(e) =>
                  onChange({
                    ...block,
                    items: block.items.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)),
                  })
                }
              />
            </div>
          ))}
          <button
            type="button"
            className={addBtn}
            onClick={() => onChange({ ...block, items: [...block.items, { q: "", a: "" }] })}
          >
            <Plus className="h-3.5 w-3.5" /> Add question
          </button>
        </div>
      );

    case "cards":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-slate-200 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Card title"
                  aria-label="Card title"
                  className={inputCls}
                  value={item.title}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      items: block.items.map((x, j) =>
                        j === i ? { ...x, title: e.target.value } : x,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className={rmBtn}
                  aria-label="Remove card"
                  onClick={() =>
                    onChange({ ...block, items: block.items.filter((_, j) => j !== i) })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Short description"
                aria-label="Card description"
                className={inputCls}
                value={item.body}
                onChange={(e) =>
                  onChange({
                    ...block,
                    items: block.items.map((x, j) =>
                      j === i ? { ...x, body: e.target.value } : x,
                    ),
                  })
                }
              />
              <Field label="Card links to (optional)">
                <LinkTargetField
                  value={item.link}
                  onChange={(link) =>
                    onChange({
                      ...block,
                      items: block.items.map((x, j) => (j === i ? { ...x, link } : x)),
                    })
                  }
                  invalid={false}
                />
              </Field>
            </div>
          ))}
          <button
            type="button"
            className={addBtn}
            onClick={() =>
              onChange({ ...block, items: [...block.items, { title: "", body: "", link: "" }] })
            }
          >
            <Plus className="h-3.5 w-3.5" /> Add card
          </button>
        </div>
      );

    case "video": {
      const valid = !block.youtubeUrl.trim() || youtubeId(block.youtubeUrl);
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="YouTube link">
            <input
              type="text"
              className={`${inputCls} font-mono ${valid ? "" : "border-rose-400"}`}
              placeholder="https://www.youtube.com/watch?v=…"
              value={block.youtubeUrl}
              onChange={(e) => onChange({ ...block, youtubeUrl: e.target.value.trim() })}
            />
            {!valid && (
              <p className="mt-1 text-[11px] text-rose-600">
                That does not look like a YouTube link.
              </p>
            )}
          </Field>
          <Field label="Caption (optional)">
            <input
              type="text"
              className={inputCls}
              value={block.caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
          </Field>
        </div>
      );
    }

    case "divider":
      return <p className="text-[11px] text-slate-400">A thin horizontal line between sections.</p>;
  }
}
