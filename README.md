# Outlet performance dashboard

A single-page dashboard (`index.html`) that reads the **Combined** tab of a Google Sheet and shows
sales against target for each outlet and week. No frameworks and no build step.

## Deploy to Vercel

1. In Vercel, choose **Add New > Project** and import this repository.
2. Leave **Framework Preset** as *Other*, and leave the build command and output directory empty.
3. Select **Deploy**.

## Data source

The sheet link and tab name are in the `CONFIG` block at the top of the script in `index.html`.
The sheet must be shared as **Anyone with the link can view** for the page to read it.

Expected columns: `outlet`, `week`, `sales`, `target`, `orders`, `returns`.

## Run locally

Open `index.html` in a browser, or serve the folder with `python3 -m http.server`.
