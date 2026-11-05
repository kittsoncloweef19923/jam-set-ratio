import { useCallback, useMemo, useState } from 'react';
import { PANTRY_MONTHS_SHELF_LIFE, USE_SOON_DAYS } from '../constants/config';
import type { SetQuality } from '../constants/config';
import { addMonths, daysUntil } from '../utils/format';

export type BatchEntry = {
  id: string;
  fruitKey: string;
  fruitName: string;
  weightG: number;
  sweetness: string;
  jars: number;
  reachedC: number;
  stars: number;
  quality: SetQuality;
  cookedAt: Date;
  useBy: Date;
};

export type PantryShelfItem = {
  id: string;
  fruitName: string;
  jarsLeft: number;
  useBy: Date;
  soon: boolean;
};

let seq = 0;
const nextId = () => {
  seq += 1;
  return `batch-${seq}`;
};

function seedEntry(
  fruitKey: string,
  fruitName: string,
  jars: number,
  stars: number,
  quality: SetQuality,
  monthsAgo: number,
  reachedC: number,
): BatchEntry {
  const cookedAt = addMonths(new Date(), -monthsAgo);
  return {
    id: nextId(),
    fruitKey,
    fruitName,
    weightG: 1000 + jars * 50,
    sweetness: 'BALANCED',
    jars,
    reachedC,
    stars,
    quality,
    cookedAt,
    useBy: addMonths(cookedAt, PANTRY_MONTHS_SHELF_LIFE),
  };
}

const SEED: BatchEntry[] = [
  seedEntry('apricot', 'APRICOT', 5, 5, 'FIRM', 2, 104.5),
  seedEntry('rhubarb', 'RHUBARB', 4, 4, 'SOFT SET', 9, 104.2),
  seedEntry('quince', 'QUINCE', 3, 5, 'FIRM', 16, 104.6),
];

export type Pantry = {
  entries: BatchEntry[];
  shelf: PantryShelfItem[];
  totalJars: number;
  bestStars: number;
  addBatch: (entry: Omit<BatchEntry, 'id' | 'cookedAt' | 'useBy'>) => void;
};

/** In-memory journal + pantry shelf. Offline, nothing is persisted off-device. */
export function usePantry(): Pantry {
  const [entries, setEntries] = useState<BatchEntry[]>(SEED);

  const addBatch = useCallback(
    (entry: Omit<BatchEntry, 'id' | 'cookedAt' | 'useBy'>) => {
      const cookedAt = new Date();
      setEntries(prev => [
        {
          ...entry,
          id: nextId(),
          cookedAt,
          useBy: addMonths(cookedAt, PANTRY_MONTHS_SHELF_LIFE),
        },
        ...prev,
      ]);
    },
    [],
  );

  const shelf = useMemo<PantryShelfItem[]>(() => {
    const now = new Date();
    return entries.map(e => ({
      id: e.id,
      fruitName: e.fruitName,
      jarsLeft: e.jars,
      useBy: e.useBy,
      soon: daysUntil(e.useBy, now) < USE_SOON_DAYS,
    }));
  }, [entries]);

  const totalJars = useMemo(
    () => entries.reduce((sum, e) => sum + e.jars, 0),
    [entries],
  );

  const bestStars = useMemo(
    () => entries.reduce((best, e) => (e.stars > best ? e.stars : best), 0),
    [entries],
  );

  return { entries, shelf, totalJars, bestStars, addBatch };
}

export default usePantry;
