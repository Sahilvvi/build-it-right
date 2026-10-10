/** @jsxImportSource @/lib/editable */
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { isHttpUrl, isValidLinkTarget, needsPlainAnchor } from "@/lib/links";
import { toInternalPath, toPublicPath } from "@/lib/pages";

interface SiteLinkProps {
  to: string;
  openInNewTab?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

/**
 * Renders an admin-configured link. Internal paths use the client router; everything else is a
 * plain anchor. Invalid targets render nothing, so a bad CMS entry can never produce a
 * `javascript:` link or a broken router call.
 */
export function SiteLink({ to, openInNewTab, className, onClick, children }: SiteLinkProps) {
  if (!isValidLinkTarget(to)) return null;

  if (needsPlainAnchor(to)) {
    const newTab = openInNewTab || undefined;
    return (
      <a
        href={to.startsWith("/") ? toPublicPath(toInternalPath(to)) : to}
        className={className}
        onClick={onClick}
        target={newTab ? "_blank" : undefined}
        rel={newTab || isHttpUrl(to) ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  if (openInNewTab) {
    return (
      <a
        href={toPublicPath(toInternalPath(to))}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={toInternalPath(to) as never} preload="intent" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
