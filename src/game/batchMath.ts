import {
  ACID_NEED,
  EVAPORATION,
  JAM_DENSITY,
  PECTIN_BOOST,
  PECTIN_NEED,
  SET_POINT_C,
  ALTITUDE_DROP_C_PER_M,
  SWEETNESS,
  WEIGHT_MAX,
  WEIGHT_MIN,
  WEIGHT_STEP,
} from '../constants/config';
import type { SweetnessKey } from '../constants/config';
import type { Fruit } from './fruits';

export type BatchInput = {
  fruit: Fruit;
  weightG: number;
  sweetness: SweetnessKey;
  jarSizeMl: number;
};

export type BatchResult = {
  sugarG: number;
  lemonMl: number;
  lemonTbsp: number;
  pectinG: number;
  pectinTsp: number;
  finishedMassG: number;
  volumeMl: number;
  fullJars: number;
  remainderMl: number;
  partialFill: number;
};

const round5 = (n: number) => Math.round(n / 5) * 5;
const round1 = (n: number) => Math.round(n * 10) / 10;

export function clampWeight(g: number): number {
  const stepped = Math.round(g / WEIGHT_STEP) * WEIGHT_STEP;
  return Math.max(WEIGHT_MIN, Math.min(WEIGHT_MAX, stepped));
}

export function computeBatch({ fruit, weightG, sweetness, jarSizeMl }: BatchInput): BatchResult {
  const kg = weightG / 1000;

  const sugarG = round5(weightG * SWEETNESS[sweetness]);
  const lemonMl = round1(kg * ACID_NEED[fruit.acid]);
  const pectinG = round1(kg * PECTIN_NEED[fruit.pectin] * PECTIN_BOOST[sweetness]);

  const finishedMassG = (weightG + sugarG) * EVAPORATION;
  const volumeMl = finishedMassG / JAM_DENSITY;

  const size = jarSizeMl > 0 ? jarSizeMl : 250;
  const fullJars = Math.floor(volumeMl / size);
  const remainderMl = Math.round(volumeMl - fullJars * size);

  return {
    sugarG,
    lemonMl,
    lemonTbsp: round1(lemonMl / 15),
    pectinG,
    pectinTsp: round1(pectinG / 5),
    finishedMassG: Math.round(finishedMassG),
    volumeMl: Math.round(volumeMl),
    fullJars,
    remainderMl,
    partialFill: Math.max(0, Math.min(1, remainderMl / size)),
  };
}

/** Jam sets 0.5 C lower for every 150 m of altitude. */
export function targetSetPointC(altitudeM: number): number {
  const target = SET_POINT_C - altitudeM * ALTITUDE_DROP_C_PER_M;
  return Math.round(target * 10) / 10;
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/** 1..5 stars from how close the finished batch landed to its set point. */
export function setQualityStars(reachedC: number, targetC: number): number {
  const delta = Math.abs(reachedC - targetC);
  if (delta <= 0.1) { return 5; }
  if (delta <= 0.4) { return 4; }
  if (delta <= 0.9) { return 3; }
  if (delta <= 1.6) { return 2; }
  return 1;
}
