"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProjects, getSettings } from "../../lib/db";
import { SETTINGS, OfficeSettings } from "../../lib/seed";
import { projectCardSrc } from "../../lib/siteContent";
import { Project, PROJECTS } from "../../lib/seed";
import { ProjectFallback } from "../../components/ProjectFallback";
import { StatusBadge } from "../../components/StatusBadge";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [settings, setSettings] = useState<OfficeSettings>(SETTINGS);
  useEffect(() => {
    getProjects().then((rows) => { if (rows.length > 0) setProjects(rows); });
    getSettings().then((x) => setSettings(x)).catch(() => {});
  }, []);
  const telHref = "tel:+" + settings.phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
  const waHref = "https://wa.me/" + settings.whatsapp.replace(/[^0-9]/g, "");

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Projects</h1>
      <p className="text-gray-600 mt-1">{projects.length} real projects. Call {settings.phone} for files, prices and payment plans.</p>
      {/* PARITY 24 Nov 2026, Section 2: flex flex-wrap
          justify-center, so the 7th card (Kashmir Modern City) is
          centred on the last row instead of a lone orphan. */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {projects.map((p, i) => (
          <article key={p.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
            {p.img || p.cardImg ? (
              // LIVE-FAIL FIX 24 Nov 2026: the Global Homes cover is
              // now a true 16/10 wide crop of the real house photo
              // (global-zamzam-house-wide.jpg). object-cover object-top
              // fills the h-48 card with the roof intact and no side
              // pillars. The old clean file was a tall portrait, which
              // object-contain squeezed into a narrow strip with white
              // pillars. Every other card stays object-cover.
              <div className="relative">
                <Image src={projectCardSrc(p)} alt={p.name} width={1200} height={675} className={(p.cardImg || p.img) === "global-zamzam-house-wide-v3.jpg" ? "w-full h-48 object-cover object-top bg-navy" : "w-full h-48 object-cover bg-navy"} loading={i < 3 ? "eager" : "lazy"} priority={i < 3} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <span className="absolute top-2 left-2"><StatusBadge status={p.status} /></span>
              </div>
            ) : (
              <ProjectFallback name={p.name} loc={p.loc} />
            )}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg">
                <Link href={`/projects/${p.id}`} className="text-navy hover:text-anngan-dark">
                  {p.name}
                </Link>{" "}
                <StatusBadge status={p.status} />
              </h3>
              <p className="text-gray-600 text-sm">{p.loc}</p>
              <p className="text-sm mt-1">{p.note}</p>
              {/* PHN-01 / PHN-02: same order and colors as ListingCard:
                  View first, then Call (blue), then WhatsApp (green). */}
              <div className="flex gap-2 mt-auto pt-3 flex-wrap">
                <Link href={`/projects/${p.id}`} className="btn btn-outline-navy text-sm">View project</Link>
                <a href={telHref} className="btn btn-navy text-sm">Call</a>
                <a href={waHref} target="_blank" rel="noopener" className="btn btn-green text-sm">WhatsApp</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
