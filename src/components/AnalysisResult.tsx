import { AlertTriangle, Ban, Info } from "lucide-react";
import type { DetectionResult } from "@/types/detection";
import { RiskBadge } from "./RiskBadge";
import { RiskMeter } from "./RiskMeter";

interface AnalysisResultProps {
  result: DetectionResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <RiskBadge level={result.riskLevel} size="lg" />
        <span className="font-mono text-xs text-muted-foreground">
          {result.timestamp.toLocaleTimeString()}
        </span>
      </div>

      {/* Risk Meter */}
      <RiskMeter score={result.score} />

      {/* Warning */}
      {result.warningMessage && (
        <div
          className={`rounded-lg border p-4 font-mono text-sm ${
            result.riskLevel === "malicious"
              ? "border-malicious/30 bg-malicious/5 text-malicious"
              : "border-suspicious/30 bg-suspicious/5 text-suspicious"
          }`}
        >
          <div className="flex gap-3">
            {result.blocked ? <Ban className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p>{result.warningMessage}</p>
          </div>
        </div>
      )}

      {/* Safe response */}
      {result.riskLevel === "safe" && (
        <div className="rounded-lg border border-safe/30 bg-safe/5 p-4 font-mono text-sm text-safe">
          <div className="flex gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p>✅ Prompt verified as safe. No injection patterns detected. This prompt can be safely processed by the AI system.</p>
          </div>
        </div>
      )}

      {/* Triggered Rules */}
      {result.triggeredRules.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Triggered Rules ({result.triggeredRules.length})
          </h4>
          <div className="space-y-2">
            {result.triggeredRules.map((rule, i) => (
              <div
                key={i}
                className="rounded-md border border-border bg-muted/50 p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-foreground">{rule.ruleName}</span>
                  <RiskBadge level={rule.riskLevel} size="sm" />
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Category: {rule.category}
                </div>
                <div className="font-mono text-xs">
                  <span className="text-muted-foreground">Match: </span>
                  <code className="px-1.5 py-0.5 rounded bg-background text-foreground">
                    {rule.matchedText}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normalized Prompt */}
      <div className="space-y-2">
        <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          Normalized Input
        </h4>
        <pre className="rounded-md border border-border bg-muted/50 p-3 font-mono text-xs text-secondary-foreground whitespace-pre-wrap break-words">
          {result.normalizedPrompt}
        </pre>
      </div>
    </div>
  );
}
