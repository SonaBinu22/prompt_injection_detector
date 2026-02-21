import type { DetectionRule, DetectionResult, RiskLevel, TriggeredRule } from "@/types/detection";

const DETECTION_RULES: DetectionRule[] = [
  // System prompt override attempts
  {
    id: "sys-override-1",
    name: "System Prompt Override",
    description: "Attempts to override system instructions",
    pattern: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules|directives)/i,
    riskLevel: "malicious",
    category: "System Override",
  },
  {
    id: "sys-override-2",
    name: "Role Reassignment",
    description: "Attempts to reassign AI role",
    pattern: /you\s+are\s+now\s+(a|an|the)\s+/i,
    riskLevel: "suspicious",
    category: "System Override",
  },
  {
    id: "sys-override-3",
    name: "New Instructions Injection",
    description: "Attempts to inject new system instructions",
    pattern: /\b(new\s+instructions|from\s+now\s+on|starting\s+now|forget\s+(everything|all|what))/i,
    riskLevel: "malicious",
    category: "System Override",
  },
  // Data exfiltration
  {
    id: "data-exfil-1",
    name: "System Prompt Extraction",
    description: "Attempts to extract system prompt",
    pattern: /\b(reveal|show|display|print|output|repeat|tell\s+me)\s+(your|the)\s+(system\s+)?(prompt|instructions|rules|configuration)/i,
    riskLevel: "malicious",
    category: "Data Exfiltration",
  },
  {
    id: "data-exfil-2",
    name: "Internal Info Request",
    description: "Requests internal system information",
    pattern: /\b(what\s+are\s+your|list\s+your|share\s+your)\s+(rules|constraints|limitations|guidelines|system\s+prompt)/i,
    riskLevel: "suspicious",
    category: "Data Exfiltration",
  },
  // Jailbreak patterns
  {
    id: "jailbreak-1",
    name: "DAN Pattern",
    description: "Do Anything Now jailbreak attempt",
    pattern: /\b(DAN|do\s+anything\s+now|developer\s+mode|jailbreak)\b/i,
    riskLevel: "malicious",
    category: "Jailbreak",
  },
  {
    id: "jailbreak-2",
    name: "Hypothetical Bypass",
    description: "Uses hypothetical framing to bypass restrictions",
    pattern: /\b(pretend|imagine|hypothetically|in\s+a\s+fictional|roleplay\s+as)\b.*\b(no\s+restrictions|no\s+rules|unrestricted|unfiltered)/i,
    riskLevel: "malicious",
    category: "Jailbreak",
  },
  // Encoding/obfuscation
  {
    id: "obfusc-1",
    name: "Base64 Injection",
    description: "Uses encoded text to hide instructions",
    pattern: /\b(base64|decode|encode|rot13|hex)\b.*\b(instruction|execute|run|eval)\b/i,
    riskLevel: "suspicious",
    category: "Obfuscation",
  },
  {
    id: "obfusc-2",
    name: "Unicode Manipulation",
    description: "Uses special characters to hide intent",
    pattern: /[\u200B-\u200F\u2028-\u202F\uFEFF]/,
    riskLevel: "suspicious",
    category: "Obfuscation",
  },
  // Delimiter injection
  {
    id: "delim-1",
    name: "Markdown Injection",
    description: "Uses markdown formatting to inject instructions",
    pattern: /```(system|admin|root|internal)\b/i,
    riskLevel: "malicious",
    category: "Delimiter Injection",
  },
  {
    id: "delim-2",
    name: "XML/HTML Tag Injection",
    description: "Injects XML or HTML-like tags for system manipulation",
    pattern: /<\s*(system|admin|instruction|override|prompt)\s*>/i,
    riskLevel: "malicious",
    category: "Delimiter Injection",
  },
  // Social engineering
  {
    id: "social-1",
    name: "Authority Impersonation",
    description: "Claims authority to change behavior",
    pattern: /\b(i\s+am\s+(your|the)\s+(developer|creator|admin|owner)|authorized\s+to|admin\s+override)\b/i,
    riskLevel: "malicious",
    category: "Social Engineering",
  },
  {
    id: "social-2",
    name: "Urgency Manipulation",
    description: "Uses urgency to bypass safety checks",
    pattern: /\b(urgent|emergency|critical|immediately)\b.*\b(bypass|skip|ignore|disable)\b.*\b(safety|filter|check|restriction)/i,
    riskLevel: "suspicious",
    category: "Social Engineering",
  },
];

function normalizePrompt(prompt: string): string {
  return prompt
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, "") // Remove zero-width chars
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

function calculateRiskScore(triggeredRules: TriggeredRule[]): number {
  if (triggeredRules.length === 0) return 0;

  let score = 0;
  for (const rule of triggeredRules) {
    switch (rule.riskLevel) {
      case "malicious": score += 40; break;
      case "suspicious": score += 20; break;
      default: score += 5;
    }
  }
  return Math.min(score, 100);
}

function determineRiskLevel(score: number, triggeredRules: TriggeredRule[]): RiskLevel {
  if (triggeredRules.some((r) => r.riskLevel === "malicious") || score >= 60) return "malicious";
  if (triggeredRules.some((r) => r.riskLevel === "suspicious") || score >= 30) return "suspicious";
  return "safe";
}

function getWarningMessage(riskLevel: RiskLevel, triggeredRules: TriggeredRule[]): string | undefined {
  if (riskLevel === "safe") return undefined;

  const categories = [...new Set(triggeredRules.map((r) => r.category))];

  if (riskLevel === "malicious") {
    return `⛔ This prompt has been BLOCKED. Detected ${triggeredRules.length} security violation(s) in: ${categories.join(", ")}. This input attempts to manipulate the AI system and cannot be processed.`;
  }

  return `⚠️ This prompt is SUSPICIOUS. Detected ${triggeredRules.length} potential risk(s) in: ${categories.join(", ")}. The input contains patterns that may attempt to influence AI behavior.`;
}

let idCounter = 0;

export function analyzePrompt(prompt: string): DetectionResult {
  const normalizedPrompt = normalizePrompt(prompt);
  const triggeredRules: TriggeredRule[] = [];

  for (const rule of DETECTION_RULES) {
    const match = normalizedPrompt.match(rule.pattern);
    if (match) {
      triggeredRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        riskLevel: rule.riskLevel,
        matchedText: match[0],
      });
    }
  }

  const score = calculateRiskScore(triggeredRules);
  const riskLevel = determineRiskLevel(score, triggeredRules);
  const blocked = riskLevel === "malicious";

  return {
    id: `analysis-${++idCounter}`,
    originalPrompt: prompt,
    normalizedPrompt,
    riskLevel,
    score,
    triggeredRules,
    timestamp: new Date(),
    blocked,
    warningMessage: getWarningMessage(riskLevel, triggeredRules),
  };
}
