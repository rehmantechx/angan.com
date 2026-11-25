// Photo upload for /admin, free route first, no card, no Blaze.
// Order of attempts:
// 1. Cloudinary free tier, unsigned upload preset (no backend, no
//    signature). Needs two public env vars, set by the owner once a
//    free Cloudinary account exists:
//      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
//    The preset must be Signing mode Unsigned, folder anngan, allowed
//    formats jpg/png/webp, max 5 MB. Upload POSTs the file to
//    https://api.cloudinary.com/v1_1/<cloud>/image/upload and the
//    returned secure_url is saved in Firestore like any URL.
// 2. Firebase Storage, only if it is actually enabled. It is NOT:
//    Cloud Storage left the free Spark plan on 3 Feb 2026 and needs
//    the Blaze plan (a card on file), which the owner has NOT
//    approved. Until then this path throws the honest blocked message.
// 3. If neither is set up, uploadImage throws UPLOAD_NOT_CONFIGURED,
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

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
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
