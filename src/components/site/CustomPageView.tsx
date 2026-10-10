import { ChevronDown } from "lucide-react";
import type { CustomPage, PageBlock } from "@/lib/admin-store";
import { Markdown } from "@/lib/markdown";
import { SiteLink } from "./SiteLink";
import { SiteLayout } from "./Layout";

/** Accepts watch?v=, youtu.be/, /embed/ and /shorts/ links; returns the 11-character video id. */
export function youtubeId(url: string): string | null {
  const m = url
    .trim()
    .match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
  return m ? m[1] : null;
}

function Block({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h3 className="mt-10 font-display text-xl font-semibold tracking-tight">{block.text}</h3>
      ) : (
        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight md:text-3xl">
          {block.text}
        </h2>
      );

    case "text":
      return <Markdown source={block.markdown} className="text-[15.5px] text-foreground/85" />;

    case "image":
      return block.url ? (
        <figure className="my-8">
          <img
            src={block.url}
            alt={block.alt}
            loading="lazy"
            className="w-full rounded-2xl border border-border object-cover shadow-card"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      ) : null;

    case "list":
      return (
        <ul className="my-5 space-y-2.5">
          {block.items
            .filter((i) => i.trim())
            .map((item, i) => (
              <li key={i} className="flex gap-3 text-[15.5px] text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
        </ul>
      );

    case "cta":
      return (
        <div className="my-10 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 text-center shadow-card md:p-10">
          {block.heading && (
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              {block.heading}
            </h2>
          )}
          {block.body && (
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{block.body}</p>
          )}
          {block.buttonText && block.buttonLink && (
            <SiteLink
              to={block.buttonLink}
              className="btn-sheen mt-6 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              {block.buttonText}
            </SiteLink>
          )}
        </div>
      );

    case "faq":
      return (
        <div className="my-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {block.items
            .filter((i) => i.q.trim())
            .map((item, i) => (
              <details key={i} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <Markdown source={item.a} className="mt-3 text-sm text-muted-foreground" />
              </details>
            ))}
        </div>
      );

    case "cards":
      return (
        <div className="my-8 grid gap-4 sm:grid-cols-2">
          {block.items
            .filter((i) => i.title.trim())
            .map((item, i) => {
              const inner = (
                <>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  {item.body && <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>}
                </>
              );
              const cls =
                "block rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40";
              return item.link ? (
                <SiteLink key={i} to={item.link} className={cls}>
                  {inner}
                </SiteLink>
              ) : (
                <div key={i} className={cls}>
                  {inner}
                </div>
              );
            })}
        </div>
      );

    case "video": {
      const id = youtubeId(block.youtubeUrl);
      if (!id) return null;
      return (
        <figure className="my-8">
          <div className="aspect-video overflow-hidden rounded-2xl border border-border shadow-card">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={block.caption || "Video"}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "divider":
      return <hr className="my-10 border-border" />;
  }
}

export function CustomPageView({ page, preview }: { page: CustomPage; preview?: boolean }) {
  return (
    <SiteLayout>
      <header className="border-b border-border/60 bg-gradient-to-b from-secondary/70 to-background">
        <div className="container-px mx-auto max-w-3xl py-14 md:py-20">
          {preview && (
            <p className="mb-4 inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              Hidden page — only visible to you while previewing
            </p>
          )}
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight md:text-5xl">
            {page.title}
          </h1>
        </div>
      </header>
      <article className="container-px mx-auto max-w-3xl pb-24 pt-4">
        {page.blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </article>
    </SiteLayout>
  );
}
