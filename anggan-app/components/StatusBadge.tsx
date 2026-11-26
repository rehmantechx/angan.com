// Project status badge, shared by home, /projects and the project
// detail page. Driven by the project status the office sets in
// /admin, seed default Sold Out for Kashmir Modern City and Coming
// Soon for Pak China Grain Market. Available shows no badge on
// project cards, so the pictorial cards stay clean. The Societies
// guide passes showAvailable, because the office asked the status to
// be visible as a badge there for every society, Available included.
export function StatusBadge({ status, big = false, showAvailable = false }: { status: string | undefined; big?: boolean; showAvailable?: boolean }) {
  if (status === "Sold Out") {
    return (
      <span className={"inline-flex items-center rounded font-extrabold tracking-wide bg-[#DD3333] text-white shadow " + (big ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs")}>
        SOLD OUT
      </span>
    );
  }
  if (status === "Coming Soon") {
    return (
      <span className={"inline-flex items-center rounded font-extrabold tracking-wide bg-amber-500 text-white shadow " + (big ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs")}>
        COMING SOON
      </span>
    );
  }
  if (status === "Available" && showAvailable) {
    return (
      <span className={"inline-flex items-center rounded font-extrabold tracking-wide bg-green-600 text-white shadow " + (big ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs")}>
        AVAILABLE
      </span>
    );
  }
  return null;
}
