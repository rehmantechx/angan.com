import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, GRAIN_MARKET } from "../../../lib/seed";
import { PROJECT_DETAILS } from "../../../lib/projectDetails";
import { EnquiryForm } from "../../../components/EnquiryForm";
import { ProjectFallback } from "../../../components/ProjectFallback";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = PROJECTS.find((p) => p.id === params.id);
  if (!project) notFound();
  const d = PROJECT_DETAILS[project.id];
  if (!d) notFound();

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
        <span className="text-gray-600"> / {project.name}</span>
      </p>
      <h1 className="text-3xl font-bold text-navy mt-2">{project.name}</h1>
      <p className="text-gray-600 mt-1">
        {project.loc && project.loc !== project.city ? `${project.loc}, ${project.city}` : project.city}
      </p>
      <p className="mt-3">{d.intro}</p>

      {galleryCount > 0 ? (
        <div className="grid gap-4 mt-5 sm:grid-cols-2">
          {galleryPhotos.map((ph, i) => {
            // First photo spans the row; if the photos after it leave a
            // single photo on the last row, that photo spans too, so no
            // empty column is ever left beside it.
            const lastSingle = i === galleryCount - 1 && i > 0 && (galleryCount - 1) % 2 === 1;
            return (
              <figure key={ph.file} className={i === 0 || lastSingle ? "sm:col-span-2" : ""}>
                <Image
                  src={`/img/${ph.file}`}
                  alt={ph.caption}
                  width={1200}
                  height={675}
                  className="w-full rounded-lg object-cover bg-navy aspect-[16/10]"
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <figcaption className="text-sm text-gray-600 mt-1">{ph.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      ) : null}

      {documentPhotos.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-navy text-center">Document</h2>
          {documentPhotos.map((ph) => (
            <figure key={ph.file} className="max-w-[480px] mx-auto mt-3">
              <Image
                src={`/img/${ph.file}`}
                alt={ph.caption}
                width={1114}
                height={1747}
                className="w-full rounded-lg object-contain bg-white border border-gray-200 aspect-[4/3]"
                loading="lazy"
                sizes="480px"
              />
              <figcaption className="text-sm text-gray-600 mt-1 text-center">{ph.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      {galleryCount === 0 && documentPhotos.length === 0 ? (
        <div className="mt-5 rounded-lg overflow-hidden">
          <ProjectFallback name={project.name} loc={project.loc} className="w-full h-56" />
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

          {project.id === "proj-6" ? (
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
                {d.products.map((p) => (
                  <li key={p.title} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{p.text}</p>
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
            <h2 className="font-bold text-navy text-lg">Talk to the office about {project.name}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              <a href="tel:+923041111698" className="bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center font-semibold">
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
              File rates change with the market. Call for today's rate.
            </p>
          </div>
          <div className="mt-4">
            <EnquiryForm asked={project.name} heading="Ask about this project" compact />
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
