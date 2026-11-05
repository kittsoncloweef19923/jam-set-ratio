import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import {
  CLIMB_MS,
  COLD_PLATE_SECONDS,
  HAPTIC_SET_MS,
  START_TEMP_C,
  TIMER_TICK_MS,
} from '../constants/config';

type Options = { targetC: number };

export type SetPointTimer = {
  currentC: number;
  secondsLeft: number;
  running: boolean;
  reached: boolean;
  start: () => void;
  reset: () => void;
};

/**
 * Simulates the pan climbing to set point and runs the 60s cold-plate countdown.
 * Every value a callback reads lives in a ref, never in state (rule #8).
 */
export function useSetPointTimer({ targetC }: Options): SetPointTimer {
  const [currentC, setCurrentC] = useState(START_TEMP_C);
  const [secondsLeft, setSecondsLeft] = useState(COLD_PLATE_SECONDS);
  const [running, setRunning] = useState(false);
  const [reached, setReached] = useState(false);

  const startedAtRef = useRef(0);
  const targetRef = useRef(targetC);
  const reachedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  targetRef.current = targetC;

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    startedAtRef.current = 0;
    reachedRef.current = false;
    setRunning(false);
    setReached(false);
    setCurrentC(START_TEMP_C);
    setSecondsLeft(COLD_PLATE_SECONDS);
  }, [clear]);

  const start = useCallback(() => {
    clear();
    startedAtRef.current = Date.now();
    reachedRef.current = false;
    setRunning(true);
    setReached(false);
    setCurrentC(START_TEMP_C);
    setSecondsLeft(COLD_PLATE_SECONDS);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const climbT = Math.min(1, elapsed / CLIMB_MS);
      // Easing.out(cubic) evaluated by hand so the reading matches the mercury.
      const eased = 1 - Math.pow(1 - climbT, 3);
      const temp = START_TEMP_C + (targetRef.current - START_TEMP_C) * eased;
      setCurrentC(Math.round(temp * 10) / 10);

      if (!reachedRef.current && climbT >= 1) {
        reachedRef.current = true;
        setReached(true);
        Vibration.vibrate(HAPTIC_SET_MS);
      }

      const left = COLD_PLATE_SECONDS - Math.floor(elapsed / 1000);
      setSecondsLeft(Math.max(0, left));

      if (left <= 0) {
        clear();
        setRunning(false);
      }
    }, TIMER_TICK_MS);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { currentC, secondsLeft, running, reached, start, reset };
}

export default useSetPointTimer;
