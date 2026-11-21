# Anngan App (real backend)

Next.js 14, React, TypeScript, Tailwind CSS, App Router. Backend: Firebase
Auth (Google), Firestore. Firebase Storage is NOT enabled, so there is no
photo upload yet. The old static site in the repo
root stays live until this app is tested and the owner approves the switch.

## Run locally (no Firebase needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Firebase config the app runs on the real
seed data from the live site and shows a clear notice: "Firebase is not
connected. Showing saved site data." Changes made in the dashboard are saved
in the browser (localStorage) in this mode.

## Connect the real Firebase project

Real project, created 21 Nov 2026: **anngan**, project id **anngan-7a3ff**,
Firestore in Production mode, asia-south1, Google sign-in enabled, support
email pakmultilinks@gmail.com, Google Analytics off, Spark plan $0/month.
Storage is NOT enabled, by choice, do not upgrade to Blaze.

The config is in `anggan-app/.env.local` (local only, never committed).
`.env.local.example` holds placeholders only.

Rules: the first version of `firestore.rules` was published in the console
on 21 Nov 2026. The rules file in this repo has since been fixed (public
listings read needs a liveStatus filter, signed-in users may create pending
listings, first users self-register as View only). **Re-publish the rules
from this repo before the approval flow works**: open Firestore > Rules in
the console and paste the contents of `firestore.rules`, then Publish.

First office user, in order:
1. Sign in at /admin/login with Continue with Google (pakmultilinks@gmail.com).
   The app creates your own `users` document as View only, and shows your
   user id on the dashboard.
2. In the Firebase console, Firestore, collection `users`, open your document
   (id is your user id), set field `role` to `Full access`, save.
3. Sign out and sign in again. The dashboard now shows Full access.
4. In the dashboard Overview, click "Upload seed data to Firestore" once.
   It uploads 12 listings, 7 projects, 23 blogs, 13 agencies, 9 services
   and the office settings. If it fails, the button shows the exact error:
   the signed-in user needs the Full access role first.
5. Restart `npm run dev` if it was running when `.env.local` was added.

Photo upload is not built: Firebase Storage is not enabled, so new listings
use a real photo from `public/img/` (pick one in the form) or a photo link
pasted in the form. The office adds real photos after approval.

## Data

`lib/seed.ts` holds the real data copied from the live static site:
12 listings (9 for sale, 3 for rent), 7 projects, 13 agencies, 23 blogs
(newest 27 Feb 2023 to 21 Dec 2022), 9 Angan Tech services, office contact.

Two listings have no real photo and show no photo: Pak China Grain Market
(project, not a listing) and the Rs 35,000,000 house, which is not among the
12 real listings and is not included. All listing photos live in
`public/img/` and are copies of the real files from `assets/img/`.

## Deploy

Vercel: import the repo, set Root Directory to `anggan-app`, add the same 6
`NEXT_PUBLIC_FIREBASE_*` variables in Vercel > Settings > Environment
Variables, deploy. Domain switch only after the owner approves.
