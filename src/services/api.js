// Provider boundary for future AI integrations.
// Swap `provider` to openai, gemini, or huggingface once a backend endpoint exists.
const providers = {
  openai: '/api/recommend/openai',
  gemini: '/api/recommend/gemini',
  huggingface: '/api/recommend/huggingface'
}

export async function requestAIRecommendation({ provider = 'openai', prompt, wardrobe }) {
  const endpoint = providers[provider]

  if (!endpoint) {
    throw new Error(`Unknown AI provider: ${provider}`)
  }

  throw new Error(
    `AI provider "${provider}" is not connected yet. Use the rule-based recommendation service until a backend endpoint is available.`
  )
}
