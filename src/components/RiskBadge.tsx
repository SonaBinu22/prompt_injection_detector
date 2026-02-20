import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { RiskLevel } from "@/types/detection";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}

const config = {
  safe: {
    icon: ShieldCheck,
    label: "SAFE",
    classes: "bg-safe/10 text-safe border-safe/30 glow-safe",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "SUSPICIOUS",
    classes: "bg-suspicious/10 text-suspicious border-suspicious/30 glow-warning",
  },
  malicious: {
    icon: ShieldX,
    label: "MALICIOUS",
    classes: "bg-malicious/10 text-malicious border-malicious/30 glow-danger",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const c = config[level];
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center font-mono font-semibold border rounded-full ${c.classes} ${sizeClasses[size]}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {c.label}
    </span>
  );
}
