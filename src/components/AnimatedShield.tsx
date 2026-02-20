import { useEffect, useState } from "react";

export function AnimatedShield() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute inset-2 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
      
      {/* Shield SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`relative z-10 w-full h-full drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-transform duration-1000 ${pulse ? "scale-105" : "scale-100"}`}
      >
        {/* Shield body */}
        <path
          d="M50 8 L85 25 L85 55 Q85 80 50 95 Q15 80 15 55 L15 25 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          className="opacity-80"
        />
        <path
          d="M50 8 L85 25 L85 55 Q85 80 50 95 Q15 80 15 55 L15 25 Z"
          fill="hsl(var(--primary))"
          className="opacity-10"
        />
        
        {/* Inner shield */}
        <path
          d="M50 18 L75 30 L75 52 Q75 72 50 85 Q25 72 25 52 L25 30 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          className="opacity-40"
          strokeDasharray="4 2"
        />

        {/* Checkmark */}
        <path
          d="M35 52 L46 63 L65 40"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-700 ${pulse ? "opacity-100" : "opacity-60"}`}
        />

        {/* Scanning line */}
        <line
          x1="20" y1="50" x2="80" y2="50"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          className="opacity-30"
        >
          <animate attributeName="y1" values="20;80;20" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20;80;20" dur="3s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 rounded-tl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/40 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/40 rounded-br" />
    </div>
  );
}
