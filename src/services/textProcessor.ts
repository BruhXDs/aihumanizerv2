import { humanizeWithGemini } from './gemini';
import { humanizeWithCohere } from './cohere';
import { humanizeWithMistral } from './mistral';

export function splitIntoSentences(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
}

export async function humanizeText(text: string, onProgress?: (progress: number) => void): Promise<string> {
  const sentences = splitIntoSentences(text);
  const humanizedSentences: string[] = [];

  const apis = [
    { name: 'Gemini', fn: humanizeWithGemini },
    { name: 'Cohere', fn: humanizeWithCohere },
    { name: 'Mistral', fn: humanizeWithMistral }
  ];

  for (let i = 0; i < sentences.length; i++) {
    const apiIndex = i % 3;
    const api = apis[apiIndex];

    try {
      const humanized = await api.fn(sentences[i]);
      humanizedSentences.push(humanized);
    } catch (error) {
      console.error(`Error with ${api.name}:`, error);
      humanizedSentences.push(sentences[i]);
    }

    if (onProgress) {
      onProgress(((i + 1) / sentences.length) * 100);
    }
  }

  return humanizedSentences.join(' ');
}
