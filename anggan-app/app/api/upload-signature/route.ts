// Signed Cloudinary upload, server side only.
// SECURITY 27 Nov 2026: the photo upload used an UNSIGNED Cloudinary
// preset, so anyone who read the cloud name and preset name out of the
// public JavaScript could upload images into the account (only images,
// jpg/png/webp, 5 MB, into the anngan folder, but still: they could fill
// the free quota and break uploads for the office). This route signs
// uploads with the Cloudinary API secret instead, so the browser never
// sees the secret and Cloudinary only accepts uploads this server
// signed. The client tries this route first and falls back to the
// unsigned preset only while the server is not set up yet.
// SETUP OWED (console, not code): add CLOUDINARY_API_KEY and
// CLOUDINARY_API_SECRET in Vercel (project anngan, Environment
// Variables, Production + Preview, no NEXT_PUBLIC prefix), from the
// Cloudinary dashboard (Settings, API Keys). Then, in the Cloudinary
// dashboard, change the "anngan" upload preset Signing mode from
// Unsigned to Signed, so unsigned uploads stop working entirely.
// Until those two console steps are done, the unsigned preset keeps
// working and photo upload is unchanged. No card, no paid plan.
import { createHash } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only folders inside the anngan folder, plain letters, digits,
// hyphens, underscores and slashes. Anything else is refused, so a
// caller cannot ask for a signature for some other folder.
const FOLDER_OK = /^anngan(\/[a-z0-9_-]+){0,4}$/;

export async function POST(req: Request) {
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
  if (!apiKey || !apiSecret || !cloudName) {
    // Not set up yet: the client falls back to the unsigned preset.
    return NextResponse.json({ configured: false }, { status: 503 });
  }
  let folder = "anngan";
  try {
    const body = (await req.json()) as { folder?: unknown };
    if (typeof body.folder === "string" && FOLDER_OK.test(body.folder)) {
      folder = body.folder;
    }
  } catch {
    // No body or bad JSON: sign the plain anngan folder.
  }
  const timestamp = Math.floor(Date.now() / 1000);
  // Cloudinary signature: the upload parameters, alphabetically,
  // joined with &, with the API secret appended, SHA-1 hex.
  // The folder signed here must be exactly the folder the browser
  // sends with the file, or Cloudinary rejects the upload.
  const toSign = "folder=" + folder + "&timestamp=" + timestamp + apiSecret;
  const signature = createHash("sha1").update(toSign).digest("hex");
  return NextResponse.json({
    configured: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
