// promptfoo.lm-judge.config.js
// Uses Claude as a judge to evaluate golf rules responses
// Run with: npx promptfoo eval -c promptfoo.lm-judge.config.js
// Requires: ANTHROPIC_API_KEY

export default {
  testSuite: {
    tests: [
      {
        description: 'Ball in penalty area — evaluate response quality',
        vars: {
          situation: 'My ball landed in the water hazard. What are my options?',
        },
        assert: [
          {
            type: 'llm-rubric',
            value: `You are an expert golf rules evaluator. Assess this golf ruling response on these criteria:
1. Accuracy: Is the rule reference correct for the situation?
2. Clarity: Is the explanation clear and easy to understand?
3. Completeness: Does it explain the player's options?
4. Actionability: Can a golfer use this advice on the course?

Respond with a JSON object: { accuracy: 1-10, clarity: 1-10, completeness: 1-10, actionability: 1-10, summary: "..." }

Only valid JSON, no other text.`,
            threshold: 7, // Average score must be ≥7
          },
        ],
      },
      {
        description: 'Lost ball — evaluate response quality',
        vars: {
          situation: "I can't find my ball after searching. What do I do?",
        },
        assert: [
          {
            type: 'llm-rubric',
            value: `Evaluate this golf ruling on a scale of 1-10:
- Does it correctly cite Rule 18.2?
- Does it mention the 3-minute search rule?
- Is the explanation practical and actionable?
- Would a golfer understand what to do next?

Respond with JSON: { rule_cite: 1-10, practical: 1-10, clarity: 1-10, summary: "..." }`,
            threshold: 7,
          },
        ],
      },
      {
        description: 'Unplayable lie — evaluate response quality',
        vars: {
          situation: 'My ball is stuck under some roots and I cannot swing. Can I move it?',
        },
        assert: [
          {
            type: 'llm-rubric',
            value: `Rate this golf ruling response:
1. Rule Accuracy: Is Rule 19 correctly applied?
2. Option Coverage: Does it explain all relief options (stroke & distance, back-on-line, lateral)?
3. Penalty Clarity: Is the penalty stroke explained?
4. Practical Guidance: Can a golfer follow this advice?

Score each 1-10. Respond with JSON only: { accuracy: X, coverage: X, penalty: X, practical: X }`,
            threshold: 7,
          },
        ],
      },
      {
        description: 'Casual water — evaluate response quality',
        vars: {
          situation: "There's a puddle in my stance. Do I get relief?",
        },
        assert: [
          {
            type: 'llm-rubric',
            value: `Evaluate this response about temporary water/casual water relief:
- Correctly identifies Rule 16.1 (free relief)?
- Explains what "free relief" means?
- Mentions the point of complete relief concept?
- Practical for on-course use?

JSON response: { rule: 1-10, clarity: 1-10, practical: 1-10, summary: "..." }`,
            threshold: 6.5,
          },
        ],
      },
      {
        description: 'Wrong ball — evaluate response quality',
        vars: {
          situation: "I just realized I played my opponent's ball. What's the penalty?",
        },
        assert: [
          {
            type: 'llm-rubric',
            value: `Judge this golf ruling on:
1. Does it cite Rule 6.3c correctly?
2. Does it explain the 2-stroke penalty in stroke play?
3. Does it mention match play consequences?
4. Is the advice clear and actionable?

Respond with JSON: { stroke_play: 1-10, match_play: 1-10, clarity: 1-10, actionability: 1-10 }`,
            threshold: 7,
          },
        ],
      },
    ],
  },

  providers: [
    {
      id: 'rules-advisor-judge',
      config: {
        model: 'claude-opus-4-6',
        temperature: 0.7,
        max_tokens: 1024,
        system:
          'You are an expert golf rules official with deep knowledge of the Rules of Golf (2023 edition). When given a situation, provide the specific rule number, explain options clearly, state penalty strokes, and offer practical advice.',
      },
      prompts: [
        {
          raw: '{{ situation }}',
        },
      ],
    },
  ],
}
