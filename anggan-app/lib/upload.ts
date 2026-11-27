// Photo upload for /admin, free route first, no card, no Blaze.
// Order of attempts:
// 1. Cloudinary, SIGNED upload (27 Nov 2026): the browser asks our own
//    /api/upload-signature route, which signs the upload with the
//    Cloudinary API secret on the server. The secret never reaches the
//    browser. Needs CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in
//    Vercel (server-only env vars, no NEXT_PUBLIC prefix) plus the
//    public cloud name. While those are not set, the route answers
//    503 and the upload falls back to step 2, so upload never breaks.
// 2. Cloudinary free tier, unsigned upload preset (no backend, no
//    signature). Needs two public env vars, set by the owner once a
//    free Cloudinary account exists:
//      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
//    The preset must be Signing mode Unsigned, folder anngan, allowed
//    formats jpg/png/webp, max 5 MB. Upload POSTs the file to
//    https://api.cloudinary.com/v1_1/<cloud>/image/upload and the
//    returned secure_url is saved in Firestore like any URL.
//    SECURITY: anyone who reads the cloud name and preset name out of
//    the public JavaScript can upload images into the account, so once
//    the signed route is set up in Vercel, change the preset to Signed
//    in the Cloudinary dashboard and the unsigned path stops working.
// 3. Firebase Storage, only if it is actually enabled. It is NOT:
//    Cloud Storage left the free Spark plan on 3 Feb 2026 and needs
//    the Blaze plan (a card on file), which the owner has NOT
//    approved. Until then this path throws the honest blocked message.
// 4. If neither is set up, uploadImage throws UPLOAD_NOT_CONFIGURED,
//    the dashboard shows that plainly, and the image URL field stays
//    the fallback. Never invent a fake upload, never store a
//    local-only path the live site cannot serve, never enable Blaze,
//    never add a card, never pay anything.
import { getFirebaseStorage } from "./firebase";

export const UPLOAD_NOT_CONFIGURED =
  "Photo upload is not set up yet. It needs a free Cloudinary account: create one, add an Unsigned upload preset, then set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local and in Vercel. Until then, paste an image URL below, or a file already on the site such as /img/mgh-lake-aerial.jpg. Firebase Storage is not an option without the Blaze plan (a card on file), which the owner has not approved.";

export const UPLOAD_BLOCKED_MESSAGE = UPLOAD_NOT_CONFIGURED;

export function cloudinaryConfigured(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim() &&
      (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").trim()
  );
}

export function uploadConfigured(): boolean {
  return cloudinaryConfigured();
}

const MAX_BYTES = 5 * 1024 * 1024;

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "photo.jpg";
}

async function uploadToCloudinarySigned(file: File, folder: string): Promise<string | null> {
  // Signed upload through our own server route. Returns null when the
  // server is not set up for it (no API secret in Vercel yet) or when
  // the route fails for any reason, so the caller falls back to the
  // unsigned preset. A broken signature route must never break photo
  // upload for the office.
  try {
    const res = await fetch("/api/upload-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "anngan/" + folder.replace(/^\/+|\/+$/g, "") }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      configured?: boolean;
      signature?: string;
      timestamp?: number;
      apiKey?: string;
      cloudName?: string;
      folder?: string;
    };
    if (!data.configured || !data.signature || !data.apiKey || !data.cloudName || !data.folder) return null;
    const form = new FormData();
    form.append("file", file, safeName(file.name));
    form.append("api_key", data.apiKey);
    form.append("timestamp", String(data.timestamp));
    form.append("signature", data.signature);
    form.append("folder", data.folder);
    const up = await fetch("https://api.cloudinary.com/v1_1/" + data.cloudName + "/image/upload", {
      method: "POST",
      body: form,
    });
    let upData: { secure_url?: string; error?: { message?: string } } = {};
    try {
      upData = (await up.json()) as typeof upData;
    } catch {
      upData = {};
    }
    if (!up.ok || !upData.secure_url) return null;
    return upData.secure_url;
  } catch {
    return null;
  }
}

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  // Signed first, unsigned preset as the fallback while the server
  // secret is not set up yet (see the route and the header comment).
  const signed = await uploadToCloudinarySigned(file, folder);
  if (signed) return signed;
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
  const preset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").trim();
  const form = new FormData();
  form.append("file", file, safeName(file.name));
  form.append("upload_preset", preset);
  form.append("folder", "anngan/" + folder.replace(/^\/+|\/+$/g, ""));
  const res = await fetch("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload", {
    method: "POST",
    body: form,
  });
  let data: { secure_url?: string; error?: { message?: string } } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    data = {};
  }
  if (!res.ok || !data.secure_url) {
    throw new Error(
      "Cloudinary upload failed: " +
        (data.error?.message || "check the cloud name and upload preset, the preset must be Unsigned.") +
        " The photo was not saved."
    );
  }
  return data.secure_url;
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file is not a photo. Choose a JPG, PNG or WebP image.");
  }
  // The unsigned preset only accepts JPG, PNG and WebP (verified in
  // the Cloudinary dashboard 2026-11-26; the preset editor has no
  // max-size field, so size is enforced below). Reject any other
  // image format here, before any upload attempt, with a clear
  // message, instead of letting Cloudinary reject it mid-upload.
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("That photo is not a JPG, PNG or WebP file. The upload only accepts JPG, PNG and WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That photo is over 5 MB. Choose a smaller photo, or compress it first.");
  }
  if (cloudinaryConfigured()) {
    return uploadToCloudinary(file, folder);
  }
  const storage = await getFirebaseStorage();
  if (!storage) throw new Error(UPLOAD_NOT_CONFIGURED);
  try {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const path = folder.replace(/^\/+|\/+$/g, "") + "/" + Date.now() + "-" + safeName(file.name);
    const snap = await uploadBytes(ref(storage, path), file, { contentType: file.type });
    return await getDownloadURL(snap.ref);
  } catch (e) {
    const err = e as { code?: string; message?: string };
    // Storage not enabled, no bucket, or Blaze not approved: the SDK
    // answers storage/unknown, storage/unauthorized, or a 402/403/404.
    // All of those mean the same thing to the office: blocked, use
    // the free Cloudinary setup or paste a URL.
    if (
      (err.code || "").startsWith("storage/") ||
      /402|403|404|bucket|billing|blaze/i.test(err.message || "")
    ) {
      throw new Error(UPLOAD_NOT_CONFIGURED);
    }
    throw new Error(err.message || "Upload failed. Try again.");
  }
}
