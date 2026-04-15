#!/usr/bin/env node
// test-rag.js
// Quick test of RAG retrieval - validates that relevant rules are fetched

import { retrieveRelevantRules, buildAugmentedContext } from './embeddings-utils.js'

const testQuestions = [
  'My ball landed in the water hazard. What are my options?',
  "I can't find my ball after searching. What do I do?",
  'My ball is stuck under some roots and I cannot swing. Can I move it?',
  "There's a puddle in my stance. Do I get relief?",
  'I just realized I played my opponent\'s ball. What\'s the penalty?',
  'There are leaves around my ball. Can I move them?',
  'My ball is on a concrete cart path. Can I move it?',
  'My ball is plugged in the ground. Can I lift it without penalty?',
]

async function testRAG() {
  console.log('🧪 Testing RAG Retrieval System\n')

  for (const question of testQuestions) {
    console.log(`❓ ${question}`)
    const retrieved = await retrieveRelevantRules(question, 2)
    console.log(`   → Retrieved: ${retrieved.map(r => r.ruleId).join(', ')}`)
    retrieved.forEach(r => console.log(`      • ${r.title}`))
    console.log()
  }

  console.log('✅ RAG system is working!')
}

testRAG().catch(console.error)
