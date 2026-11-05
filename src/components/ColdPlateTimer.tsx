import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '../constants/theme';
import { COLD_PLATE_SECONDS } from '../constants/config';

type Props = {
  seconds: number;
  size?: number;
};

/**
 * The cold-plate countdown ring. The arc is driven straight from the 250ms
 * tick value, so the stroke and the digits can never disagree.
 */
function ColdPlateTimerBase({ seconds, size = 96 }: Props) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, seconds / COLD_PLATE_SECONDS));
  const offset = c * (1 - progress);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.divider}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.berry.base}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View pointerEvents="none" style={styles.center}>
        <Text style={styles.digits} numberOfLines={1}>
          {`${Math.round(seconds)}`}
        </Text>
        <Text style={styles.unit} numberOfLines={1}>
          {'SEC'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  digits: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
});

export const ColdPlateTimer = memo(ColdPlateTimerBase);
export default ColdPlateTimer;
