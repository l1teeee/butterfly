export type Density = 1 | 2 | 3;

export const DENSITY_SEQUENCE: readonly Density[] = [1, 2, 1, 3];

export const GLYPHS_PER_CELL = 9;

export type GlyphTarget = {
  xPercent: number;
  yPercent: number;
  scale: number;
  visible: boolean;
};

const DENSITY_2_SLOTS: readonly (readonly [number, number])[] = [
  [-23, -23],
  [23, -23],
  [-23, 23],
  [23, 23],
];

const DENSITY_2_PARENTS: readonly number[] = [0, 2, 1, 3, 0];

const DENSITY_3_SLOTS: readonly (readonly [number, number])[] = [
  [-33, -33],
  [33, -33],
  [-33, 33],
  [33, 33],
  [0, -33],
  [-33, 0],
  [33, 0],
  [0, 33],
  [0, 0],
];

export function glyphTarget(density: Density, index: number): GlyphTarget {
  if (density === 1) {
    return {
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      visible: index === 0,
    };
  }

  if (density === 2) {
    if (index < 4) {
      const [xPercent, yPercent] = DENSITY_2_SLOTS[index];
      return {
        xPercent,
        yPercent,
        scale: 0.4,
        visible: true,
      };
    }
    const parentIndex = DENSITY_2_PARENTS[index - 4];
    const [xPercent, yPercent] = DENSITY_2_SLOTS[parentIndex];
    return {
      xPercent,
      yPercent,
      scale: 0.4,
      visible: false,
    };
  }

  const [xPercent, yPercent] = DENSITY_3_SLOTS[index];
  return {
    xPercent,
    yPercent,
    scale: 0.27,
    visible: true,
  };
}
