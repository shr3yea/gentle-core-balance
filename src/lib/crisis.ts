export const CRISIS_MESSAGE =
  "I'm going to pause the reflection here. What you wrote sounds like you may be in real danger, and that deserves a person, not an exercise. Please reach out to a crisis line or someone you trust right now — you don't have to hold this alone.";

const CRISIS_PATTERNS: RegExp[] = [
  /\bkill\s+(my\s?self|myself|me)\b/i,
  /\bkill\s+(him|her|them|someone|everyone)\b/i,
  /\b(end|ending)\s+(my|it)\s+(life|all)\b/i,
  /\bend\s+it\s+all\b/i,
  /\btake\s+my\s+own\s+life\b/i,
  /\bsuicid(e|al)\b/i,
  /\bself[-\s]?harm\b/i,
  /\b(cut|cutting|burn|burning)\s+my\s?self\b/i,
  /\bhurt\s+(my\s?self|myself|someone|somebody|them|him|her)\b/i,
  /\bharm\s+(my\s?self|myself|others|someone)\b/i,
  /\b(don'?t|dont|do not)\s+want\s+to\s+(be\s+alive|live|exist)\b/i,
  /\bwant\s+to\s+(die|be\s+dead|disappear\s+forever)\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bno\s+reason\s+to\s+(live|be\s+here)\b/i,
  /\boverdose\b/i,
];

export function containsCrisisLanguage(text: string): boolean {
  const value = text ?? "";
  return CRISIS_PATTERNS.some((pattern) => pattern.test(value));
}
