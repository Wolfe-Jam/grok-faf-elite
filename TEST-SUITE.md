# ONE-CLICK Test Suite
**Championship-Grade Validation**

## Test Matrix: 10 Repos

| # | Repo | Type | Has README | Has package.json | Expected Result |
|---|------|------|------------|------------------|-----------------|
| 1 | **Wolfe-Jam/test-faf-demo** | Existing .faf | ✅ | ✅ | 100% Trophy (existing) |
| 2 | **facebook/react** | Large OSS | ✅ | ✅ | Generate ~85%+ |
| 3 | **vercel/next.js** | Next.js | ✅ | ✅ | Detect Next.js stack |
| 4 | **sveltejs/kit** | Svelte | ✅ | ✅ | Detect Svelte stack |
| 5 | **python/cpython** | Python | ✅ | ❌ | Metadata-only (no package.json) |
| 6 | **rust-lang/rust** | Rust | ✅ | ❌ | Metadata-only (Cargo.toml) |
| 7 | **torvalds/linux** | C/Kernel | ✅ | ❌ | Metadata-only (descriptive name) |
| 8 | **Wolfe-Jam/grok-faf-elite** | This repo! | ✅ | ✅ | Generate ~95%+ |
| 9 | **Wolfe-Jam/claude-faf-mcp** | MCP Server | ✅ | ✅ | Generate ~100% |
| 10 | **new-test-repo-2026** | Empty repo | ❌ | ❌ | Metadata-only ~20-30% |

## Test Scenarios

### Scenario 1: Existing project.faf
**Repo:** Wolfe-Jam/test-faf-demo
- [x] Check for existing .faf
- [x] Score it (100%)
- [x] Show "✅ Existing project.faf"
- [x] "View on GitHub" link works
- [x] Green progress bar
- [x] Juice UP button available

### Scenario 2: Large OSS (React)
**Repo:** facebook/react
- [ ] Fetch README ✅
- [ ] Fetch package.json ✅
- [ ] Generate with Rust WASM
- [ ] Extract WHO/WHAT/WHY from README
- [ ] Detect "React" stack
- [ ] Score 85%+
- [ ] OAuth → Commit (skip - don't pollute React repo)
- [ ] Performance: <5ms generation

### Scenario 3: Framework Detection (Next.js)
**Repo:** vercel/next.js
- [ ] Detect "Next.js" from package.json
- [ ] Extract comprehensive README
- [ ] Smart name: "next-js" → descriptive
- [ ] Score 85%+

### Scenario 4: Svelte Framework
**Repo:** sveltejs/kit
- [ ] Detect "Svelte" stack
- [ ] Extract README patterns
- [ ] Smart name: "kit" → abstract (no inference)
- [ ] Score 80%+

### Scenario 5: Python (No package.json)
**Repo:** python/cpython
- [ ] README exists ✅
- [ ] No package.json → metadata-only
- [ ] Extract WHO/WHAT/WHY from README
- [ ] Score 60-70% (good README compensates)

### Scenario 6: Rust (Cargo.toml)
**Repo:** rust-lang/rust
- [ ] README exists ✅
- [ ] No package.json (has Cargo.toml)
- [ ] Language: "Rust" from GitHub API
- [ ] Score 60-70%

### Scenario 7: Kernel (Descriptive Name)
**Repo:** torvalds/linux
- [ ] Smart name: "linux" → descriptive? No (single word)
- [ ] README comprehensive
- [ ] Metadata-only
- [ ] Score 65%+

### Scenario 8: This Repo (Dogfooding)
**Repo:** Wolfe-Jam/grok-faf-elite
- [ ] Detect SvelteKit
- [ ] Extract README
- [ ] Smart name: "grok-faf-elite" → descriptive ✅
- [ ] Score 95%+
- [ ] Already has .faf? Check existing vs generate

### Scenario 9: MCP Server (High Quality)
**Repo:** Wolfe-Jam/claude-faf-mcp
- [ ] Detect Node.js/TypeScript
- [ ] Extract comprehensive README
- [ ] Smart name: "claude-faf-mcp" → descriptive ✅
- [ ] Score 100% potential
- [ ] Already has .faf (check existing)

### Scenario 10: Empty Repo
**Repo:** Create new-test-repo-2026
- [ ] No README
- [ ] No package.json
- [ ] Metadata-only (name, description from GitHub)
- [ ] Score 20-30%
- [ ] Still commits successfully

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Rust WASM Generation | <5ms | ___ms |
| Zig WASM Scoring | <100μs | ___μs |
| Total (Gen + Score) | <10ms | ___ms |
| GitHub API Fetch | <500ms | ___ms |
| OAuth Flow | <3s | ___s |
| Commit Success | <2s | ___s |

## Edge Cases

### Test 11: Private Repo
- [ ] User doesn't have access
- [ ] Falls back to metadata-only
- [ ] Warns user about limited context
- [ ] Still generates and commits

### Test 12: Invalid URL
- [ ] Non-GitHub URL → Error
- [ ] Malformed URL → Error
- [ ] 404 repo → "Repository not found"

### Test 13: Already Has .faf
- [ ] Detects existing file
- [ ] Shows score
- [ ] Doesn't offer "Initialize"
- [ ] Offers "Juice UP" at 100%

### Test 14: WASM Not Loaded
- [ ] User clicks too fast
- [ ] Shows "WASM not loaded yet - please wait"
- [ ] Graceful error, no crash

## Success Criteria

- ✅ All 10 repos generate valid .faf YAML
- ✅ Scores are reasonable (not all 100%, not all 0%)
- ✅ Smart name extraction works (descriptive vs abstract)
- ✅ Performance targets met (<5ms generation)
- ✅ No crashes or undefined errors
- ✅ OAuth flow completes successfully
- ✅ Commits appear in GitHub
- ✅ UI updates correctly (progress bar, buttons)

## Testing Protocol

1. **Manual Testing First** (10 repos)
2. **Record Results** (fill in table)
3. **Fix Issues** (if any)
4. **Automated Tests** (later - E2E with Playwright)
5. **Production Deploy** (when all pass)

---

**Test Status:** NOT STARTED
**Last Updated:** 2026-02-04
**Tester:** wolfejam + Claude Sonnet 4.5
**Build:** DOUBLE-WHAMMY v1.0.1

🏎️ **CHAMPIONSHIP TESTING - WHEN BRAKES MUST WORK FLAWLESSLY**
