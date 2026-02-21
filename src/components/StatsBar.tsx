import type { AnalysisStats } from "@/types/detection";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Ban } from "lucide-react";

interface StatsBarProps {
  stats: AnalysisStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: "Total", value: stats.total, icon: Shield, color: "text-foreground" },
    { label: "Safe", value: stats.safe, icon: ShieldCheck, color: "text-safe" },
    { label: "Suspicious", value: stats.suspicious, icon: ShieldAlert, color: "text-suspicious" },
    { label: "Malicious", value: stats.malicious, icon: ShieldX, color: "text-malicious" },
    { label: "Blocked", value: stats.blocked, icon: Ban, color: "text-malicious" },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border bg-card p-3 text-center"
        >
          <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
          <div className={`font-mono text-lg font-bold ${item.color}`}>{item.value}</div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
