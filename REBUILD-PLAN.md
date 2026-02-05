# REBUILD PLAN - Fresh ScoreRepo.svelte
**Date:** Feb 5, 2026 2:11 AM
**Status:** Ready to execute

## THE PRODUCT
**Name:** FAF-Builder
**Domain:** builder.faf.one
**Purpose:** Get project.faf into every GitHub repo, ONE-CLICK

## THE 3 GOALS
1. ✅ Every visitor adds project.faf to a repo
2. 🏆 project.faf reaches 100% with bi-sync ON
3. 📣 They share score on X (optional, peer pressure)

## THE CLEAN FLOW

### STEP A (Initial - Always runs)
```
1. User enters GitHub repo URL
2. RUST-WASM generates project.faf (3ms)
3. ZIG-WASM scores it (14μs)
4. Show result modal with score
5. Two buttons:
   - [Add to GitHub] → OAuth → Commit (THE WIN)
   - [Download file] → Save dialog → Downloads folder (FALLBACK)
6. User has project.faf (in repo or on machine) ✅
```

### STEP B (Improvement - If score < 100%)
```
Modal shows: "75% - Missing: WHY, WHEN, HOW"
↓
Simple form: User fills 2-3 missing W's
↓
Run RUST-WASM again with new data
↓
New score: 100% 🏆
↓
Commit updated file (or download)
```

### Share on X (Optional)
```
Button: "Share your 100% 🏆 score on X"
Hope peer pressure = incentive
```

## TECHNICAL IMPLEMENTATION

### What to KEEP (Glue/Infrastructure)
- ✅ `/src/lib/wasm-loader.ts` - WASM orchestration (clean, works)
- ✅ `/src/routes/+layout.svelte` - WASM init on page load
- ✅ `/src/lib/components/Modal.svelte` - Modal wrapper (if clean)
- ✅ `/static/faf_wasm_sdk_bg.wasm` - Rust WASM (312KB, Feb 4 21:08)
- ✅ `/static/xai-faf-ghost.wasm` - Zig WASM (2.7KB, Feb 4 18:35)

### What to REMOVE (Old complexity)
- ❌ Spinning orange animations
- ❌ Multiple error boxes
- ❌ PATH A/B checking for existing files
- ❌ Try Another complexity
- ❌ Big Orange award code
- ❌ Extra API routes we don't use
- ❌ OAuth callback routes (using direct API)
- ❌ All old ScoreRepo.svelte code

### Fresh ScoreRepo.svelte (Build from scratch)

**File:** `/src/lib/components/ScoreRepo.svelte`

**Backup old:** Rename to `ScoreRepo.svelte.old`

**Props:**
```typescript
interface Props {
  initialUrl?: string;
}
```

**State:**
```typescript
let loading = $state(false);
let score = $state<number | null>(null);
let fafContent = $state('');
let repoName = $state('');
let repoOwner = $state('');
let missingFields = $state<string[]>([]);
```

**Functions needed:**
1. `generateProjectFaf()` - Call RUST-WASM via wasm-loader
2. `scoreProjectFaf()` - Call ZIG-WASM via wasm-loader
3. `commitToGitHub()` - OAuth → GitHub API direct commit
4. `downloadFile()` - Trigger browser download
5. `improveScore()` - Rerun with user-provided data

**UI Sections:**
1. Loading state (simple text, no spinners)
2. Result modal:
   - Score display (emoji, %, tier, repo name)
   - Two buttons: [Add to GitHub] [Download]
   - If < 100%: Improvement form (missing W's)
   - [Share on X] button
3. Success confirmation

## OAUTH FLOW (Standard GitHub)

**NOT using GitHub Actions** (future consideration)

**Using:** OAuth token + Direct GitHub API commit

```javascript
// Flow:
1. User clicks "Add to GitHub"
2. Redirect to GitHub OAuth:
   https://github.com/login/oauth/authorize?client_id=...&scope=repo
3. User clicks "Allow"
4. GitHub redirects back with code
5. Exchange code for token (server-side)
6. Use token to commit:
   PUT /repos/{owner}/{repo}/contents/project.faf
   Body: { message, content (base64), committer }
7. Done!
```

**Access control:** GitHub handles it via OAuth
- If user can pass OAuth → they can add the file
- If not → they can't (not our concern)

## DOWNLOAD FALLBACK

**Always available** - Works 100% of the time

```javascript
function downloadProjectFaf(content: string) {
  const blob = new Blob([content], { type: 'application/vnd.faf+yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.faf';
  a.click();
  URL.revokeObjectURL(url);
}
```

**UX:**
- Native browser "Save As" dialog
- Tip: "💡 Save in your repo root (where README.md is)"
- Worst case: Downloads folder (at least they have it)

## WASM DETAILS

**Rust WASM (faf_wasm_sdk_bg.wasm - 312KB)**
- Generates project.faf from repo data
- Has smart name extraction (descriptive vs abstract names)
- Has 6 W's extraction from README
- Produces high-quality files (target: 85-100% scores)

**Zig WASM (xai-faf-ghost.wasm - 2.7KB)**
- Scores project.faf files
- 14μs per score (71,428 scores/second)
- Returns score 0-100%

**Both loaded on page init** (in +layout.svelte)

## PERFORMANCE TARGETS

- RUST-WASM generation: 3ms
- ZIG-WASM scoring: 14μs
- OAuth flow: ~3 seconds (user clicks "Allow")
- Total time: ~3-5 seconds

**Too fast for spinners/previews** - Just show result when done

## SCREENS

**Screen-1 (Landing - Already exists)**
- Input field with repo URL
- "Score Your Repo" button
- Clear button (X) on input

**Screen-2 (Result Modal - Fresh build)**
- Trophy/emoji based on score
- Score % in big text
- Tier name (Trophy, Gold, Silver, etc.)
- Repo name
- Two primary buttons:
  - [Add to GitHub] (orange, primary)
  - [Download file] (secondary)
- If < 100%:
  - "Missing: WHY, WHEN, HOW"
  - Simple form to fill
  - [Regenerate] button
- [Share on X] button

## SUCCESS CRITERIA

✅ User enters URL
✅ WASM generates project.faf
✅ Score displays accurately
✅ OAuth commits to GitHub OR download works
✅ If < 100%, improvement form works
✅ Regeneration produces higher score
✅ No spinners, no old code, clean flow

## WORKING PROOF

**Test repo:** https://github.com/Wolfe-Jam/test-faf-demo
**Status:** ✅ Working (has project.faf committed by FAF Builder)
**Generated file:** Immaculate quality, 12/21 slots filled

## NEXT STEPS

1. Backup old ScoreRepo.svelte → ScoreRepo.svelte.old
2. Create fresh ScoreRepo.svelte from scratch
3. Implement WASM calls (wasm-loader.ts)
4. Implement OAuth flow (standard GitHub)
5. Implement download fallback
6. Test with test-faf-demo
7. Test with other repos
8. Deploy to builder.faf.one

---

**Built with:** DOUBLE-WHAMMY (Rust WASM + Zig WASM)
**GOAL:** Get project.faf everywhere 🍊
