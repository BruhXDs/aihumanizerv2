const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.com/v2/chat';

const HUMANIZE_PROMPT = `Your Role: Rewrite AI-generated text to sound more natural and conversational while maintaining professionalism.

Your Task: Revise this sentence for a 12th grade audience. Keep the core message intact but make it feel more authentic. Mix sentence structures (use passive voice 40% of the time). Be direct and clear.

CRITICAL - Match the original word count as closely as possible (within 1-2 words). Do not add extra explanation or padding.

Absolutely NO em dashes (—). Use commas, periods, or parentheses.

BANNED words and phrases (use alternatives):
- Delve/investigate (use: explore, look at, examine)
- Underscore/highlight (use: show, emphasize, point out)
- Pivotal/crucial (use: important, key, major)
- Realm/domain (use: area, field, space)
- Facilitate/enable (use: help, make easier, allow)
- Streamline/optimize (use: simplify, improve, speed up)
- Cutting-edge/innovative (be specific instead)
- "That being said" (use: however, but, still)
- "At its core" (use: basically, fundamentally, essentially)
- Typically, generally speaking, arguably (just state it directly)

Writing Approach:
- Use unexpected word pairings occasionally
- Vary sentence flow - some short, some longer
- Choose vivid, specific words over vague ones
- Sound like a person wrote it, not software
- Simple and formal, never flowery
- Avoid cookie-cutter transitions

Output only the revised sentence with no quotation marks or commentary.`;

export async function humanizeWithCohere(sentence: string): Promise<string> {
  try {
    const wordCount = sentence.split(/\s+/).length;
    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus-08-2024',
        messages: [
          {
            role: 'user',
            content: `${HUMANIZE_PROMPT}\n\nOriginal sentence (${wordCount} words): ${sentence}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    const humanizedText = data.message?.content?.[0]?.text?.trim() || sentence;

    return humanizedText.replace(/^["']|["']$/g, '').replace(/—/g, '-');
  } catch (error) {
    console.error('Cohere API error:', error);
    return sentence;
  }
}
