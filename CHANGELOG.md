# Changelog

All notable changes to builder.faf.one (grok-faf-elite) will be documented in this file.

## [0.7.0] - 2026-02-07

### Added
- WASM test marker for deployment verification
- Improved project.faf documentation
- Updated dependencies to latest versions

### Changed
- Updated to faf-wasm-sdk v1.2.2
- Enhanced project description and features
- Bumped AI-readiness score to 98%

### Technical
- Direct WASM copy to static/ (no npm caching issues)
- Version alignment across package.json and project.faf

## [0.6.0] - 2026-02-07

### Added
- GitHub OAuth integration for committing .faf files
- Environment variables setup for Vercel deployment

### Fixed
- Generic type slot count (9 → 12 slots)
- Test suite now 100% passing (4/4 tests)
- RESTAPI project scoring accuracy

## [0.5.0] - 2026-02-06

### Added
- Rust WASM generator (211KB, ~3ms generation)
- Zig WASM scorer (2.7KB, ~14μs scoring)
- DOUBLE-WHAMMY architecture (generate + score in browser)
- Real-time scoring display
- Download .faf functionality

### Features
- One-click .faf generation for any GitHub repo
- Automatic language and type detection
- Multi-language support (Python, JavaScript, Rust, Go, etc.)
- Project type detection (web-app, library, ml-research, etc.)

## [0.1.0] - 2026-01-28

### Initial Release
- Basic UI for FAF builder
- GitHub API integration
- SvelteKit 5 + Svelte 5 runes
- Tailwind CSS 4
- Vercel deployment
