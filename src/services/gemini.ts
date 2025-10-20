const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const HUMANIZE_PROMPT = `Your Role: Turn AI content into natural, readable text that feels human-written, not machine-generated.

Your Task: Rewrite this content at a 12th grade reading level. Make it easy to understand while keeping the same meaning. Switch between active and passive voice occasionally (40% of the time). Keep sentences concise and direct.

CRITICAL - Keep the word count VERY CLOSE to the original (within 1-2 words). Do not expand or elaborate.

Absolutely NO em dashes (—). Use periods, commas, or parentheses instead.

AVOID these overused AI words and phrases:
- Delve, underscore, pivotal, realm, harness, illuminate, shed light on
- Facilitate, refine, bolster, differentiate, streamline
- Revolutionize, innovative, cutting-edge, game-changing, transformative, seamless
- "That being said", "at its core", "to put it simply", "this underscores"
- "Generally speaking", "typically", "tends to", "arguably", "broadly speaking"

Writing Style:
- Take small creative risks with word choice (like "hands out comfort")
- Mix up sentence rhythms - avoid predictable patterns
- Use concrete, specific language over generic descriptions
- Add slight quirks that feel personal, not algorithmic
- Keep it simple but formal - no flowery language
- Make choices that sound deliberate, not template-based

Only output the rewritten sentence. No quotes, explanations, or extra text.`;

export async function humanizeWithGemini(sentence: string): Promise<string> {
  try {
    const wordCount = sentence.split(/\s+/).length;
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${HUMANIZE_PROMPT}\n\nOriginal sentence (${wordCount} words): ${sentence}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const humanizedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || sentence;

    return humanizedText.replace(/^["']|["']$/g, '').replace(/—/g, '-');
  } catch (error) {
    console.error('Gemini API error:', error);
    return sentence;
  }
}
