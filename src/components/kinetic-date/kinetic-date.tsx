"use client";

import { useRef, type CSSProperties } from "react";
import { dateLabel, dateRows } from "@/lib/date-rows";
import { useToday } from "@/hooks/use-today";
import { GLYPHS_PER_CELL } from "@/components/kinetic-date/glyph-layout";
import { useKineticAnimation } from "@/components/kinetic-date/use-kinetic-animation";

const GLYPH_INDEXES = Array.from(
  { length: GLYPHS_PER_CELL },
  (_, index) => index,
);

export function KineticDate() {
  const dayKey = useToday();
  const scopeRef = useRef<HTMLDivElement>(null);
  useKineticAnimation(scopeRef, dayKey);

  if (dayKey === null) return null;

  const rows = dateRows(dayKey);
  const cols = Math.max(...rows.map((row) => row.length));

  return (
    <div
      ref={scopeRef}
      className="kinetic-date"
      style={{ "--rows": rows.length, "--cols": cols } as CSSProperties}
    >
      <span className="sr-only">{dateLabel(dayKey)}</span>
      {rows.map((row, rowIndex) => (
        <div
          key={`${rowIndex}-${row}`}
          className="kinetic-row"
          data-kinetic-row
          aria-hidden="true"
        >
          {Array.from(row).map((char, cellIndex) => (
            <span key={cellIndex} className="kinetic-cell" data-kinetic-cell>
              {GLYPH_INDEXES.map((glyphIndex) => (
                <span
                  key={glyphIndex}
                  className="kinetic-glyph"
                  data-kinetic-glyph
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
