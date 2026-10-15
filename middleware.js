// Vercel Edge Middleware: HTTP Basic Auth for the whole site.
// Set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD in Vercel > Project > Settings > Environment Variables.
// If either is missing, the site stays locked rather than opening to everyone.

export const config = {
  matcher: "/(.*)",
};

const REALM = "Outlet performance";

function challenge() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

// Compares hashes of both values, so the comparison takes the same time
// whatever the input and the lengths never leak.
async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

function parseBasic(header) {
  if (!header || !header.startsWith("Basic ")) return null;
  try {
    const binary = atob(header.slice(6).trim());
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const i = decoded.indexOf(":");          // the password may itself contain ":"
    if (i < 0) return null;
    return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
  } catch {
    return null;
  }
}

export default async function middleware(request) {
  // trim() guards against a stray space or newline pasted into the Vercel value
  const expectedUser = (process.env.BASIC_AUTH_USER || "").trim();
  const expectedPass = (process.env.BASIC_AUTH_PASSWORD || "").trim();

  if (!expectedUser || !expectedPass) {
    const missing = [
      !expectedUser && "BASIC_AUTH_USER",
      !expectedPass && "BASIC_AUTH_PASSWORD",
    ].filter(Boolean).join(" and ");
    return new Response(
      `Site locked: ${missing} ${missing.includes(" and ") ? "are" : "is"} not visible to this deployment. ` +
      "Check the name, tick Production (and Preview), then redeploy.",
      { status: 503, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const creds = parseBasic(request.headers.get("authorization"));
  if (!creds) return challenge();

  const userOk = await safeEqual(creds.user, expectedUser);
  const passOk = await safeEqual(creds.pass, expectedPass);
  if (userOk && passOk) return; // no response: the request continues to the page

  return challenge();
}
