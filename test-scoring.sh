#!/bin/bash
# FAF Scoring Test Suite - Compare faf-cli vs builder.faf.one API
# 2-panel display: Left = faf-cli, Right = Our API

set -e

API_URL="https://builder.faf.one/api/score"
FAF_CLI="/Users/wolfejam/FAF/cli/dist/cli.js"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test a single .faf file
test_faf_file() {
    local file=$1
    local name=$(basename "$file" .faf)

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📄 Testing: $name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Left panel: faf-cli
    echo -e "${BLUE}┌─────────────────────────────────┬─────────────────────────────────┐${NC}"
    echo -e "${BLUE}│${NC}  FAF-CLI (Ground Truth)         ${BLUE}│${NC}  builder.faf.one API            ${BLUE}│${NC}"
    echo -e "${BLUE}├─────────────────────────────────┼─────────────────────────────────┤${NC}"

    # Get faf-cli score
    cli_output=$(cd /Users/wolfejam/FAF/cli && node "$FAF_CLI" score "$file" 2>/dev/null | grep -A 1 "Score:")
    cli_score=$(echo "$cli_output" | grep "Score:" | sed 's/.*Score: \([0-9]*\)%.*/\1/')
    cli_slots=$(echo "$cli_output" | grep "Filled:" | sed 's/.*Filled: \(.*\) slots/\1/')

    # Get API score
    api_response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"fafContent\":$(cat "$file" | jq -Rs .)}")
    api_score=$(echo "$api_response" | jq -r '.score')

    # Get project type from .faf
    project_type=$(grep "type:" "$file" | head -1 | sed 's/.*type: //' | tr -d ' ')

    # Display side-by-side
    printf "${BLUE}│${NC}  Score: %-22s ${BLUE}│${NC}  Score: %-22s ${BLUE}│${NC}\n" "$cli_score%" "$api_score%"
    printf "${BLUE}│${NC}  Slots: %-22s ${BLUE}│${NC}  Type: %-23s ${BLUE}│${NC}\n" "$cli_slots" "$project_type"

    # Compare and show result
    if [ "$cli_score" = "$api_score" ]; then
        echo -e "${BLUE}├─────────────────────────────────┴─────────────────────────────────┤${NC}"
        echo -e "${BLUE}│${NC} ${GREEN}✅ MATCH - Scores identical${NC}                                    ${BLUE}│${NC}"
    else
        diff=$((cli_score - api_score))
        echo -e "${BLUE}├─────────────────────────────────┴─────────────────────────────────┤${NC}"
        echo -e "${BLUE}│${NC} ${RED}❌ MISMATCH - Difference: ${diff}%${NC}                                ${BLUE}│${NC}"
    fi

    echo -e "${BLUE}└───────────────────────────────────────────────────────────────────┘${NC}"
}

# Main test runner
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 FAF Scoring Test Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Comparing: faf-cli (ground truth) vs builder.faf.one API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test files
TEST_FILES=(
    "/Users/wolfejam/Downloads/project (4).faf"
)

# Add more test files if they exist
if [ -f "/Users/wolfejam/Downloads/project (1).faf" ]; then
    TEST_FILES+=("/Users/wolfejam/Downloads/project (1).faf")
fi
if [ -f "/Users/wolfejam/Downloads/project (2).faf" ]; then
    TEST_FILES+=("/Users/wolfejam/Downloads/project (2).faf")
fi
if [ -f "/Users/wolfejam/Downloads/project (3).faf" ]; then
    TEST_FILES+=("/Users/wolfejam/Downloads/project (3).faf")
fi

# Run tests
TOTAL=0
PASSED=0

for file in "${TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        test_faf_file "$file"
        TOTAL=$((TOTAL + 1))

        # Check if it passed (simple check - could be enhanced)
        cli_score=$(cd /Users/wolfejam/FAF/cli && node "$FAF_CLI" score "$file" 2>/dev/null | grep "Score:" | sed 's/.*Score: \([0-9]*\)%.*/\1/')
        api_response=$(curl -s -X POST "$API_URL" \
            -H "Content-Type: application/json" \
            -d "{\"fafContent\":$(cat "$file" | jq -Rs .)}")
        api_score=$(echo "$api_response" | jq -r '.score')

        if [ "$cli_score" = "$api_score" ]; then
            PASSED=$((PASSED + 1))
        fi
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Results"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total tests: $TOTAL"
echo "Passed: $PASSED"
echo "Failed: $((TOTAL - PASSED))"

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}✅ All tests passed! Scoring matches faf-cli exactly.${NC}"
else
    echo -e "${RED}❌ Some tests failed. Scoring needs adjustment.${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
