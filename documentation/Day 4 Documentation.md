# Project Portfolio: The Puppy Artists BlogFolio
* **Author:** Gabriel Alistair Tandoc Estrada
* **Date:** August/22/2026
* **Phase:** 4 - Dynamic Photo Gallery, CMS Pathing, and Server Error Fixes

---

## 1. UI Design and Aesthetic:
* **Photo Grid Layout:** Finished up the layout for photos.html. Kept the retro window style but expanded the max-width so the gallery fits nicely.
* **Gallery Shielding:** Ensured the image shield is working over the photos to deter casual inspection and right-clicking.
* **Side-by-Side Rendering:** Fixed the script so new photos actually stack up next to the old ones instead of completely overriding the entire grid.

## 2. Architecture and Workflow:
* **CMS Photo Integration:** Hooked up the photos section to Decap CMS. Now it generates a `.md` file for the photo data and drops the image into an uploads folder.
* **Line-by-Line Parser:** Replaced the regex in my JavaScript with a line-by-line parser coz the YAML formatting from the CMS was acting weird and breaking the fetch script. 
* **Relative Pathing Fix:** Added a script adjustment to automatically strip the leading slash from the image paths so they load correctly as relative paths. 

## 3. Issues Faced:
* **Missing HTML Tags:** I forgot to add the `id="dynamic-photo-grid"` and the closing section tag on the HTML earlier, which made the whole container vanish... oops. I should have thought about this earlier when working on photos.html.
* **Pathing and Folder Desync:** Decap CMS was dropping images into an unexpected `assets/uploads/` folder. Took alotta manual checking in the GitHub repo and network tab to find the mismatch.
* **Cloudflare 500 Error:** Turns out uploading massive high-res pictures straight out of my Fujifilm X-T100 makes Cloudflare choke and throw an Internal Server Error coz the files are too huge.
* **Accidental Override:** The JS used `=` instead of `+=`, which completely wiped out my first test image when the new one loaded. Fixed it with just one character.

## 4. Roadmap:
* **Next Step:** Switch image hosting to Cloudflare R2 storage next time so I dont bloat the GitHub repo and crash the server again.
* **Phone Browser:** Work on this
* **NewsLetter:** Make Newsletter Widget 
* **Widgets and More Widgets:** Think of widgets to add to website to make it entertaining and not just a blog or portfolio.