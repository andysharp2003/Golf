# Golf Caddie — Evaluation & Testing

## Test Suite Overview

### 1. Unit Tests (`npm test`)
Component logic and UI behavior — **fast, deterministic, disabled by default, no API calls**.

```bash
npm test
```

**Coverage:**
- `RulesChat.test.jsx` (15 tests) — chat UI, text/image input, SSE streaming
- `RulesAdvisor.test.jsx` (28 tests) — static rules reference data
- `App.test.jsx` (19 tests) — integration of all sections
- `YardageClub.test.jsx` (54 tests) — club recommendation logic
- `WeatherCard.test.jsx` (17 tests) — weather input, wind compass
- `CourseInfo.test.jsx` (10 tests) — course info input

**Result:** 143 tests pass

---

### 2. Contract Tests (`npm test`)
Verifies the Claude API is called with the correct configuration — **checks request shape, not output**.

```bash
npm test -- server.test.js
```

**Coverage (14 tests):**
- Model is `claude-opus-4-6` ✓
- System prompt contains Rules of Golf (2023) expertise ✓
- Max tokens: 1024 ✓
- Endpoint validates `messages` array ✓
- SSE streaming configured correctly ✓
- Error handling in place ✓

**Does NOT test:** Claude's actual golf rules advice

---

### 3. LLM Eval Tests (`npm run eval:rules`) — **OPT-IN**
Tests whether Claude actually gives correct golf rules answers — **requires API key, costs money, disabled by default**.

```bash
# Set API key first
export ANTHROPIC_API_KEY="sk-ant-..."

# Run evals
npm run eval:rules
```

**10 test cases** (one per Rules of Golf situation):
- Ball in penalty area → expects Rule 17, "penalty", "relief"
- Lost ball → expects Rule 18.2, "stroke and distance", "3 minutes"
- Unplayable lie → expects Rule 19, "unplayable", "penalty"
- Out of bounds → expects Rule 18.2
- Casual water → expects Rule 16.1, "free relief"
- Cart path → expects Rule 16.1, "free relief"
- Embedded ball → expects Rule 16.3, "embedded"
- Wrong ball → expects Rule 6.3c, "wrong ball"
- Loose impediments → expects Rule 15.1
- Wrong green → expects Rule 13.1f, "wrong green"

Each test case asserts that the response contains the expected rule number and key terms.

---

### 4. LLM-as-Judge Eval (`npm run eval:lm-judge`) — **OPT-IN**
Uses Claude as an evaluator to score response quality — **LLM evaluates LLM, requires API key, disabled by default**.

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
npm run eval:lm-judge
```

**5 test cases** with multi-dimensional scoring:

1. **Ball in penalty area**
   - Accuracy (1-10): Is the rule reference correct?
   - Clarity (1-10): Is it easy to understand?
   - Completeness (1-10): Are all options explained?
   - Actionability (1-10): Can a golfer use this on-course?
   - Threshold: average ≥ 7

2. **Lost ball**
   - Rule citation accuracy
   - Mentions 3-minute search rule
   - Practical guidance
   - Threshold: ≥ 7

3. **Unplayable lie**
   - Rule 19 application
   - All relief options explained (stroke & distance, back-on-line, lateral)
   - Penalty clarity
   - On-course practicality
   - Threshold: ≥ 7

4. **Casual water**
   - Rule 16.1 identification
   - "Free relief" explanation
   - Point of complete relief concept
   - Practicality
   - Threshold: ≥ 6.5

5. **Wrong ball**
   - Rule 6.3c citation
   - 2-stroke penalty in stroke play
   - Match play consequences
   - Clarity & actionability
   - Threshold: ≥ 7

Each criterion is scored 1-10 by Claude evaluating the original Claude response. Provides nuanced quality assessment rather than just keyword matching.

---

## Running All Tests

```bash
# Unit + contract tests (always safe)
npm test

# Simple keyword assertions (opt-in, requires ANTHROPIC_API_KEY)
npm run eval:rules

# LLM-as-judge quality scoring (opt-in, requires ANTHROPIC_API_KEY)
npm run eval:lm-judge

# Live app during development
npm run dev
```

## Files

- `promptfoo.config.js` — Keyword assertion eval (10 test cases)
- `promptfoo.lm-judge.config.js` — LLM-as-judge eval (5 test cases with 3-4 criteria each)
- `promptfoo.eval.json` — Alternative test cases format (JSON)
- `server.test.js` — Contract tests (14 tests)
- `src/test/*.test.jsx` — Component unit tests (129 tests)

## Notes

- **Unit/contract tests** run on every change, no cost, no API key needed
- **`eval:rules`** checks for rule references and keywords — fast, cheap, simple pass/fail
- **`eval:lm-judge`** uses Claude as a judge to score responses 1-10 on multiple criteria — more expensive, more nuanced
- Both eval types are opt-in (`npm run eval:*`) because they call Claude and incur API costs
- For a production golf app, you'd run LM-as-judge evals when training/tuning the system prompt


Created LLM-as-judge evals with:

npm run eval:lm-judge — 5 test cases where Claude evaluates Claude's golf rules responses on:

Test	Scoring Dimensions
Ball in penalty area	Accuracy, Clarity, Completeness, Actionability
Lost ball	Rule citation, 3-min rule mention, Practical guidance
Unplayable lie	Rule 19 application, All options covered, Penalty clarity, Practicality
Casual water	Rule 16.1 ID, "Free relief" explanation, Point of complete relief, Practicality
Wrong ball	Rule 6.3c citation, 2-stroke penalty clarity, Match play mention, Clarity
Each dimension scored 1-10 by Claude, threshold typically ≥7 to pass.

Promtfoo queries Claude, checks if the response contains "Rule 17" and "penalty", passes/fails.

Why it's useful:
Layer	Tests	Example
Unit tests	Code logic	"Does the button click work?"
Integration tests	API shape	"Does we call Claude with the right params?"
Evals	LLM quality	"Does Claude give correct golf rules?"
You had unit + contract tests. Evals add the final layer — does the LLM actually work well?

Promptfoo features:
Batch test cases (10+ scenarios)
Multiple scoring methods (contains, regex, classifier, webhook, custom rubrics)
Compare models side-by-side (Opus vs Sonnet performance)
Cost/latency tracking
Web UI dashboard