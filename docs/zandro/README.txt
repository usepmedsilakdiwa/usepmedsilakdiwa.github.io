SILAKDIWA E-PORTFOLIO — V2

WHAT'S INCLUDED
- index.html: responsive portfolio homepage
- projects/project-1.html through project-6.html: editable project detail pages
- 404.html: custom not-found page
- css/silakdiwa.css: custom red/green/yellow/white visual system, responsive layout and motion
- js/main.js: native JavaScript for mobile navigation, project filtering, reveal animations and current year
- config/site-assets.json: central font and image reference manifest
- config/projects.json: project card content and image/link references
- images/usep-seal.png: supplied USEP seal
- fonts/README.txt and images/README.txt: asset instructions

FONTS
- Manrope Variable: headings and display text
- DM Sans Variable: body text and interface copy
Download WOFF2 variable font files and place them in /fonts using the filenames in fonts/README.txt.
No font binaries are bundled.

IMAGE MANAGEMENT
Use config/site-assets.json as the asset inventory for fonts and image usage.
Use config/projects.json as the editable source of project card titles, descriptions, categories, images and links.
The current homepage markup contains matching cards as a reliable static fallback; update both the JSON and matching card markup when changing card content. Image paths are relative to the site root.

USING WITH THE ORIGINAL THOMSON TEMPLATE
This package keeps the original Thomson theme's Bootstrap, Themify icon and main stylesheet references where practical.
Copy the new css/silakdiwa.css and js/main.js into the existing template. Keep the original plugins/, css/style.css and image folders.
The custom stylesheet should be loaded AFTER css/style.css.
If you do not have the original theme assets, the custom CSS still handles the main layout, but the Bootstrap and Themify files are not required by the new design.

404 PAGE
Upload 404.html to the website root. Static hosting providers commonly recognize this filename automatically. On Apache, you may add:
ErrorDocument 404 /404.html
For GitHub Pages, a root-level 404.html is recognized automatically. Other hosts may require setting the 404 document in hosting settings.

MOTION & ACCESSIBILITY
Animations use CSS transitions and IntersectionObserver only. The site respects prefers-reduced-motion, supports keyboard focus, has a skip link and accessible mobile navigation.
