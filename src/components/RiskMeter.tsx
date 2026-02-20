import type { DetectionResult } from "@/types/detection";

interface RiskMeterProps {
  score: number;
}

export function RiskMeter({ score }: RiskMeterProps) {
  const getColor = () => {
    if (score >= 60) return "bg-malicious";
    if (score >= 30) return "bg-suspicious";
    return "bg-safe";
  };

  const getGlow = () => {
    if (score >= 60) return "shadow-[0_0_12px_hsl(var(--malicious)/0.5)]";
    if (score >= 30) return "shadow-[0_0_12px_hsl(var(--suspicious)/0.5)]";
    return "shadow-[0_0_12px_hsl(var(--safe)/0.5)]";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center font-mono text-xs text-muted-foreground">
        <span>RISK SCORE</span>
        <span className={score >= 60 ? "text-malicious" : score >= 30 ? "text-suspicious" : "text-safe"}>
          {score}/100
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()} ${getGlow()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60">
        <span>SAFE</span>
        <span>SUSPICIOUS</span>
        <span>MALICIOUS</span>
      </div>
    </div>
  );
}
