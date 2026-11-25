// Project detail page. Client component, like /projects: the project
// row (status and card image) is refreshed from Firestore, so a status
// the office sets in /admin (Sold Out, Coming Soon, Available) shows
// here with no code change and no redeploy. The facts, photos and
// products still come from lib/projectDetails.ts, unchanged.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PROJECTS, GRAIN_MARKET, Project } from "../../../lib/seed";
import { getProjects } from "../../../lib/db";
import { PROJECT_DETAILS } from "../../../lib/projectDetails";
import { EnquiryForm } from "../../../components/EnquiryForm";
import { ProjectFallback } from "../../../components/ProjectFallback";
import { ProjectGallery } from "../../../components/ProjectGallery";
import { StatusBadge } from "../../../components/StatusBadge";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const seedProject = PROJECTS.find((p) => p.id === params.id);
  const [project, setProject] = useState<Project | undefined>(seedProject);
  useEffect(() => {
    getProjects().then((rows) => {
      const live = rows.find((r) => r.id === params.id);
      if (live) setProject(live);
    });
  }, [params.id]);
  if (!seedProject) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">Project not found</h1>
        <p className="text-gray-600 mt-2">This project does not exist on anngan.com.</p>
        <p className="mt-4">
          <Link href="/projects" className="text-anngan-dark font-semibold underline">Back to all projects</Link>
        </p>
      </div>
    );
  }
  const p = project || seedProject;
  const d = PROJECT_DETAILS[p.id];
  if (!d) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-navy">{p.name}</h1>
        <p className="text-gray-600 mt-2">Details for this project are not published yet. Call +92 304 1111 698.</p>
        <p className="mt-4">
          <Link href="/projects" className="text-anngan-dark font-semibold underline">Back to all projects</Link>
        </p>
      </div>
    );
  }

  // The Zamindar File allotment letter is a document scan, not a gallery
  // photo. It lives in its own full-width row below the gallery, centred
  // and bounded, so the gallery grid never ends with an empty column.
  const isDocument = (file: string, caption: string) =>
    file.includes("zamindar") || caption.toLowerCase().includes("allotment letter");
  const galleryPhotos = d.photos.filter((ph) => !isDocument(ph.file, ph.caption));
  const documentPhotos = d.photos.filter((ph) => isDocument(ph.file, ph.caption));
  const galleryCount = galleryPhotos.length;

  return (
    <div>
      <p className="text-sm">
        <Link href="/projects" className="text-anngan-dark font-semibold">
          All projects
        </Link>
        <span className="text-gray-600"> / {p.name}</span>
      </p>
      <h1 className="text-3xl font-bold text-navy mt-2">{p.name} <StatusBadge status={p.status} big /></h1>
      <p className="text-gray-600 mt-1">
        {p.loc && p.loc !== p.city ? `${p.loc}, ${p.city}` : p.city}
      </p>
      {p.status === "Sold Out" ? (
        <p className="mt-3 bg-red-50 border border-red-200 text-red-900 rounded-lg px-4 py-3 text-sm font-semibold">
          This project is sold out. Call the office if you want to be told about resale files or the next launch.
        </p>
      ) : null}
      {p.status === "Coming Soon" ? (
        <p className="mt-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 text-sm font-semibold">
          This project is coming soon. Call the office to be told when bookings open.
        </p>
      ) : null}
      <p className="mt-3">{d.intro}</p>

      <ProjectGallery galleryPhotos={galleryPhotos} documentPhotos={documentPhotos} />

      {galleryCount === 0 && documentPhotos.length === 0 ? (
        <div className="mt-5 rounded-lg overflow-hidden">
          <ProjectFallback name={p.name} loc={p.loc} className="w-full h-56" />
        </div>
      ) : null}

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy">Project facts</h2>
          <dl className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
            {d.facts.map((f) => (
              <div key={f.label} className="grid grid-cols-3 gap-2 px-4 py-2 text-sm">
                <dt className="font-semibold text-navy">{f.label}</dt>
                <dd className="col-span-2">{f.value}</dd>
              </div>
            ))}
          </dl>
          {d.website ? (
            <p className="mt-3 text-sm">
              Visit the project website:{" "}
              <a
                href={d.website.url}
                target="_blank"
                rel="noopener"
                className="text-anngan-dark font-semibold underline"
              >
                {d.website.label}
              </a>
            </p>
          ) : null}
          {d.note ? <p className="mt-3 text-sm text-gray-600">{d.note}</p> : null}

          {p.id === "proj-6" ? (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-navy">Shop plan</h2>
              <table className="w-full text-sm mt-3 border border-gray-200 rounded-lg bg-white">
                <thead>
                  <tr className="bg-navy text-white text-left">
                    <th className="px-3 py-2">Shop size</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Rent quoted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-3 py-2">2 Marla</td>
                    <td className="px-3 py-2">Rs 56 Lac</td>
                    <td className="px-3 py-2">Rs 25,000 per month</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-3 py-2">3 Marla</td>
                    <td className="px-3 py-2">Rs 84 Lac</td>
                    <td className="px-3 py-2">Rs 35,000 per month</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-3 py-2">4 Marla</td>
                    <td className="px-3 py-2">Rs 112 Lac</td>
                    <td className="px-3 py-2">Rs 45,000 per month</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">
                25% down payment, 3-year easy installment plan. {GRAIN_MARKET.shops} shops
                on {GRAIN_MARKET.acres} acres, {GRAIN_MARKET.road}.
              </p>
            </div>
          ) : null}

          {d.products ? (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-navy">What you can buy here</h2>
              <ul className="mt-3 space-y-3">
                {d.products.map((prod) => (
                  <li key={prod.title} id={prod.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} className="border border-gray-200 rounded-lg p-3 bg-white scroll-mt-24">
                    <p className="font-semibold">{prod.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{prod.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {d.amenities ? (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-navy">On site</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {d.amenities.map((a) => (
                  <li
                    key={a}
                    className="border border-gray-200 rounded-full px-3 py-1 text-sm bg-white"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h2 className="font-bold text-navy text-lg">Talk to the office about {p.name}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              <a href="tel:+923041111698" className="bg-[#004274] text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center font-semibold">
                Call +92 304 1111 698
              </a>
              <a
                href="https://wa.me/923041111698"
                target="_blank"
                rel="noopener"
                className="bg-green-700 text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center font-semibold"
              >
                WhatsApp
              </a>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              File rates change with the market. Call for today&apos;s rate.
            </p>
          </div>
          <div className="mt-4">
            <EnquiryForm asked={p.name} heading="Ask about this project" compact />
          </div>
          <p className="mt-4 text-sm">
            <Link href="/projects" className="text-anngan-dark font-semibold underline">
              Back to all projects
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
