import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import theme from '../constants/theme';
import {
  HAPTIC_TICK_MS,
  WEIGHT_MAX,
  WEIGHT_MIN,
  WEIGHT_STEP,
} from '../constants/config';

const TICK_W = 14;
const WHEEL_H = 56;

type Props = {
  value: number;
  onChange: (grams: number) => void;
  width: number;
};

/**
 * A 56px horizontal ruler. This is the ONLY ScrollView in the app and it is a
 * picker, never a page wrapper. The scroll offset is read from refs, never
 * mirrored into state — onChange fires once per crossed detent.
 */
function WeightWheelBase({ value, onChange, width }: Props) {
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let g = WEIGHT_MIN; g <= WEIGHT_MAX; g += WEIGHT_STEP) {
      out.push(g);
    }
    return out;
  }, []);

  const sidePad = Math.max(0, width / 2 - TICK_W / 2);
  const startIndex = Math.round((value - WEIGHT_MIN) / WEIGHT_STEP);
  const lastIndexRef = useRef(startIndex);
  const initialOffsetRef = useRef(startIndex * TICK_W);
  const scrollRef = useRef<ScrollView | null>(null);
  const centeredRef = useRef(false);

  const centerOnMount = useCallback(() => {
    if (centeredRef.current || !scrollRef.current) {
      return;
    }
    centeredRef.current = true;
    scrollRef.current.scrollTo({ x: initialOffsetRef.current, y: 0, animated: false });
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.max(0, Math.min(ticks.length - 1, Math.round(x / TICK_W)));
      if (index !== lastIndexRef.current) {
        lastIndexRef.current = index;
        Vibration.vibrate(HAPTIC_TICK_MS);
        onChange(WEIGHT_MIN + index * WEIGHT_STEP);
      }
    },
    [onChange, ticks.length],
  );

  return (
    <View style={[styles.wrap, { width }]}>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={centerOnMount}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={TICK_W}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={{ paddingHorizontal: sidePad }}
        style={{ width, height: WHEEL_H }}>
        {ticks.map(g => {
          const major = g % 500 === 0;
          return (
            <View key={g} style={styles.tickSlot}>
              <View
                style={[
                  styles.tick,
                  major ? styles.tickMajor : styles.tickMinor,
                ]}
              />
              {major ? (
                <Text style={styles.tickLabel} numberOfLines={1}>
                  {g >= 1000 ? `${g / 1000}k` : `${g}`}
                </Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <View pointerEvents="none" style={styles.marker}>
        <Svg width={14} height={10} viewBox="0 0 14 10">
          <Polygon points="7,10 0,0 14,0" fill={theme.colors.berry.base} />
        </Svg>
        <View style={styles.markerBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: WHEEL_H,
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  tickSlot: { width: TICK_W, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 12 },
  tick: { width: 2, borderRadius: 1 },
  tickMajor: { height: 22, backgroundColor: theme.colors.berry.base },
  tickMinor: { height: 11, backgroundColor: '#D9B7AE' },
  tickLabel: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  marker: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  markerBar: {
    width: 3,
    height: 40,
    borderRadius: 2,
    backgroundColor: theme.colors.berry.base,
  },
});

export const WeightWheel = memo(WeightWheelBase);
export default WeightWheel;
