import {
  Cherries,
  CirclesThree,
  CirclesFour,
  CirclesThreePlus,
  Circle,
  CircleHalf,
  Orange,
  OrangeSlice,
  Egg,
  Tree,
  Flower,
  Plant,
} from 'phosphor-react-native';
import type { Icon } from 'phosphor-react-native';

export type Level = 'low' | 'med' | 'high';

export type Fruit = {
  key: string;
  name: string;
  short: string;
  pectin: Level;
  acid: Level;
  Icon: Icon;
  /** 1..5 — which Codex sprite reads closest to this fruit. */
  sprite: number;
};

export const FRUITS: Fruit[] = [
  { key: 'strawberry', name: 'STRAWBERRY', short: 'Strawberry', pectin: 'low', acid: 'low', Icon: Cherries, sprite: 1 },
  { key: 'raspberry', name: 'RASPBERRY', short: 'Raspberry', pectin: 'low', acid: 'med', Icon: CirclesThree, sprite: 1 },
  { key: 'blackberry', name: 'BLACKBERRY', short: 'Blackberry', pectin: 'med', acid: 'med', Icon: CirclesFour, sprite: 2 },
  { key: 'blueberry', name: 'BLUEBERRY', short: 'Blueberry', pectin: 'low', acid: 'low', Icon: Circle, sprite: 2 },
  { key: 'sourcherry', name: 'SOUR CHERRY', short: 'Sour cherry', pectin: 'low', acid: 'high', Icon: CircleHalf, sprite: 3 },
  { key: 'apricot', name: 'APRICOT', short: 'Apricot', pectin: 'med', acid: 'med', Icon: Orange, sprite: 3 },
  { key: 'peach', name: 'PEACH', short: 'Peach', pectin: 'low', acid: 'low', Icon: OrangeSlice, sprite: 3 },
  { key: 'plum', name: 'PLUM', short: 'Plum', pectin: 'high', acid: 'med', Icon: Egg, sprite: 4 },
  { key: 'apple', name: 'APPLE', short: 'Apple', pectin: 'high', acid: 'med', Icon: Tree, sprite: 4 },
  { key: 'quince', name: 'QUINCE', short: 'Quince', pectin: 'high', acid: 'high', Icon: Flower, sprite: 4 },
  { key: 'blackcurrant', name: 'BLACKCURRANT', short: 'Blackcurrant', pectin: 'high', acid: 'high', Icon: CirclesThreePlus, sprite: 5 },
  { key: 'rhubarb', name: 'RHUBARB', short: 'Rhubarb', pectin: 'low', acid: 'high', Icon: Plant, sprite: 5 },
];

export const DEFAULT_FRUIT_KEY = 'strawberry';

export function fruitByKey(key: string): Fruit {
  const found = FRUITS.find(f => f.key === key);
  return found ? found : FRUITS[0];
}

export const LEVEL_LABEL: Record<Level, string> = {
  low: 'LOW',
  med: 'MED',
  high: 'HIGH',
};
