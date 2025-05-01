import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

function Logo({
  fontSize = "text-2xl",
  iconSize = 32,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  // Define some relative measurements for our SVG
  const strokeWidth = 2;
  const offset = iconSize * 0.1;
  const center = iconSize / 2;

  return (
    <Link href="/" className={cn("font-extrabold flex items-center gap-2", fontSize)}>
      <div
        className="rounded-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--ring))] p-2 flex items-center justify-center"
        style={{ width: iconSize + 16, height: iconSize + 16 }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox={`0 0 ${iconSize} ${iconSize}`}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top node */}
          <circle cx={center} cy={offset + strokeWidth} r={iconSize * 0.08} fill="white"/>
          {/* Left node */}
          <circle cx={offset + strokeWidth} cy={iconSize - offset - strokeWidth} r={iconSize * 0.08} fill="white"/>
          {/* Right node */}
          <circle cx={iconSize - offset - strokeWidth} cy={iconSize - offset - strokeWidth} r={iconSize * 0.08} fill="white"/>

          {/* Connections */}
          <line x1={center} y1={offset + strokeWidth*2 + iconSize*0.08}
                x2={offset + strokeWidth*2 + iconSize*0.08} y2={iconSize - offset - strokeWidth*2 - iconSize*0.08} />
          <line x1={center} y1={offset + strokeWidth*2 + iconSize*0.08}
                x2={iconSize - offset - strokeWidth*2 - iconSize*0.08} y2={iconSize - offset - strokeWidth*2 - iconSize*0.08} />
        </svg>
      </div>
      <div>
        <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--ring))] bg-clip-text text-transparent">
          Scrape
        </span>
        <span className="text-stone-700 dark:text-stone-300">Smart</span>
      </div>
    </Link>
  );
}

export default Logo;
