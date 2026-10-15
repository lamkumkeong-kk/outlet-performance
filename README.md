# Outlet performance dashboard

A single-page dashboard (`index.html`) that reads the **Combined** tab of a Google Sheet and shows
sales against target for each outlet and week. No frameworks and no build step.

## Deploy to Vercel

1. In Vercel, choose **Add New > Project** and import this repository.
2. Leave **Framework Preset** as *Other*, and leave the build command and output directory empty.
3. Before deploying, open **Settings > Environment Variables** and add:
   - `BASIC_AUTH_USER`: the username people will type in
   - `BASIC_AUTH_PASSWORD`: a long, unique password
4. Select **Deploy**. If you add or change the variables later, redeploy for them to take effect.

## Password protection

`middleware.js` is a Vercel Edge Middleware that asks for a username and password (HTTP Basic Auth)
before any page is served. The credentials live only in Vercel's environment variables, not in this
repository. If either variable is missing, the site returns a "locked" message instead of opening up.

Note: this protects the dashboard page. The Google Sheet it reads is still readable by anyone who
has its link, so share that link carefully.

## Data source

The sheet link and tab name are in the `CONFIG` block at the top of the script in `index.html`.
The sheet must be shared as **Anyone with the link can view** for the page to read it.

Expected columns: `outlet`, `week`, `sales`, `target`, `orders`, `returns`.

## Run locally

Open `index.html` in a browser, or serve the folder with `python3 -m http.server`.
