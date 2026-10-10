import { Fragment, type ReactNode } from "react";
import { isValidLinkTarget } from "./links";

/**
 * A tiny, safe Markdown subset for CMS text blocks — no raw HTML is ever rendered:
 *   blank line = new paragraph · "- item" = bullet · "1. item" = numbered
 *   **bold** · *italic* · [label](/page or https://…)
 */
function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      out.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) ?? [];
      if (label && href && isValidLinkTarget(href)) {
        const external = /^https?:\/\//i.test(href);
        out.push(
          <a
            key={key++}
            href={href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>,
        );
      } else {
        out.push(token);
      }
    }
    last = index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = source
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="my-4 list-disc space-y-1.5 pl-6">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={i} className="my-4 list-decimal space-y-1.5 pl-6">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="my-4 leading-relaxed">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
