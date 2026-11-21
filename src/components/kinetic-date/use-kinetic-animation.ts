import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  DENSITY_SEQUENCE,
  glyphTarget,
  type Density,
} from "@/components/kinetic-date/glyph-layout";

gsap.registerPlugin(useGSAP);

const FIRST_STEP_MAX = 2.4;
const STEP_MIN = 1.8;
const STEP_MAX = 2.8;
const CELL_STAGGER = 0.08;
const MOVE_DURATION = 0.7;
const MOVE_EASE = "power3.inOut";

type CellState = {
  glyphs: HTMLElement[];
  density: Density;
};

type RowState = {
  cells: CellState[];
  phase: number;
};

export function useKineticAnimation(
  scopeRef: RefObject<HTMLDivElement | null>,
  dayKey: string | null,
): void {
  useGSAP(
    () => {
      if (
        dayKey === null ||
        scopeRef.current === null ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const rowElements = Array.from(
        scopeRef.current.querySelectorAll<HTMLElement>("[data-kinetic-row]"),
      );
      const allGlyphs: HTMLElement[] = [];

      const rows: RowState[] = rowElements.map((rowEl) => {
        const cellElements = Array.from(
          rowEl.querySelectorAll<HTMLElement>("[data-kinetic-cell]"),
        );
        const cells: CellState[] = cellElements.map((cellEl) => {
          const glyphs = Array.from(
            cellEl.querySelectorAll<HTMLElement>("[data-kinetic-glyph]"),
          );
          allGlyphs.push(...glyphs);
          return {
            glyphs,
            density: 1,
          };
        });
        return {
          cells,
          phase: 0,
        };
      });

      const setCellInstantly = (cell: CellState, density: Density) => {
        cell.glyphs.forEach((glyph, i) => {
          const target = glyphTarget(density, i);
          gsap.set(glyph, {
            xPercent: target.xPercent,
            yPercent: target.yPercent,
            scale: target.scale,
            rotation: 0,
            opacity: target.visible ? 1 : 0,
          });
        });
        cell.density = density;
      };

      const transitionCell = (cell: CellState, to: Density) => {
        gsap.killTweensOf(cell.glyphs);
        const from = cell.density;
        cell.density = to;

        cell.glyphs.forEach((glyph, i) => {
          const start = glyphTarget(from, i);
          const end = glyphTarget(to, i);

          if (!start.visible && !end.visible) {
            gsap.set(glyph, {
              xPercent: end.xPercent,
              yPercent: end.yPercent,
              scale: end.scale,
              rotation: 0,
              opacity: 0,
            });
            return;
          }

          if (end.visible && !start.visible) {
            gsap.set(glyph, { opacity: 1 });
          }

          gsap.to(glyph, {
            xPercent: end.xPercent,
            yPercent: end.yPercent,
            scale: end.scale,
            duration: MOVE_DURATION,
            ease: MOVE_EASE,
          });

          if (start.visible && !end.visible) {
            gsap.set(glyph, { opacity: 0, delay: MOVE_DURATION });
          }
        });
      };

      const stepRow = (row: RowState) => {
        row.phase = (row.phase + 1) % DENSITY_SEQUENCE.length;
        const nextDensity = DENSITY_SEQUENCE[row.phase];

        row.cells.forEach((cell, cellIndex) =>
          gsap.delayedCall(cellIndex * CELL_STAGGER, transitionCell, [
            cell,
            nextDensity,
          ]),
        );

        gsap.delayedCall(gsap.utils.random(STEP_MIN, STEP_MAX), stepRow, [row]);
      };

      rows.forEach((row) => {
        row.phase = gsap.utils.random(0, DENSITY_SEQUENCE.length - 1, 1);
        const initialDensity = DENSITY_SEQUENCE[row.phase];
        row.cells.forEach((cell) => {
          setCellInstantly(cell, initialDensity);
        });
        gsap.delayedCall(gsap.utils.random(0, FIRST_STEP_MAX), stepRow, [row]);
      });

      return () => {
        gsap.killTweensOf(stepRow);
        gsap.killTweensOf(transitionCell);
        gsap.killTweensOf(allGlyphs);
      };
    },
    { scope: scopeRef, dependencies: [dayKey], revertOnUpdate: true },
  );
}
