"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "../../lib/db";
import { Project, GRAIN_MARKET } from "../../lib/seed";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Projects</h1>
      <p className="text-gray-600 mt-1">7 real projects. Call +92 304 1111 698 for files, prices and payment plans.</p>
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article key={p.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            {p.img ? (
              <img src={`/img/${p.img}`} alt={p.name} className="w-full h-48 object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-44 bg-gold/40 flex flex-col items-center justify-center text-navy text-sm font-semibold px-4 text-center">
                <span>{p.name}</span>
                <span>{GRAIN_MARKET.acres} acres, {GRAIN_MARKET.road}. {GRAIN_MARKET.shops} shops.</span>
                {GRAIN_MARKET.prices.map((x) => <span key={x.size}>{x.size} {x.price}</span>)}
                <span>No photo for this project yet</span>
              </div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-lg">
                <Link href={`/projects/${p.id}`} className="text-navy hover:text-anngan-dark">
                  {p.name}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm">{p.loc}</p>
              <p className="text-sm mt-1">{p.note}</p>
              <div className="flex gap-2 mt-auto pt-3 flex-wrap">
                <Link href={`/projects/${p.id}`} className="border border-navy text-navy text-sm px-3 py-2.5 rounded min-h-[48px] inline-flex items-center font-semibold">View project</Link>
                <a href="tel:+923041111698" className="bg-anngan text-white text-sm px-3 py-2.5 rounded min-h-[48px] inline-flex items-center">Call</a>
                <a href="https://wa.me/923041111698" target="_blank" rel="noopener" className="bg-green-600 text-white text-sm px-3 py-2.5 rounded min-h-[48px] inline-flex items-center">WhatsApp</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
