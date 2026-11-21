# Anngan App (real backend)

Next.js 14, React, TypeScript, Tailwind CSS, App Router. Backend: Firebase
Auth (Google), Firestore, Firebase Storage. The old static site in the repo
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

The owner must do these steps in the Firebase console (console.firebase.google.com).
No Firebase project exists yet. Do not invent one.

1. Create a project (any name, for example anngan).
2. Build > Authentication > Sign-in method > enable Google.
3. Build > Firestore Database > Create database > Production mode, location
   asia-south1 (or nearest).
4. Build > Storage > Get started.
5. Project settings > Your apps > Web app > copy the config values.
6. Copy `.env.local.example` to `.env.local` and fill in the 6 values.
7. Set the rules: `firebase deploy --only firestore:rules` (needs Firebase CLI
   and `firebase init firestore` once), or open Firestore > Rules in the
   console and paste the contents of `firestore.rules`.
8. Add the first office user: after the first Google sign-in, add a document
   in the `users` collection with the user uid as the document id and fields
   `email`, `name`, `role` (one of: Full access, Staff, View only).
9. Restart `npm run dev` and sign in at /admin/login with Continue with Google.

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
