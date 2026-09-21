# Security

This project is a local creative tool. The included HTTP server binds to 127.0.0.1 and is for local development, not public production use. Do not expose it to the internet. Deploy the static `dist/` output with a maintained static hosting service if needed.

Presets are restricted JSON: scene and palette enums, finite bounded numbers, a pixel limit and an 8 KB import limit. Unknown fields are rejected. Imported strings are never interpolated into SVG or executable code. The standalone exporter embeds first-party engine source only.

There are no secrets, credentials, user accounts, remote APIs or telemetry in this repository. No external security audit has been completed. Runtime dependencies are absent, but browsers, Node.js and GitHub Actions still require normal updates.

For a security flaw, use GitHub's private vulnerability reporting **if enabled by the maintainer**. If that feature is unavailable, open a minimal issue requesting a private reporting channel without publishing the exploit or private information. Do not upload tokens, personal presets containing identifiers, or local file contents. Avoid a public proof of concept until coordinated disclosure.

Only the initial 0.1.x line is currently available. Fixes and timelines are best-effort.
