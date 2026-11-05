import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppShell from '../components/AppShell';
import theme from '../constants/theme';
import assets from '../assets';
import {
  LOADER_DURATION_MS,
  LOADER_PROGRESS_MS,
  SPRING,
  TIMING,
} from '../constants/config';

const BAR_W = 212;

type Props = { onDone: () => void };

/** Fixed pseudo-random sugar grains - a seeded layout, not a random one per frame. */
const GRAINS: { left: `${number}%`; top: `${number}%` }[] = [
  { left: '12%', top: '18%' },
  { left: '78%', top: '12%' },
  { left: '33%', top: '26%' },
  { left: '90%', top: '30%' },
  { left: '20%', top: '41%' },
  { left: '64%', top: '36%' },
  { left: '8%', top: '58%' },
  { left: '86%', top: '62%' },
  { left: '45%', top: '70%' },
  { left: '27%', top: '80%' },
  { left: '72%', top: '84%' },
  { left: '54%', top: '90%' },
  { left: '15%', top: '92%' },
  { left: '93%', top: '74%' },
];

export default function LoaderScreen({ onDone }: Props) {
  const badge = useRef(new Animated.Value(0.94)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleRise = useRef(new Animated.Value(18)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const caption = useRef(new Animated.Value(0.4)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const grains = useMemo(() => GRAINS, []);

  useEffect(() => {
    Animated.spring(badge, { toValue: 1, useNativeDriver: true, tension: 38, friction: 7 }).start();

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(badge, { toValue: 1.03, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(badge, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );

    Animated.parallel([
      Animated.timing(titleFade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(titleRise, { toValue: 0, useNativeDriver: true, ...SPRING.soft }),
    ]).start();

    // Width is a layout property — it must stay off the native driver.
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(caption, { toValue: 0.85, duration: 900, useNativeDriver: true }),
        Animated.timing(caption, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ]),
    );

    const breatheTimer = setTimeout(() => breathe.start(), 700);
    pulse.start();

    const exitTimer = setTimeout(() => {
      Animated.timing(exit, {
        toValue: 1,
        duration: TIMING.loaderExit,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS - TIMING.loaderExit);

    return () => {
      clearTimeout(breatheTimer);
      clearTimeout(exitTimer);
      breathe.stop();
      pulse.stop();
    };
  }, [badge, titleFade, titleRise, progress, caption, exit]);

  const screenOpacity = exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const screenScale = exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell variant="loader">
      <Animated.View
        style={[styles.root, { opacity: screenOpacity, transform: [{ scale: screenScale }] }]}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {grains.map((g, i) => (
            <View key={'grain-' + i} style={[styles.grain, g]} />
          ))}
        </View>

        <View style={styles.center}>
          <Animated.View style={[styles.badge, { transform: [{ scale: badge }] }]}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <Animated.Text
            style={[
              styles.title,
              { opacity: titleFade, transform: [{ translateY: titleRise }] },
            ]}>
            {'JAM SET RATIO'}
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, { opacity: titleFade }]}>
            {'SUGAR · ACID · PECTIN'}
          </Animated.Text>

          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <View pointerEvents="none" style={styles.barGloss} />
            </Animated.View>
          </View>

          <Animated.Text style={[styles.caption, { opacity: caption }]}>
            {'WARMING THE PAN...'}
          </Animated.Text>
        </View>

        <Text style={styles.footer}>{'LOADING'}</Text>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  grain: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(248,217,211,0.35)',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  badge: {
    width: 172,
    height: 172,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,245,238,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(248,217,211,0.26)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  logo: { width: 138, height: 138 },
  title: {
    marginTop: 28,
    ...theme.typography.hero,
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(194,24,91,0.55)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 4,
    color: theme.colors.text.muted,
    opacity: 0.72,
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(248,217,211,0.18)',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4, overflow: 'hidden' },
  barGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  caption: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(248,217,211,0.6)',
  },
  footer: {
    textAlign: 'center',
    marginBottom: 28,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 5,
    color: 'rgba(248,217,211,0.4)',
  },
});
