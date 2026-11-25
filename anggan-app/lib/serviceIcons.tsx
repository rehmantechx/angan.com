// Shared Angan Tech service visuals. One gold line icon per service, drawn
// in code, not a photo. No real photo matches any service, and a stock or
// AI photo would pretend to be real work. Used by the services list and by
// every service detail page, so both show the same icon.
import type { JSX } from "react";

function Svg({ children, size }: { children: React.ReactNode; size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const ICON_PATHS: Record<string, JSX.Element> = {
  "service-1": (<><path d="M8 6 3 12l5 6" /><path d="m16 6 5 6-5 6" /><path d="m13 4-2 16" /></>),
  "service-2": (<><path d="m3 11 18-5-7 18-2.5-7.5L3 11z" /><path d="M11.5 16.5 21 6" /></>),
  "service-3": (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /><path d="M8.5 11h5M11 8.5v5" /></>),
  "service-4": (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>),
  "service-5": (<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /><path d="m9.5 9-1.5 2 1.5 2M14.5 9l1.5 2-1.5 2" /></>),
  "service-6": (<><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  "service-7": (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  "service-8": (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M6.5 16c.5-1.5 1.4-2 2.5-2s2 0.5 2.5 2M15 9h4M15 13h4" /></>),
  "service-9": (<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
};

export function ServiceIcon({ id, size = 44 }: { id: string; size?: number }) {
  return <Svg size={size}>{ICON_PATHS[id]}</Svg>;
}

// Short lines only, shortened from the service's own note, no new facts.
// SERVICE_SHORT was deleted 26 Nov 2026: it held shortened copies of
// the service notes and /services rendered it instead of the saved
// note, so an office edit in /admin saved fine but never showed on
// the public list. The live note (seed default, office-editable) is
// the one text now.
