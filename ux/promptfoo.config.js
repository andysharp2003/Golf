// promptfoo.config.js
// LLM eval tests for golf rules advisor
// Run with: npx promptfoo eval -c promptfoo.config.js
// These tests require a valid ANTHROPIC_API_KEY and will call Claude

export default {
  testSuite: {
    tests: [
      {
        description: 'Ball in penalty area',
        vars: { situation: 'My ball landed in the water hazard. What are my options?' },
        assert: [
          { type: 'contains', value: 'Rule 17' },
          { type: 'contains', value: 'penalty' },
          { type: 'contains', value: 'relief' },
        ],
      },
      {
        description: 'Lost ball',
        vars: { situation: 'I can\'t find my ball after searching. What do I do?' },
        assert: [
          { type: 'contains', value: 'Rule 18.2' },
          { type: 'contains', value: 'stroke and distance' },
          { type: 'contains', value: '3 minutes' },
        ],
      },
      {
        description: 'Unplayable lie',
        vars: { situation: 'My ball is stuck under some roots and I can\'t swing. Can I move it?' },
        assert: [
          { type: 'contains', value: 'Rule 19' },
          { type: 'contains', value: 'unplayable' },
          { type: 'contains', value: 'penalty' },
        ],
      },
      {
        description: 'Out of bounds',
        vars: { situation: 'I think my ball went out of bounds. What\'s the penalty?' },
        assert: [
          { type: 'contains', value: 'Rule 18.2' },
          { type: 'contains', value: 'out of bounds' },
        ],
      },
      {
        description: 'Casual water (temporary water)',
        vars: { situation: 'There\'s a puddle in my stance. Do I get relief?' },
        assert: [
          { type: 'contains', value: 'Rule 16.1' },
          { type: 'contains', value: 'free relief' },
        ],
      },
      {
        description: 'Cart path (immovable obstruction)',
        vars: { situation: 'My ball is on a concrete cart path. Can I move it?' },
        assert: [
          { type: 'contains', value: 'Rule 16.1' },
          { type: 'contains', value: 'free relief' },
        ],
      },
      {
        description: 'Embedded ball',
        vars: { situation: 'My ball is plugged in the ground. Can I lift it without penalty?' },
        assert: [
          { type: 'contains', value: 'Rule 16.3' },
          { type: 'contains', value: 'embedded' },
          { type: 'contains', value: 'free relief' },
        ],
      },
      {
        description: 'Wrong ball played',
        vars: { situation: 'I just realized I played my opponent\'s ball. What\'s the penalty?' },
        assert: [
          { type: 'contains', value: 'Rule 6.3c' },
          { type: 'contains', value: 'wrong ball' },
        ],
      },
      {
        description: 'Loose impediments',
        vars: { situation: 'There are leaves around my ball. Can I move them?' },
        assert: [
          { type: 'contains', value: 'Rule 15.1' },
          { type: 'contains', value: 'loose impediments' },
        ],
      },
      {
        description: 'Wrong putting green',
        vars: { situation: 'My ball is on the wrong green. Do I have to play from here?' },
        assert: [
          { type: 'contains', value: 'Rule 13.1f' },
          { type: 'contains', value: 'wrong green' },
        ],
      },
    ],
  },

  providers: [
    {
      id: 'rules-advisor',
      config: {
        model: 'claude-opus-4-6',
        temperature: 0.7,
        max_tokens: 1024,
        system:
          'You are an expert golf rules official with deep knowledge of the Rules of Golf (2023 edition) as published by the R&A and USGA. When given a situation, identify the applicable rule by number, explain the golfer\'s options, state any penalty strokes, and offer a practical tip. Keep responses concise. Always cite the specific Rule number.',
      },
      prompts: [
        {
          raw: '{{ situation }}',
        },
      ],
    },
  ],
}
