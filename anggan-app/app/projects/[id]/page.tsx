// Project detail page, server component (SEO 27 Nov 2026): the
// interactive body lives in ProjectDetail.tsx, so this page can
// carry generateMetadata. The Meta Title and Meta Description saved
// in /admin win when they are set; otherwise the page uses the
// project name and short note. A saved URL slug resolves here too,
// and the old id address keeps working.
import type { Metadata } from "next";
import { resolveProject } from "../../../lib/db";
import { ProjectDetail } from "./ProjectDetail";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await resolveProject(params.id).catch(() => null);
  if (!p) {
    return { title: "Project not found | Anngan" };
  }
  const title = (p.metaTitle || "").trim() || p.name + ", " + p.loc + " | Anngan";
  const description =
    (p.metaDescription || "").trim() ||
    p.note ||
    p.name + ", " + p.loc + ", " + p.city + ". Call Anngan on +92 304 1111 698.";
  return { title, description };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectDetail id={params.id} />;
}
