Simanga Mchunu portfolio: static site, no build step.
Files: index.html, photo.jpg, Simanga_Mchunu_CV.pdf (keep all three in the same folder).
Vercel: vercel.com/new -> import the GitHub repo (or drag the folder in) -> Deploy.
Netlify: app.netlify.com/drop -> drag this folder onto the page.
GitHub Pages: put the three files at the repo root -> Settings > Pages > Deploy from branch (main, /root).
To update the CV, replace Simanga_Mchunu_CV.pdf keeping the same file name.
logo.png is the navbar logo (it also links back to the top of the page) and favicon.png is the browser tab icon.
api/jobs.js is a Vercel serverless function that feeds the Jobs tab (Arbeitnow, no API key). Keep the api folder next to index.html. zindi-logo.png is used on the Community card.
