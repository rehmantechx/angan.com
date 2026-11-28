// Image field for /admin: pick a photo from the computer or phone
// and upload it, or paste an image URL. Upload is wired to the free
// Cloudinary unsigned preset (lib/upload.ts). Until the owner sets
// up the free Cloudinary account and preset, the upload shows a
// clear setup message and the URL field stays the way to set a
// photo. Never a fake upload, never a local-only path.
"use client";
import { useRef, useState } from "react";
import { uploadImage, UPLOAD_BLOCKED_MESSAGE } from "../lib/upload";

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  disabled,
  hint,
  widePreview,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  disabled?: boolean;
  hint?: string;
  // widePreview: one crisp 16:9 preview (hero and banner slides).
  // Default is the small 160x96 preview used everywhere else.
  widePreview?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function onPick(file: File | undefined) {
    if (!file || disabled) return;
    setError("");
    setDone("");
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      setDone("Uploaded. The photo is live on the site once you save this section.");
    } catch (e) {
      const err = e as { message?: string };
      setError(err.message || UPLOAD_BLOCKED_MESSAGE);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // Preview: a full URL or /img/... path as-is, a bare file name
  // served from /img, the same rule as cityCardSrc on the public
  // site. A raw bare name would 404 against /admin otherwise.
  // E2E FIX 26 Nov 2026: normalize relative file names (not starting
  // with / or http) to /img/<name> here in the preview renderer, and
  // trim first, so a pasted name with a stray space can never 404
  // into a blank grey box. Whitespace-only shows no preview at all.
  const raw = (value || "").trim();
  const previewSrc = !raw ? "" : raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/") ? raw : "/img/" + raw;

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      {raw ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt="" className={widePreview ? "w-full max-w-sm aspect-video object-cover rounded-lg bg-gray-100 border border-gray-200" : "w-40 h-24 object-cover rounded-lg bg-gray-100 border border-gray-200"} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      ) : null}
      <div className="flex gap-2 items-center flex-wrap">
        {/* POLISH 28 Nov 2026: the plain browser "Choose File" button
            looks old and cheap, so the picker opens from a proper navy
            button instead. Same picker, same upload, same helper text. */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          disabled={disabled || uploading}
          aria-label={label + ", choose a photo to upload"}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => fileRef.current?.click()}
          className="btn btn-navy"
        >
          Choose a photo
        </button>
        <span className="text-sm text-gray-600">{uploading ? "Uploading photo..." : "Choose a photo from your computer or phone."}</span>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-900 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
      ) : null}
      {done ? <p role="status" className="text-sm text-green-900 bg-green-50 border border-green-200 rounded-lg p-3">{done}</p> : null}
      <label className="text-sm font-semibold">Or paste a photo link
        <input
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/img/photo.jpg or https://example.com/photo.jpg"
          aria-label={label + ", photo link"}
          className="border border-gray-300 rounded px-3 py-2 w-full min-w-0 mt-1 font-normal"
        />
      </label>
      {hint ? <p className="text-sm text-gray-600">{hint}</p> : null}
    </div>
  );
}
