import Link from "next/link";

// Privacy Policy for anngan.com. Short and plain: what the site
// collects (enquiries you send us), what it does with it, and how to
// reach the office. No legal wording is invented beyond the office
// facts already on the site.
export default function PrivacyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Privacy Policy</h1>
      <p className="text-gray-600 mt-1">Anngan Technologies Pvt. Ltd, Paragon City, Lahore.</p>
      <div className="mt-5 grid gap-4 text-base leading-relaxed">
        <p>
          When you send an enquiry through this website, we collect only what you type in the form:
          your name, phone number, and what you asked about. We use it only to call you back about
          that property or project.
        </p>
        <p>
          We do not sell your details to anyone, and we do not share them with other dealers or
          advertisers. Your details stay with the Anngan office.
        </p>
        <p>
          This website does not ask for payment details, bank details, or identity documents.
          Never send those through the website.
        </p>
        <p>
          If you want your enquiry deleted, call the office on +92 304 1111 698 or email
          info@anngan.com and we will remove it.
        </p>
        <p className="text-sm text-gray-600">
          Office: 57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore. Phone +92 304 1111 698.
          Email info@anngan.com.
        </p>
        <p>
          <Link href="/" className="text-anngan-dark font-semibold underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
