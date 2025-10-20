export interface ReadabilityMetrics {
  words: number;
  characters: number;
  readability: number;
  readabilityLabel: string;
}

export function calculateReadability(text: string): ReadabilityMetrics {
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const characters = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const syllables = countSyllables(text);

  const fleschScore = sentences > 0 && words > 0
    ? 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    : 100;

  const readabilityPercent = Math.max(0, Math.min(100, Math.round(fleschScore)));

  let label = 'Very Easy';
  if (readabilityPercent < 30) label = 'Very Hard';
  else if (readabilityPercent < 50) label = 'Hard';
  else if (readabilityPercent < 60) label = 'Moderate';
  else if (readabilityPercent < 70) label = 'Easy';

  return {
    words,
    characters,
    readability: readabilityPercent,
    readabilityLabel: label
  };
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;

  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (cleanWord.length === 0) continue;

    const vowels = cleanWord.match(/[aeiouy]+/g);
    let count = vowels ? vowels.length : 0;

    if (cleanWord.endsWith('e') && count > 1) count--;
    if (count === 0) count = 1;

    syllableCount += count;
  }

  return syllableCount;
}
