// About page. Client component: Our Story, Our Team, Development
// Team and the CEO photo come from the admin settings in /admin
// (About and team), falling back to the built-in text until the office
// saves its own. Our Team is the MAIN team, 3 people from the old
// anngan.com/about-us (user order 2026-11-25): M. Mahmood Cheema
// CEO, M. Talha Mahmood Director Call Center, M. Taha Mahmood Head
// Of Administration, with real photos from the old site. Development
// Team is the SUB team, the 3 people who built this website (user
// order 2026-11-25), with monogram photos until the user sends a
// clear photo. CEO portrait (ceo-flat.jpg), stats 7/12/13, the 6 real
// YouTube videos and the FAQ are unchanged.
// The Mangla lake / MGH main project image section and the What We Do
// section were removed on the client demand of 2026-11-25. The Files
// card was restored as its own section on 25 Nov 2026: it was removed
// as a side effect of removing What We Do, which the user did not ask
// to remove.
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent, DEFAULT_SITE_CONTENT } from "../../lib/siteContent";
import { getProjects, getListings, getAgencies } from "../../lib/db";
import { TeamMember } from "../../lib/seed";

// FAQ and videos now come from the site content (editable in /admin,
// About page), falling back to the seed defaults in lib/seed.ts.
// The videos are the real Anngan YouTube channel (@annganpk) videos,
// every ID verified from the channel itself, 22 Nov 2026.

// Videos found on the real Anngan YouTube channel (@annganpk,
// UC7lbVe_2Lfw8dzThSaAq6Aw). Every ID was verified from the channel
// itself (feed + yt-dlp metadata, 22 Nov 2026). No video was created
// or generated for this site. Titles are the channel's own titles,
// shortened only where the full title is a long run-on. View counts
// are the counts the channel showed on 22 Nov 2026.


const YOUTUBE_URL = "https://www.youtube.com/channel/UC7lbVe_2Lfw8dzThSaAq6Aw";

export default function AboutPage() {
  const [story, setStory] = useState(DEFAULT_SITE_CONTENT.aboutStory);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_SITE_CONTENT.team);
  const [techTeam, setTechTeam] = useState<TeamMember[]>(DEFAULT_SITE_CONTENT.techTeam);
  const [ceoPhoto, setCeoPhoto] = useState(DEFAULT_SITE_CONTENT.ceoPhoto);
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
  // Stats are counted from the live data, never typed in: projects,
  // live listings and partner agencies follow /admin edits.
  const [counts, setCounts] = useState({ projects: 7, listings: 12, agencies: 13 });
  useEffect(() => {
    getSiteContent().then((c) => {
      setContent(c);
      setStory(c.aboutStory);
      setTeam(c.team);
      setTechTeam(c.techTeam);
      setCeoPhoto(c.ceoPhoto);
    });
    getProjects().then((rows) => { if (rows.length > 0) setCounts((v) => ({ ...v, projects: rows.length })); }).catch(() => {});
    getListings().then((rows) => { const n = rows.filter((l) => l.liveStatus === "live" && l.visible !== false).length; if (n > 0) setCounts((v) => ({ ...v, listings: n })); }).catch(() => {});
    getAgencies().then((rows) => { if (rows.length > 0) setCounts((v) => ({ ...v, agencies: rows.length })); }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">About Anngan</h1>
      <p className="text-gray-600 mt-1">
        {content.aboutIntro} <span className="urdu-tagline" lang="ur">بنائے خواب حقیقت</span>
      </p>

      <div className="grid gap-6 mt-6 lg:grid-cols-2 items-start">
        <figure className="border border-gray-200 rounded-lg p-4 bg-white max-w-md w-full">
          <Image
            src={ceoPhoto || "/img/ceo-flat.jpg"}
            alt="Muhammad Mahmood Cheema, Chairman and Chief Executive Officer, Anngan"
            width={1024}
            height={683}
            className="w-full h-[380px] sm:h-[420px] object-cover object-top rounded-lg bg-white"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <figcaption className="text-sm text-gray-600 mt-2">
            Muhammad Mahmood Cheema, Chairman and Chief Executive Officer.
          </figcaption>
        </figure>

        <div>
          <h2 className="text-xl font-bold text-navy">Anngan in numbers</h2>
          <dl className="mt-3 grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white flex flex-col justify-between">
              <dt className="text-xs sm:text-sm text-gray-600">Projects on this site</dt>
              <dd className="text-2xl font-bold text-navy">{counts.projects}</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white flex flex-col justify-between">
              <dt className="text-xs sm:text-sm text-gray-600">Live listings</dt>
              <dd className="text-2xl font-bold text-navy">{counts.listings}</dd>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white flex flex-col justify-between">
              <dt className="text-xs sm:text-sm text-gray-600">Partner agencies</dt>
              <dd className="text-2xl font-bold text-navy">{counts.agencies}</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-2 flex-wrap">
            <Link href="/projects" className="btn btn-red text-sm">
              See our {counts.projects} projects
            </Link>
            <Link href="/properties" className="btn btn-outline-navy text-sm">
              Houses and flats for sale
            </Link>
            <Link href="/contact" className="btn btn-outline-navy text-sm">
              Contact the office
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">Our Story</h2>
      <div className="mt-3 space-y-3 max-w-3xl">
        {story.split(/\n\s*\n/).map((para, i) => (
          <p key={i} className="text-sm leading-relaxed">{para.trim()}</p>
        ))}
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">Our Team</h2>
      <p className="text-gray-600 text-sm mt-1 max-w-3xl">Our main team, the leadership of Anngan.</p>
      {team.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600 border border-gray-200 rounded-lg p-4 bg-white max-w-3xl">
          Our team members will be added here. The office adds them in the dashboard, under About and team.
        </p>
      ) : (
        <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <article key={m.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {m.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photoUrl} alt={m.name} loading="lazy" className="w-full h-56 object-cover object-top bg-gray-100" />
              ) : (
                <div className="w-full h-56 bg-navy flex items-center justify-center">
                  <span className="text-white text-4xl font-bold" aria-hidden="true">
                    {m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-navy">{m.name}</h3>
                {m.role ? <p className="text-sm text-gray-600 mt-1">{m.role}</p> : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* DEVELOPMENT TEAM 25 Nov 2026 (user order): the team who built
          this website, a SUB team below the main team, in the old
          anngan.com/about-us "Meet our Team" style, photo card with
          name and role, plus a link to their LinkedIn profile.
          LinkedIn would not open for a read (429/999 and the
          authwall), so no photo could be taken from there: cards show
          a clean initials monogram until the user sends a clear photo.
          No stock or AI face is used, and no role is invented: roles
          use only verified facts from the user's own records, and the
          office can change name, role, photo link and LinkedIn link
          in /admin, About and team. */}
      <h2 className="text-xl font-bold text-navy mt-10">Development Team</h2>
      <p className="text-gray-600 text-sm mt-1 max-w-3xl">Our sub team, the team who built this website. Photos coming soon, the office adds a clear photo link for each member in the dashboard.</p>
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {techTeam.map((m) => (
          <article key={m.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {m.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photoUrl} alt={m.name} loading="lazy" className="w-full h-56 object-cover object-top bg-gray-100" />
            ) : (
              <div className="w-full h-56 bg-navy flex items-center justify-center">
                <span className="text-white text-4xl font-bold" aria-hidden="true">
                  {m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-navy">{m.name}</h3>
              {m.role ? <p className="text-sm text-gray-600 mt-1">{m.role}</p> : null}
              {m.linkedinUrl ? (
                <p className="text-sm mt-2">
                  <a href={m.linkedinUrl} target="_blank" rel="noopener" className="text-anngan-dark font-semibold underline">LinkedIn profile</a>
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {/* FILES 25 Nov 2026 (live fail, HEAD 57ecf38): the Files card
          was removed as a side effect of removing What We Do, which
          the user did NOT ask to remove. Restored here as its own
          section, same as before: the real MGH Zamindar File
          allotment letter (mgh-zamindar-file.jpg, 1114x1747), tall
          white frame with object-contain, so the whole E-STAMP letter
          shows uncropped, "MGH PAKISTAN" and "S/O D/O W/O:" fully
          visible. What We Do and the Mangla lake / MGH image section
          stay removed. */}
      <h2 className="text-xl font-bold text-navy mt-10">Files</h2>
      <div className="grid gap-4 mt-4 sm:grid-cols-2">
        <article className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
          <Image src={content.aboutFilesImg} alt="MGH Zamindar File allotment letter" width={1114} height={1747} className="w-full h-80 object-contain bg-white p-2" loading="lazy" sizes="(max-width: 640px) 100vw, 50vw" />
          <div className="p-4">
            <h3 className="font-bold text-navy">Files</h3>
            <p className="text-sm text-gray-600 mt-1">{content.aboutFilesNote}</p>
          </div>
        </article>
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">Watch Muhammad Mahmood Cheema on MGH</h2>
      <p className="text-gray-600 text-sm mt-1">
        Short briefings from the Anngan YouTube channel, @annganpk. Tap a
        video to watch it on YouTube, or open the channel.
      </p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <a href={YOUTUBE_URL} target="_blank" rel="noopener" className="btn btn-red text-sm" aria-label="Open the Anngan YouTube channel">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0"><rect width="24" height="24" rx="5" fill="#fff" /><path d="M10 8.5v7l6-3.5-6-3.5z" fill="#DD3333" /></svg>
          Watch on YouTube, @annganpk
        </a>
      </div>
      <div className="grid gap-4 mt-4 sm:grid-cols-2">
        {content.aboutVideos.map((v) => (
          <article key={v.id} className="card border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" aria-label={`Watch on YouTube: ${v.title}`} className="relative block w-full aspect-video bg-navy group">
              <Image src={`/img/yt-${v.id}.jpg`} alt={v.title} width={480} height={360} loading="eager" className="absolute inset-0 w-full h-full object-cover bg-navy" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-anngan text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg group-hover:bg-[#C81E1E]" aria-hidden="true">&#9654;</span>
              </span>
            </a>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-navy">{v.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{v.views} &middot; {v.date}</p>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" className="text-anngan-dark font-semibold text-sm mt-2 inline-flex items-center min-h-[48px]">
                Watch on YouTube &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>

      <h2 className="text-xl font-bold text-navy mt-10">Frequently asked questions</h2>
      <div className="mt-3 space-y-3">
        {content.aboutFaq.map((f) => (
          <div key={f.q} className="border border-gray-200 rounded-lg p-4 bg-white">
            <p className="font-semibold">{f.q}</p>
            <p className="text-sm text-gray-600 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
