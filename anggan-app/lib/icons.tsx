// Small gold/navy line icons, drawn in code, same style as the
// /services gold icons. No photos, no emoji, no invented logos.
import type { JSX } from "react";

function Svg({ children, size = 24 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export function BedIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M3 18v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
      <path d="M3 18h18M5 10V6h12v4" />
      <circle cx="7.5" cy="13" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}
export function BathIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z" />
      <path d="M6 12V5a2 2 0 0 1 4 0" />
      <path d="M8 19l-1 2M17 19l1 2" />
    </Svg>
  );
}
export function SizeIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M3 17 17 3l4 4L7 21l-4-4z" />
      <path d="M8 16l1.5 1.5M11 13l1.5 1.5M14 10l1.5 1.5" />
    </Svg>
  );
}
export function HomeIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M4 11 12 3l8 8" />
      <path d="M6 10v10h12V10" />
    </Svg>
  );
}
export function PhoneIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </Svg>
  );
}
export function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />
      <path d="M9 9.5c.5 2.5 3 5 5.5 5.5l1-1.5-2-1-1 .5c-.8-.5-1.5-1.2-2-2l.5-1-1-2L9 9.5z" />
    </Svg>
  );
}
export function MapIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}
export function CalcIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01" />
    </Svg>
  );
}
// PARITY 24 Nov 2026, Section 4: this was drawn as a camera
// (rect + lens circle + top bar). A home loan calculator gets a bank:
// roof, three columns, base.
export function LoanIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 10v8M10 10v8M14 10v8M19 10v8" />
      <path d="M3 21h18M4 18h16" />
    </Svg>
  );
}
export function ConvertIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </Svg>
  );
}
export function FileIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M6 2h9l5 5v15H6V2z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </Svg>
  );
}
export function UsersIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}
export function BuildingIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
    </Svg>
  );
}
export function MegaphoneIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg size={size}>
      <path d="m3 11 18-5-7 18-2.5-7.5L3 11z" />
      <path d="M11.5 16.5 21 6" />
    </Svg>
  );
}
export function PinIcon({ size = 20 }: { size?: number }) {
  return <MapIcon size={size} />;
}
export type IconName = "bed" | "bath" | "size" | "home";
export function SpecIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  if (name === "bed") return <BedIcon size={size} />;
  if (name === "bath") return <BathIcon size={size} />;
  if (name === "size") return <SizeIcon size={size} />;
  return <HomeIcon size={size} />;
}
