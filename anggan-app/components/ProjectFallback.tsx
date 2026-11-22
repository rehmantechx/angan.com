// Branded fallback for a project with no real site photo. No photo is
// invented, no stock render, no AI image: a navy block with a gold roof
// mark, the project name, and "Photo coming soon". Used for Pak China
// Grain Market (no photo exists at all). Al Ghani Phase 7 uses its first
// detail-page image, alghani-hero.jpeg, as its card cover.
// Compact mode is for the small 112x96 thumbnail on the home "Our
// projects" row: smaller icon and text, short "Photo coming soon" line,
// overflow hidden, so nothing spills above the box or clips below it.
export function ProjectFallback({ name, loc, className, compact }: { name: string; loc: string; className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className={"bg-navy flex flex-col items-center justify-center text-white px-2 py-1.5 text-center overflow-hidden " + (className || "w-28 h-24 rounded shrink-0")}>
        <svg viewBox="0 0 64 40" width="24" height="15" aria-hidden="true" className="shrink-0">
          <path d="M4 38 V22 L32 4 L60 22 V38 H44 V26 H20 V38 Z" fill="none" stroke="#DDB78B" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <span className="font-bold text-xs leading-tight mt-1">{name}</span>
        <span className="text-[11px] leading-tight text-white/80">{loc}</span>
        <span className="text-[10px] leading-tight text-white/70 mt-0.5">Photo coming soon</span>
      </div>
    );
  }
  return (
    <div className={"bg-navy flex flex-col items-center justify-center text-white px-4 text-center overflow-hidden " + (className || "w-full h-48")}>
      <svg viewBox="0 0 64 40" width="48" height="30" aria-hidden="true" className="shrink-0">
        <path d="M4 38 V22 L32 4 L60 22 V38 H44 V26 H20 V38 Z" fill="none" stroke="#DDB78B" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="font-bold text-base mt-2">{name}</span>
      <span className="text-sm text-white/80">{loc}</span>
      <span className="text-xs text-white/70 mt-1">Photo coming soon. Call the office for details.</span>
    </div>
  );
}
