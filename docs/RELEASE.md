# Releasing this project

This package is a release candidate. A ZIP archive or local Git repository is not evidence of a public GitHub release.

## Scope

Publish only this `soft-fascination-studio/` directory. Do not publish the separate private application notes. Do not merge the older `adam-project` personal/business documents, device configuration or history into this repository.

## Before publication

1. Review the implementation, MIT license and project name with the project owner.
2. Complete and record the manual acceptance checklist in VALIDATION.md.
3. Run `npm run build`, `npm run check`, `npm test`.
4. Create a separate GitHub repository named `soft-fascination-studio` under the owner's account, checking availability first. Make it public only after reviewing the exact contents.
5. Import the source directory, including dotfiles and generated studio.html. Use a real initial commit, without backdating or invented contributors.
6. Verify CI succeeds on Node 22 and 24. The included workflow runs tests and checks generated-source drift. Its actions follow the official usage examples for [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node), consulted on 2026-09-21. Consider pinning reviewed action revisions for a production policy.
7. Enable issues and private vulnerability reporting if available. Set description/topics and tag v0.1.0 only when the release is actually ready.

Suggested description: "Local-first generative visual loops for artists: rain, water and canopy, deterministic presets, SVG/PNG exports and offline playback."

Suggested topics: creative-coding, generative-art, svg, offline-first, javascript, art-tools, accessibility.

`package.json` uses `private: true` to prevent accidental npm publication. This has no effect on GitHub repository visibility or the MIT license. npm package publication is not required for source reuse.

A newly public project still lacks evidence of meaningful adoption and sustained maintenance. Do not claim that publication alone satisfies the Codex for Open Source program's selection priorities.
