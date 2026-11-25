// VIS-06: one shared Google sign-in button, used by /signin and
// /create-listing, so both auth gates look the same: white button,
// border, official Google "G" SVG icon, navy text. The office login
// no longer uses it: /office-login is email and password only, no
// Google (user order 2026-11-25).
import Link from "next/link";

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5.1L1.3 17.2C3.3 21.2 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.3 6.8C.5 8.4 0 10.1 0 12s.5 3.6 1.3 5.2l3.9-2.9z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.8 1.3 6.8l3.9 2.9c.9-2.9 3.6-5 6.8-5z" />
    </svg>
  );
}

type GoogleButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function GoogleButton({ label, href, onClick, disabled }: GoogleButtonProps) {
  const cls =
    "bg-white border border-gray-300 text-navy font-semibold px-4 py-2.5 rounded min-h-[48px] inline-flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-gray-50";
  if (href) {
    return (
      <Link href={href} className={cls}>
        <GoogleIcon />
        {label}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cls}>
      <GoogleIcon />
      {label}
    </button>
  );
}
