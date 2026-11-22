// Branded fallback for a project with no real site photo. No photo is
// invented, no stock render, no AI image: a navy block with a gold roof
// mark, the project name, and "Photo coming soon". Used for Al Ghani
// Phase 7 (its detail-page images are marketing material, not a site
// photo) and Pak China Grain Market (no photo exists at all).
export function ProjectFallback({ name, loc, className }: { name: string; loc: string; className?: string }) {
  return (
    <div className={"bg-navy flex flex-col items-center justify-center text-white px-4 text-center " + (className || "w-full h-48")}>
      <svg viewBox="0 0 64 40" width="48" height="30" aria-hidden="true" className="shrink-0">
        <path d="M4 38 V22 L32 4 L60 22 V38 H44 V26 H20 V38 Z" fill="none" stroke="#DDB78B" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className="font-bold text-base mt-2">{name}</span>
      <span className="text-sm text-white/80">{loc}</span>
      <span className="text-xs text-white/70 mt-1">Photo coming soon. Call the office for details.</span>
    </div>
  );
}
