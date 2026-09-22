# Static hosting

Current public demo: https://adambsp-git.github.io/soft-fascination-studio/

Run `npm run build`, `npm run check`, then `npm test` before deployment.

## GitHub Pages from a branch

This repository commits a self-contained `index.html`. In repository Settings → Pages, select Deploy from a branch, branch `main`, folder `/ (root)`, and save. GitHub publishes the generated editor without dependencies. Rebuild and commit `index.html` and `studio.html` when changing source. Enable hosting only on the intended public project repository.

## Other static hosts

Upload the contents of `dist/`. `dist/index.html` loads `web/style.css` and `web/app.js` relative to its URL. Module imports also use relative paths, so an origin root or a prefix such as `/soft-fascination-studio/` works. Preserve the `web/` and `src/` directories. No server-side code, credentials or environment variables are needed.

## Offline use

Download `studio.html` and open it in a desktop browser. All code, styles and presets are embedded. Nothing is fetched. Exported loop players also work offline. Browser-specific restrictions on local downloads may require `npm start`.

## Deployment acceptance

Confirm all three starter buttons render a scene; modify a seed; undo and redo; switch languages; play and pause; export a still and a preset. Check developer-console errors and the network panel on the actual hosting URL. Automated path tests do not replace these browser checks.
