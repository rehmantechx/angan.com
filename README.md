# Anngan

Anngan (anngan.com) is a real estate service based in Paragon City, Lahore, Pakistan.
This is the coded rebuild of anngan.com as a clean, fast, multi-page static website.
No WordPress, no framework, no build step.

## Tech stack

- HTML5 + CSS3 + vanilla JavaScript, no framework
- Multi-page static site, one `.html` file per page
- GitHub Pages ready
- SEO, AEO and GEO only in the page head: title, meta description, geo meta,
  JSON-LD RealEstateAgent / WebSite schema. No visible SEO sections.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser.

Or open `index.html` directly in a browser.

## Project structure

```
index.html                  Home, search first
about.html                  About Anngan and FAQ
projects.html               All 7 projects
project-mgh.html            MGH Pakistan, Mangla
project-global.html         Global Homes Lahore (Zam Zam City)
project-alghani.html        Al Ghani Phase 7, Lahore
project-urban.html          Urban City, Lahore
project-chinatown.html      China Town, Lahore
project-grain.html          Pak China Grain Market, Multan (Coming Soon)
project-kashmir.html        Kashmir Modern City (Sold Out)
properties.html             Listings
agencies.html               Agencies and business partners
blogs.html                  Latest news and blogs
societies.html              Societies guide
contact.html                Contact
companies.html              Anngan Companies
angan-tech.html             Angan Tech (Anngan Technologies Pvt. Ltd)
angan-tech-*.html           One page per Angan Tech service (8 services)
create.html                 Create a Listing (preview only, no server, no payment)
assets/css/style.css        All styles, colours from anngan.com
assets/js/main.js           Menu drawer, search, listing preview, fade-in
assets/img/                 Real photos only, see SOURCES.md
admin/index.html            Private dashboard, office team only, Phase 1
admin/login.html            Temporary office login gate, see below
admin/js/gate.js            Temporary passcode gate, CHANGE THIS before sharing
admin/css/admin.css         Dashboard styles, white light theme
admin/js/data.js            Dashboard data, real listings, projects, blogs
admin/js/admin.js           Dashboard search, filter, add, edit, hide, delete
admin/js/firebase-config.js Firebase placeholder, NOT connected yet
```

## Dashboard, Phase 1, Day 1-2

The dashboard lives at `/admin/` in this same repo, live at
`https://rehmantechx.github.io/angan.com/admin/` after a Pages rebuild.
It opens at `admin/login.html` first. The dashboard is behind a
TEMPORARY office passcode gate until Firebase login is connected in
Day 3-4. The passcode is in `admin/js/gate.js` as
`OFFICE_PASSCODE = "CHANGE-THIS-CODE"`. CHANGE THIS to a code only
the office team knows before sharing the dashboard link, and do not
use a password used anywhere else. This gate is not real security:
anyone who can read the file can read the code, and it only stops a
casual visitor in that browser session. It must be replaced by
Firebase login, and the gate file deleted, in Day 3-4. Do not merge
or share the admin link as secure until then.
Firebase Auth and Firestore are Day 3-4 work, and
`admin/js/firebase-config.js` holds placeholder values only.
Until then, add, edit, hide and delete save in the browser only
(localStorage). Angan Tech has 9 real service pages, so the dashboard
shows 9. Counts everywhere are 12 listings (9 for sale, 3 for rent:
Lahore 7, Rawalpindi 2, Karachi 1, Multan 1, Islamabad 1), 7
projects, 13 agencies, 23 blogs, 9 Angan Tech services. The
Rs 35,000,000 house is not counted as a listing: it has no photo and
no published location.

## Deploy on GitHub Pages

1. Push to the `main` branch.
2. In the repository, go to Settings, Pages.
3. Under Build and deployment, choose Deploy from a branch, branch `main`, folder `/ (root)`.
4. Save. The site is live at `https://rehmantechx.github.io/angan.com/`.

## Colours

Red #DD3333, dark blue #004274, active tab #005F90, inactive tab #2F96CD,
bright blue #4FC9FF, gold #DDB78B, white header.

## Contact

Anngan, 57-S, 2nd Floor, Imperial Homes, Paragon City, Lahore, Pakistan.
Phone +92 304 1111 698. Email info@anngan.com.
