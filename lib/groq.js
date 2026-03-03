import Groq from 'groq-sdk';

// Singleton Groq client — never expose API key to the frontend
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Send a chat completion request to Groq (llama-3.1-8b-instant).
 *
 * @param {Array<{role: string, content: string}>} messages - Full conversation messages
 * @param {object} [options] - Override default parameters
 * @returns {Promise<string>} The assistant's reply text
 */
export async function chatCompletion(messages, options = {}) {
  const response = await groq.chat.completions.create({
    model: options.model || 'llama-3.1-8b-instant',
    messages,
    temperature: options.temperature ?? 0.6,
    max_tokens: options.max_tokens ?? 800,
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

export default groq;
