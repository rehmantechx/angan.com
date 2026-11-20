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
```

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
