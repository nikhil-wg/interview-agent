/**
 * Detect whether an AI reply is the final JSON evaluation.
 *
 * The model is instructed to return ONLY a JSON object as its last message.
 * This module robustly extracts and validates that JSON.
 */

const REQUIRED_FIELDS = [
  'technicalDepth',
  'problemSolving',
  'systemDesignThinking',
  'communicationClarity',
  'strengths',
  'weaknesses',
  'overallScore',
  'hireRecommendation',
  'summary',
];

/**
 * Try to parse the AI reply as the final evaluation JSON.
 *
 * @param {string} text - Raw AI reply
 * @returns {{ isEvaluation: boolean, evaluation: object|null }}
 */
export function detectEvaluation(text) {
  if (!text) return { isEvaluation: false, evaluation: null };

  const trimmed = text.trim();

  // Fast-fail: must start with { and end with }
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    // Sometimes the model wraps in ```json ... ```
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (codeBlockMatch) {
      return tryParse(codeBlockMatch[1]);
    }
    return { isEvaluation: false, evaluation: null };
  }

  return tryParse(trimmed);
}

/**
 * @param {string} jsonStr
 * @returns {{ isEvaluation: boolean, evaluation: object|null }}
 */
function tryParse(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);

    // Validate all required fields exist
    const hasAllFields = REQUIRED_FIELDS.every((field) => field in parsed);
    if (!hasAllFields) {
      return { isEvaluation: false, evaluation: null };
    }

    // Clamp numeric scores to 1-10
    for (const key of [
      'technicalDepth',
      'problemSolving',
      'systemDesignThinking',
      'communicationClarity',
      'overallScore',
    ]) {
      parsed[key] = Math.max(1, Math.min(10, Number(parsed[key]) || 1));
    }

    // Ensure arrays
    if (!Array.isArray(parsed.strengths)) parsed.strengths = [];
    if (!Array.isArray(parsed.weaknesses)) parsed.weaknesses = [];

    // Ensure valid hire recommendation
    const validRecs = ['Strong Hire', 'Hire', 'Borderline', 'No Hire'];
    if (!validRecs.includes(parsed.hireRecommendation)) {
      parsed.hireRecommendation = 'Borderline';
    }

    return { isEvaluation: true, evaluation: parsed };
  } catch {
    return { isEvaluation: false, evaluation: null };
  }
}
