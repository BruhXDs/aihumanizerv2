const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const HUMANIZE_PROMPT = `Your Role: Make AI-written text sound like it came from an actual person, not a language model.

Your Task: Rewrite at 12th grade level. Keep the meaning the same but make it sound natural. Occasionally flip between active and passive voice (40% passive). Be concise and straightforward, but not but not overly brief or choppy.

Avoid frequent use of semicolons, parentheses, or over-stylized punctuation.

CRITICAL - Keep word count nearly identical to the original (within 3-4 words max). No expansion, no filler.

NO em dashes (—) allowed. Use commas, periods, semicolons, or parentheses instead.

AVOID these AI-signature words/phrases:
- Delve, underscore, pivotal, realm, harness, illuminate
- Shed light on, facilitate, refine, bolster, differentiate
- Revolutionary, game-changing, cutting-edge, transformative, seamless integration
- "To put it simply", "that being said", "a key takeaway", "from a broader perspective"
- "Generally speaking", "typically", "tends to", "to some extent"

Style Guidelines:
- Make unexpected word choices that feel intentional
- Mix up rhythm and sentence length naturally
- Use specific, concrete language
- Write like you're explaining to a friend formally
- Add small personal touches that break the AI mold
- Keep it clean and professional, not over-stylized
- Avoid textbook patterns and safe phrasing

Return ONLY the rewritten sentence. No quotes, no explanations.`;

export async function humanizeWithMistral(sentence: string): Promise<string> {
  try {
    const wordCount = sentence.split(/\s+/).length;
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-medium-2508',
        messages: [
          {
            role: 'user',
            content: `${HUMANIZE_PROMPT}\n\nOriginal sentence (${wordCount} words): ${sentence}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const humanizedText = data.choices?.[0]?.message?.content?.trim() || sentence;

    return humanizedText.replace(/^["']|["']$/g, '').replace(/—/g, '-');
  } catch (error) {
    console.error('Mistral API error:', error);
    return sentence;
  }
}
