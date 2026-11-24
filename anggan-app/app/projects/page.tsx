"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "../../lib/db";
import { Project, PROJECTS } from "../../lib/seed";
import { ProjectFallback } from "../../components/ProjectFallback";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  useEffect(() => {
    getProjects().then((rows) => { if (rows.length > 0) setProjects(rows); });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Projects</h1>
      <p className="text-gray-600 mt-1">7 real projects. Call +92 304 1111 698 for files, prices and payment plans.</p>
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <article key={p.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            {p.img ? (
              <Image src={`/img/${p.cardImg || p.img}`} alt={p.name} width={1200} height={675} className="w-full h-48 object-cover bg-navy" loading={i < 3 ? "eager" : "lazy"} priority={i < 3} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            ) : (
              <ProjectFallback name={p.name} loc={p.loc} />
            )}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg">
                <Link href={`/projects/${p.id}`} className="text-navy hover:text-anngan-dark">
                  {p.name}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm">{p.loc}</p>
              <p className="text-sm mt-1">{p.note}</p>
              {/* PHN-01 / PHN-02: same order and colors as ListingCard:
                  View first, then Call (blue), then WhatsApp (green). */}
              <div className="flex gap-2 mt-auto pt-3 flex-wrap">
                <Link href={`/projects/${p.id}`} className="btn btn-outline-navy text-sm">View project</Link>
                <a href="tel:+923041111698" className="btn btn-navy text-sm">Call</a>
                <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="btn btn-green text-sm">WhatsApp</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
