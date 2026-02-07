# FAF-WASM Learning Phase Test Log

**Purpose:** Track scoring accuracy improvements during faf-WASM development
**Goal:** 100% match with faf-cli (ground truth)
**Protocol:** Run `./test-scoring.sh` before every commit

---

## Test Suite Overview

| Test | Type | Expected (faf-cli) | Description |
|------|------|-------------------|-------------|
| project (4) | library | 89% (8/9) | Grok-1 generated .faf |
| project (1) | RESTAPI | 8% (1/12) | Minimal RESTAPI .faf |
| project (2) | library | 100% (9/9) | test-faf-demo (complete) |
| project (3) | library | 100% (9/9) | Another complete library |

---

## Test Run History

### Run #3 - 2026-02-07 14:15 UTC
**Status:** 3/4 PASSED (75%) ✅ MAJOR IMPROVEMENT

**Changes:**
- Fixed TBD rejection bug
- Now matches faf-cli's exact empty value list
- Changed from rejecting 'TBD' to accepting it

**Results:**
| Test | faf-cli | Our API | Status | Notes |
|------|---------|---------|--------|-------|
| project (4) | 89% | 89% | ✅ PASS | Fixed! Was 78% before |
| project (1) | 8% | 11% | ❌ FAIL | 3% diff - needs investigation |
| project (2) | 100% | 100% | ✅ PASS | Fixed! Was 89% before |
| project (3) | 100% | 100% | ✅ PASS | Fixed! Was 89% before |

**Pass Rate:** 75% (up from 0%)

**Next Steps:**
- [ ] Investigate project (1) RESTAPI 3% difference
- [ ] Add more test cases (CLI, Frontend, ML types)
- [ ] Test with real-world repos beyond downloads

---

### Run #2 - 2026-02-07 14:05 UTC
**Status:** 0/4 PASSED (0%) ❌ ALL FAILED

**Changes:**
- Implemented type-based scoring (9-21 slots)
- Added multi-language support (Python, JS, Rust, Go, Ruby)

**Results:**
| Test | faf-cli | Our API | Status | Notes |
|------|---------|---------|--------|-------|
| project (4) | 89% | 78% | ❌ FAIL | 11% diff - TBD rejection issue |
| project (1) | 8% | 22% | ❌ FAIL | 14% diff - over-scoring |
| project (2) | 100% | 89% | ❌ FAIL | 11% diff - TBD rejection issue |
| project (3) | 100% | 89% | ❌ FAIL | 11% diff - TBD rejection issue |

**Pass Rate:** 0%

**Key Findings:**
- Consistent 11% difference on 3/4 tests
- Root cause: Rejecting 'TBD' when faf-cli accepts it
- Need to match faf-cli's exact empty value list

---

### Run #1 - 2026-02-07 13:50 UTC (Initial Baseline)
**Status:** Test suite created

**Initial Implementation:**
- Universal 12-slot system (WRONG APPROACH)
- Simple TBD/Unknown rejection
- No proper type-based scoring

**Key Issues Identified:**
- Not matching faf-cli's type-based slot allocation
- Too strict on empty value checking
- Missing multi-language dependency detection

---

## Known Issues

### Active Issues
1. **RESTAPI 3% difference (project 1)** - Status: Under investigation
   - faf-cli: 8% (1/12 slots)
   - Our API: 11%
   - Possible causes: Extra field counting, different type detection

### Resolved Issues
1. ✅ **TBD rejection causing 11% difference** - FIXED 2026-02-07
   - Changed from rejecting 'TBD' to accepting it
   - Now matches faf-cli's exact empty value list
   - Impact: 0% → 75% pass rate

---

## Improvement Metrics

| Date | Pass Rate | Changes |
|------|-----------|---------|
| 2026-02-07 14:15 | 75% (3/4) | Fixed TBD rejection ✅ |
| 2026-02-07 14:05 | 0% (0/4) | Implemented type-based scoring |
| 2026-02-07 13:50 | N/A | Test suite created |

**Target:** 100% (4/4)
**Current:** 75% (3/4)
**Remaining:** 1 test to fix

---

## Test Commands

```bash
# Run full test suite
./test-scoring.sh

# Test single file
cd /Users/wolfejam/FAF/cli
faf score /path/to/file.faf

# Compare with API
curl -s -X POST https://builder.faf.one/api/score \
  -H "Content-Type: application/json" \
  -d '{"fafContent":"..."}' | jq .
```

---

## Notes

- Always run tests before committing scoring changes
- Document all changes in this log
- Track pass rate improvements
- Focus on matching faf-cli behavior exactly, not "improving" it
- Test files location: `/Users/wolfejam/Downloads/project (1-4).faf`

---

*Last Updated: 2026-02-07 14:15 UTC*
*Learning Phase: ACTIVE* 🏎️

### Quick Log - 2026-02-07 15:27 UTC
**Status:** 3/4 PASSED (75%) ❌ FAIL


### Quick Log - 2026-02-07 15:32 UTC
**Status:** 3/4 PASSED (75%) ❌ FAIL


### Quick Log - 2026-02-07 15:57 UTC
**Status:** 4/4 PASSED (100%) ✅ PASS

