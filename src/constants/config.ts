import { Dimensions, Easing } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Splash duration. Exactly 8000ms — shorter values race the UI capture window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7600;

/** Sweetness targets: grams of sugar per gram of prepared fruit. */
export const SWEETNESS = {
  LIGHT: 0.55,
  BALANCED: 0.7,
  TRADITIONAL: 0.85,
} as const;
export type SweetnessKey = keyof typeof SWEETNESS;

export const SWEETNESS_ORDER: SweetnessKey[] = ['LIGHT', 'BALANCED', 'TRADITIONAL'];

/** Short chip captions — the full word TRADITIONAL overflows a third of a phone. */
export const SWEETNESS_LABEL: Record<SweetnessKey, string> = {
  LIGHT: 'LIGHT 55%',
  BALANCED: 'BALANCED 70%',
  TRADITIONAL: 'TRAD 85%',
};

/** Less sugar sets more slowly, so it needs proportionally more pectin. */
export const PECTIN_BOOST: Record<SweetnessKey, number> = {
  LIGHT: 1.25,
  BALANCED: 1.0,
  TRADITIONAL: 0.85,
};

/** ml of lemon juice per kg of prepared fruit, by the fruit's own acidity. */
export const ACID_NEED = { low: 30, med: 15, high: 0 } as const;

/** g of powdered pectin per kg of prepared fruit, by the fruit's own pectin. */
export const PECTIN_NEED = { low: 14, med: 7, high: 0 } as const;

export const WEIGHT_MIN = 200;
export const WEIGHT_MAX = 4000;
export const WEIGHT_STEP = 50;
export const WEIGHT_DEFAULT = 1000;

export const JAR_SIZES_ML = [110, 200, 250, 370, 500];
export const JAR_SIZE_DEFAULT = 250;
export const MAX_JARS_SHOWN = 8;

/** Water boiled off while the batch reduces, and the density of set jam. */
export const EVAPORATION = 0.75;
export const JAM_DENSITY = 1.33;

/** Set point at sea level, in Celsius (220 F). */
export const SET_POINT_C = 104.5;
export const START_TEMP_C = 92;
export const ALTITUDES_M = [0, 500, 1000, 1500];
export const ALTITUDE_DROP_C_PER_M = 0.5 / 150;

export const CLIMB_MS = 20000;
export const COLD_PLATE_SECONDS = 60;
export const TIMER_TICK_MS = 250;

export const SET_QUALITY = ['RUNNY', 'SOFT SET', 'FIRM'] as const;
export type SetQuality = (typeof SET_QUALITY)[number];

export const PANTRY_MONTHS_SHELF_LIFE = 18;
export const USE_SOON_DAYS = 60;
export const MAX_PANTRY_CARDS = 6;

/** Haptic detent strengths (requires the VIBRATE permission — it is in the manifest). */
export const HAPTIC_TICK_MS = 8;
export const HAPTIC_SET_MS = 30;

export const TIMING = {
  screenFade: 260,
  elementFade: 220,
  loaderExit: 320,
  jarFill: 350,
  jarStagger: 90,
  wobble: 420,
  glowLeg: 700,
  segment: 220,
  statStagger: 60,
};

export const SPRING = {
  soft: { tension: 44, friction: 8 },
  snappy: { tension: 320, friction: 14 },
  wobble: { tension: 120, friction: 6 },
  sheet: { tension: 50, friction: 9 },
  pop: { tension: 46, friction: 7 },
};

/** The syrupy ease used by every fill animation in the app. */
export const SYRUP_EASE = Easing.bezier(0.33, 0, 0.2, 1);

/** Board geometry for the jar shelf (parent padding + border are accounted for). */
export const JAR_COLS = 4;
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 12;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const JAR_TILE = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / JAR_COLS);
export const BOARD_W = JAR_TILE * JAR_COLS + 2 * BOARD_FRAME;

export const HEADER_TOP_PAD = 44;
export const HEADER_CONTENT_H = 72;
