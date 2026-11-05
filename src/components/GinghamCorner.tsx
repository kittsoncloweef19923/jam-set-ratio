import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  size?: number;
  color?: string;
};

/**
 * A skeuomorphic gingham check block built from four thin crossing stripes.
 * Purely decorative — never receives touches, never sits over text.
 */
function GinghamCornerBase({ corner, size = 52, color = 'rgba(194,24,91,0.07)' }: Props) {
  const stripe = Math.max(4, Math.round(size / 9));
  const step = Math.round(size / 4);

  const place =
    corner === 'topLeft'
      ? { top: 0, left: 0 }
      : corner === 'topRight'
      ? { top: 0, right: 0 }
      : corner === 'bottomLeft'
      ? { bottom: 0, left: 0 }
      : { bottom: 0, right: 0 };

  return (
    <View
      pointerEvents="none"
      style={[styles.wrap, place, { width: size, height: size }]}>
      <View style={[styles.h, { top: step, height: stripe, backgroundColor: color }]} />
      <View style={[styles.h, { top: step * 2 + stripe, height: stripe, backgroundColor: color }]} />
      <View style={[styles.v, { left: step, width: stripe, backgroundColor: color }]} />
      <View style={[styles.v, { left: step * 2 + stripe, width: stripe, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute' },
  h: { position: 'absolute', left: 0, right: 0 },
  v: { position: 'absolute', top: 0, bottom: 0 },
});

export const GinghamCorner = memo(GinghamCornerBase);
export default GinghamCorner;
