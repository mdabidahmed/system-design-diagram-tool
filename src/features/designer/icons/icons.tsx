import type { SVGProps } from "react";

/**
 * Small monoline glyphs for the palette + node thumbnails. Every icon shares
 * the same 24x24 viewBox and stroke language so they read as one family
 * regardless of which shape they're dropped onto.
 */
function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

const server = (
  <Base>
    <rect x="4" y="3.5" width="16" height="6" rx="1.4" />
    <rect x="4" y="14.5" width="16" height="6" rx="1.4" />
    <circle cx="7.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="7.5" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
    <path d="M11 6.5h6M11 17.5h6" />
  </Base>
);

const database = (
  <Base>
    <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
    <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
    <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
  </Base>
);

const cache = (
  <Base>
    <rect x="3.5" y="10.5" width="10" height="8" rx="1.3" />
    <rect x="7" y="6.5" width="10" height="8" rx="1.3" />
    <rect x="10.5" y="2.5" width="10" height="8" rx="1.3" />
  </Base>
);

const loadBalancer = (
  <Base>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4v5M12 15v5M5 8l4.2 3M18.8 8L14.6 11M5 16l4.2-3M18.8 16L14.6 13" />
  </Base>
);

const queue = (
  <Base>
    <path d="M3 8v8M7 6.5v11M11 6.5v11M15 6.5l4 5.5-4 5.5" />
  </Base>
);

const cdn = (
  <Base>
    <path d="M7 17a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.6 4 4 0 0 1 17 17H7Z" />
    <path d="M13 11l-3 4h3l-3 4" strokeWidth={1.5} />
  </Base>
);

const dns = (
  <Base>
    <circle cx="12" cy="12" r="8" />
    <ellipse cx="12" cy="12" rx="3.2" ry="8" />
    <path d="M4 12h16M5.2 7.5h13.6M5.2 16.5h13.6" />
  </Base>
);

const nosql = (
  <Base>
    <path d="M9 3c-2 0-2.5 1.2-2.5 2.7 0 1.6.7 2.3.7 3.8S6 11.8 6 12s.2.5 1.2 2.5.7 2.2.7 3.8C7.9 19.8 7 21 9 21" />
    <path d="M15 3c2 0 2.5 1.2 2.5 2.7 0 1.6-.7 2.3-.7 3.8S18 11.8 18 12s-.2.5-1.2 2.5-.7 2.2-.7 3.8c.1 1.7 1 2.9-1 2.9" />
  </Base>
);

const apiGateway = (
  <Base>
    <rect x="3.5" y="4" width="17" height="16" rx="1.6" />
    <path d="M8.5 4v16M13 9l3 3-3 3" />
  </Base>
);

const worker = (
  <Base>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.8 6.2l-1.6 1.6M7.8 16.2l-1.6 1.6M17.8 17.8l-1.6-1.6M7.8 7.8 6.2 6.2" />
  </Base>
);

const client = (
  <Base>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
  </Base>
);

const browser = (
  <Base>
    <rect x="3" y="3.5" width="18" height="13" rx="1.6" />
    <path d="M10.3 19.5h3.4M8 22h8" />
  </Base>
);

const mobile = (
  <Base>
    <rect x="7.5" y="2.5" width="9" height="19" rx="2.2" />
    <circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none" />
  </Base>
);

const rateLimiter = (
  <Base>
    <path d="M4 16a8 8 0 0 1 16 0" />
    <path d="M12 16l4.5-5.5" />
    <circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none" />
  </Base>
);

const hashRing = (
  <Base>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="4" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="19.2" cy="9.1" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="16.4" cy="18.2" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="7.6" cy="18.2" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="4.8" cy="9.1" r="1.3" fill="currentColor" stroke="none" />
  </Base>
);

const shard = (
  <Base>
    <ellipse cx="12" cy="5.5" rx="6.5" ry="2.2" />
    <path d="M5.5 5.5v13c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2v-13" />
    <path d="M5.5 12h13" />
  </Base>
);

const searchIndex = (
  <Base>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.3 15.3 20 20" />
  </Base>
);

const webSocket = (
  <Base>
    <path d="M8 3v5M16 3v5M8 21v-5M16 21v-5M6 8h12v8H6z" />
  </Base>
);

const objectStorage = (
  <Base>
    <path d="M5 4h14l-1.6 15.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5 4Z" />
    <path d="M3.5 4h17M9 8h6" />
  </Base>
);

const notification = (
  <Base>
    <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </Base>
);

const coordinator = (
  <Base>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8.5 12.5l2.3 2.3L16 9.5" />
  </Base>
);

const thirdParty = (
  <Base>
    <path d="M7 17a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.6 4 4 0 0 1 17 17H7Z" />
  </Base>
);

const container = (
  <Base strokeDasharray="3 2.4">
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
  </Base>
);

const autoScaling = (
  <Base>
    <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" />
  </Base>
);

const kubernetes = (
  <Base>
    <path d="M12 2.5l8 4.6v9.8L12 21.5l-8-4.6V7.1L12 2.5Z" />
    <circle cx="12" cy="12" r="3" />
  </Base>
);

const metadata = (
  <Base>
    <path d="M4 6h16M4 12h16M4 18h16" />
    <circle cx="9" cy="6" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="16" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="10" cy="18" r="1.6" fill="currentColor" stroke="none" />
  </Base>
);

const edgeNode = (
  <Base>
    <circle cx="12" cy="16" r="2" fill="currentColor" stroke="none" />
    <path d="M8.5 12.5a5 5 0 0 1 7 0M6 10a8.5 8.5 0 0 1 12 0" />
  </Base>
);

export const ICONS: Record<string, JSX.Element> = {
  server,
  database,
  cache,
  loadBalancer,
  queue,
  cdn,
  dns,
  nosql,
  apiGateway,
  worker,
  client,
  browser,
  mobile,
  rateLimiter,
  hashRing,
  shard,
  searchIndex,
  webSocket,
  objectStorage,
  notification,
  coordinator,
  metadata,
  edgeNode,
  thirdParty,
  container,
  autoScaling,
  kubernetes,
};

export function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name || !ICONS[name]) return null;
  const el = ICONS[name];
  return <span className={className}>{el}</span>;
}
