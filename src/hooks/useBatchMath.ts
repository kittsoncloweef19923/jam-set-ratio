import { useMemo } from 'react';
import { computeBatch } from '../game/batchMath';
import type { BatchInput, BatchResult } from '../game/batchMath';

/** Pure derived numbers — recomputed synchronously whenever an input changes. */
export function useBatchMath(input: BatchInput): BatchResult {
  const { fruit, weightG, sweetness, jarSizeMl } = input;
  return useMemo(
    () => computeBatch({ fruit, weightG, sweetness, jarSizeMl }),
    [fruit, weightG, sweetness, jarSizeMl],
  );
}

export default useBatchMath;
