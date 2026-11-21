import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "../../../lib/seed";
import { SERVICE_DETAILS } from "../../../lib/serviceDetails";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ id: s.id }));
}

export default function ServicePage({ params }: { params: { id: string } }) {
  const service = SERVICES.find((s) => s.id === params.id);
  if (!service) notFound();
  const d = SERVICE_DETAILS[service.id];
  if (!d) notFound();

  return (
    <div>
      <p className="text-sm">
        <Link href="/services" className="text-anngan-dark font-semibold">
          All Angan Tech services
        </Link>
        <span className="text-gray-600"> / {service.name}</span>
      </p>
      <h1 className="text-3xl font-bold text-navy mt-2">{service.name}</h1>
      <p className="text-gray-600 mt-1">
        Angan Tech, Anngan Technologies Pvt. Ltd, Paragon City, Lahore.
      </p>
      <p className="mt-3">{d.scope}</p>

      <div className="flex gap-2 mt-5 flex-wrap">
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

      <div className="grid gap-8 mt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-navy">What is included</h2>
          <ol className="mt-3 space-y-3 list-decimal list-inside">
            {d.included.map((item) => (
              <li key={item.title} className="border border-gray-200 rounded-lg p-3 bg-white">
                <span className="font-semibold">{item.title}</span>
                <span className="text-sm text-gray-600 block mt-1">{item.text}</span>
              </li>
            ))}
          </ol>

          <h2 className="text-xl font-bold text-navy mt-8">What you get</h2>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            {d.gets.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy">How it works</h2>
          <ol className="mt-3 space-y-3">
            {d.steps.map((step, i) => (
              <li key={step.title} className="border border-gray-200 rounded-lg p-3 bg-white">
                <p className="font-semibold">
                  Step {i + 1}, {step.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">{step.text}</p>
              </li>
            ))}
          </ol>

          <h2 className="text-xl font-bold text-navy mt-8">Who it is for</h2>
          <p className="mt-2 text-sm">{d.whoFor}</p>

          <h2 className="text-xl font-bold text-navy mt-8">Price</h2>
          <p className="mt-2 text-sm">{d.priceNote}</p>
          <p className="mt-4 text-sm">
            <Link href="/services" className="text-anngan-dark font-semibold underline">
              Back to all Angan Tech services
            </Link>
            {" | "}
            <Link href="/contact" className="text-anngan-dark font-semibold underline">
              Contact the office
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
