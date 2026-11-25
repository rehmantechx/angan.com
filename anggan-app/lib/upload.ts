// Photo upload for /admin, wired to Firebase Storage.
// BLOCKED 25 Nov 2026, checked and verified, do NOT work around it:
// Cloud Storage left the free Spark plan on 3 Feb 2026 and now needs
// the Blaze plan, a Cloud Billing account with a card on file
// (firebase.google.com/pricing: every Cloud Storage row shows
// "Not applicable" on Spark; the project bucket does not exist yet,
// the Storage API returns 404 for anngan-7a3ff). Until the owner
// approves Blaze, uploadImage throws UPLOAD_BLOCKED_MESSAGE and the
// dashboard shows that plainly, with the image URL field as fallback.
// Never invent a fake upload, never store a local-only path the live
// site cannot serve. When Blaze is approved and Storage is enabled in
// the console (Storage, Get started, then publish storage.rules),
// uploads work with no code change: the file goes to Firebase
// Storage and its download URL is saved in Firestore like any URL.
import { getFirebaseStorage } from "./firebase";

export const UPLOAD_BLOCKED_MESSAGE =
  "Photo upload is not turned on yet. Firebase Storage needs the Blaze plan (a card on file), and the owner has not approved it. Until then, paste an image URL below, or a file already on the site such as /img/mgh-lake-aerial.jpg.";

const MAX_BYTES = 5 * 1024 * 1024;

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "photo.jpg";
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file is not a photo. Choose a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That photo is over 5 MB. Choose a smaller photo, or compress it first.");
  }
  const storage = await getFirebaseStorage();
  if (!storage) throw new Error(UPLOAD_BLOCKED_MESSAGE);
  try {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    const path = folder.replace(/^\/+|\/+$/g, "") + "/" + Date.now() + "-" + safeName(file.name);
    const snap = await uploadBytes(ref(storage, path), file, { contentType: file.type });
    return await getDownloadURL(snap.ref);
  } catch (e) {
    const err = e as { code?: string; message?: string };
    // Storage not enabled, no bucket, or Blaze not approved: the SDK
    // answers storage/unknown, storage/unauthorized, or a 402/403/404.
    // All of those mean the same thing to the office: blocked on Blaze.
    if (
      (err.code || "").startsWith("storage/") ||
      /402|403|404|bucket|billing|blaze/i.test(err.message || "")
    ) {
      throw new Error(UPLOAD_BLOCKED_MESSAGE);
    }
    throw new Error(err.message || "Upload failed. Try again.");
  }
}
