// embeddings-utils.js
// Retrieve relevant Rules of Golf via keyword matching (MVP RAG)
// No external embeddings API needed

import rulesData from './rules-data.js'

// Simple keyword/relevance scoring
function scoreRelevance(question, rule) {
  const qLower = question.toLowerCase()
  const keywords = rule.keywords || []
  const content = (rule.content + ' ' + keywords.join(' ')).toLowerCase()

  // Exact keyword matches (highest score)
  let score = 0
  for (const keyword of keywords) {
    if (qLower.includes(keyword.toLowerCase())) {
      score += 3
    }
  }

  // Partial word matches
  const qWords = qLower.split(/\s+/)
  for (const word of qWords) {
    if (word.length > 3 && content.includes(word)) {
      score += 1
    }
  }

  return score
}

// Retrieve top-k relevant rules
async function retrieveRelevantRules(question, topK = 3) {
  const scored = rulesData.map(rule => ({
    ...rule,
    score: scoreRelevance(question, rule),
  }))

  return scored.sort((a, b) => b.score - a.score).slice(0, topK)
}

// Build augmented context from retrieved rules
function buildAugmentedContext(retrievedRules) {
  if (retrievedRules.length === 0) return ''

  const rulesText = retrievedRules
    .map(rule => `**${rule.ruleId}: ${rule.title}**\n${rule.content}`)
    .join('\n\n')

  return `Reference these official Rules of Golf 2023:\n\n${rulesText}`
}

export { retrieveRelevantRules, buildAugmentedContext }

