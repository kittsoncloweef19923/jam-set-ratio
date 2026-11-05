import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { SPRING, SYRUP_EASE, TIMING } from '../constants/config';

type Props = {
  /** 0..1 — how full this jar is. */
  fill: number;
  width: number;
  height: number;
  delay: number;
};

/**
 * Glass jar with a syrup level that rises bottom-up. The fill is a height
 * animation, so it runs with useNativeDriver:false; the completion wobble is a
 * rotation and runs natively.
 */
function JarGlyphBase({ fill, width, height, delay }: Props) {
  const lidH = Math.round(height * 0.14);
  const neckH = Math.round(height * 0.08);
  const bodyH = height - lidH - neckH;
  const bodyW = width;

  const level = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = Math.max(0, Math.min(1, fill)) * (bodyH - 6);
    const fillAnim = Animated.timing(level, {
      toValue: target,
      duration: TIMING.jarFill,
      delay,
      easing: SYRUP_EASE,
      useNativeDriver: false,
    });

    if (fill >= 0.999) {
      Animated.sequence([
        fillAnim,
        Animated.timing(tilt, {
          toValue: 1,
          duration: TIMING.wobble / 3,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tilt, {
          toValue: -0.75,
          duration: TIMING.wobble / 3,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(tilt, { toValue: 0, useNativeDriver: true, ...SPRING.wobble }),
      ]).start();
    } else {
      tilt.setValue(0);
      fillAnim.start();
    }
  }, [fill, bodyH, delay, level, tilt]);

  const rotate = tilt.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <Animated.View
      style={[styles.wrap, { width, height, transform: [{ rotate }] }]}>
      <View style={[styles.lid, { width: Math.round(bodyW * 0.78), height: lidH }]} />
      <View style={[styles.neck, { width: Math.round(bodyW * 0.62), height: neckH }]} />
      <View style={[styles.body, { width: bodyW, height: bodyH }]}>
        <Animated.View style={[styles.levelWrap, { height: level }]}>
          <LinearGradient
            colors={theme.gradients.syrup}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View pointerEvents="none" style={styles.shine} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'flex-end' },
  lid: {
    borderRadius: 4,
    backgroundColor: theme.colors.leaf,
    borderWidth: 1,
    borderColor: 'rgba(58,22,38,0.18)',
  },
  neck: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: theme.colors.border,
  },
  body: {
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(255,255,255,0.92)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  levelWrap: { width: '100%' },
  shine: {
    position: 'absolute',
    top: 6,
    left: 5,
    width: 4,
    height: '46%',
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});

export const JarGlyph = memo(JarGlyphBase);
export default JarGlyph;
