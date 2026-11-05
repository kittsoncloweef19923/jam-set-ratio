import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { START_TEMP_C, TIMING } from '../constants/config';

type Props = {
  currentC: number;
  targetC: number;
  reached: boolean;
  height?: number;
};

const SCALE_TOP_C = 106;

/**
 * Mercury is a height animation (JS driver), the set-point glow is an opacity
 * loop (native driver) — layout properties never go on the native driver.
 */
function ThermometerBase({ currentC, targetC, reached, height = 184 }: Props) {
  const bulb = 40;
  const stemH = height - bulb;
  const span = SCALE_TOP_C - START_TEMP_C;
  const ratio = Math.max(0, Math.min(1, (currentC - START_TEMP_C) / span));

  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!reached) {
      glow.stopAnimation();
      glow.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: TIMING.glowLeg, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: TIMING.glowLeg, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reached, glow]);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.6] });

  return (
    <View style={[styles.wrap, { height }]}>
      <View style={[styles.stemTrack, { height: stemH }]}>
        <View style={[styles.mercury, { height: Math.round((stemH - 8) * ratio) }]}>
          <LinearGradient
            colors={theme.gradients.mercury}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View pointerEvents="none" style={styles.stemShine} />
      </View>

      <View style={[styles.bulb, { width: bulb, height: bulb }]}>
        <LinearGradient
          colors={[theme.colors.berry.light, theme.colors.berry.deep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bulbFill}
        />
        {reached ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.bulbGlow, { opacity: glowOpacity }]}
          />
        ) : null}
      </View>

      <View pointerEvents="none" style={[styles.scale, { height: stemH }]}>
        <Text style={styles.scaleLabel}>{`${SCALE_TOP_C}`}</Text>
        <Text style={styles.scaleLabel}>{`${Math.round(targetC)}`}</Text>
        <Text style={styles.scaleLabel}>{'96'}</Text>
        <Text style={styles.scaleLabel}>{`${START_TEMP_C}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 70, alignItems: 'center', justifyContent: 'flex-end' },
  stemTrack: {
    width: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.divider,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: -8,
  },
  mercury: { width: '100%' },
  stemShine: {
    position: 'absolute',
    top: 8,
    left: 5,
    width: 4,
    height: '40%',
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  bulb: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulbFill: { ...StyleSheet.absoluteFillObject },
  bulbGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,245,238,0.75)',
  },
  scale: {
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  scaleLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
});

export const Thermometer = memo(ThermometerBase);
export default Thermometer;
