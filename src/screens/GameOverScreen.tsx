import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CookingPot, Jar } from 'phosphor-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import StarRating from '../components/StarRating';
import SegmentedControl from '../components/SegmentedControl';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import GinghamCorner from '../components/GinghamCorner';
import theme from '../constants/theme';
import assets from '../assets';
import { SET_QUALITY, SPRING, TIMING } from '../constants/config';
import type { SetQuality } from '../constants/config';
import { formatDate, formatTempC, formatWeight } from '../utils/format';

const QUALITY_SEGMENTS: string[] = [...SET_QUALITY];

type Props = {
  fruitName: string;
  weightG: number;
  jars: number;
  reachedC: number;
  stars: number;
  onPlayAgain: () => void;
  onPantry: () => void;
  onMenu: () => void;
  onRate: (stars: number, quality: SetQuality) => void;
};

export default function GameOverScreen({
  fruitName,
  weightG,
  jars,
  reachedC,
  stars,
  onPlayAgain,
  onPantry,
  onMenu,
  onRate,
}: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const compact = H < 700;

  const [rating, setRating] = useState(stars);
  const [quality, setQuality] = useState(1);

  const pop = useRef(new Animated.Value(0.7)).current;
  const wobble = useRef(new Animated.Value(0)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const statsRise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, ...SPRING.pop }).start();
    Animated.sequence([
      Animated.timing(wobble, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: -1, duration: 180, useNativeDriver: true }),
      Animated.spring(wobble, { toValue: 0, useNativeDriver: true, ...SPRING.wobble }),
    ]).start();

    Animated.parallel([
      Animated.timing(statsFade, {
        toValue: 1,
        duration: TIMING.elementFade,
        delay: TIMING.statStagger,
        useNativeDriver: true,
      }),
      Animated.spring(statsRise, {
        toValue: 0,
        delay: TIMING.statStagger,
        useNativeDriver: true,
        ...SPRING.soft,
      }),
    ]).start();
  }, [pop, wobble, statsFade, statsRise]);

  const tilt = wobble.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });

  const cards = useMemo(() => {
    const out: { key: string; value: string; label: string; color: string }[] = [];
    if (jars > 0) {
      out.push({
        key: 'jars',
        value: String(jars),
        label: 'JARS',
        color: theme.colors.berry.base,
      });
    }
    out.push({
      key: 'set',
      value: formatTempC(reachedC),
      label: 'SET C',
      color: theme.colors.leaf,
    });
    out.push({
      key: 'quality',
      value: rating + '/5',
      label: 'SET QUALITY',
      color: theme.colors.terracotta,
    });
    return out;
  }, [jars, reachedC, rating]);

  const handleStars = (n: number) => {
    setRating(n);
    onRate(n, SET_QUALITY[quality]);
  };

  const handleQuality = (i: number) => {
    setQuality(i);
    onRate(rating, SET_QUALITY[i]);
  };

  const spriteSize = compact ? 92 : 116;

  return (
    <AppShell variant="gameover">
      <ScreenHeader
        title="BATCH JOURNAL"
        transparent
        contentHeight={44}
        rightSlot={<View style={styles.slot} />}
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="none"
          style={{ transform: [{ scale: pop }, { rotate: tilt }] }}>
          <Image
            source={assets.sprite2}
            style={{ width: spriteSize, height: spriteSize }}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.headingBlock}>
          <Text style={styles.heading} numberOfLines={1}>
            BATCH LOGGED
          </Text>
        </View>
        <View pointerEvents="none" style={styles.ribbon} />

        <Text style={styles.dateLine} numberOfLines={1}>
          {formatDate(new Date()) + ' · ' + fruitName + ' · ' + formatWeight(weightG)}
        </Text>

        {cards.length > 1 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.statsRow,
              { opacity: statsFade, transform: [{ translateY: statsRise }] },
            ]}>
            {cards.map(card => (
              <View key={card.key} style={styles.statSlot}>
                <StatCard value={card.value} label={card.label} color={card.color} />
              </View>
            ))}
          </Animated.View>
        ) : null}

        <Text style={styles.rateLabel} numberOfLines={1}>
          HOW DID IT SET?
        </Text>
        <StarRating value={rating} onChange={handleStars} size={compact ? 26 : 30} />

        <View style={styles.qualityWrap}>
          <SegmentedControl
            segments={QUALITY_SEGMENTS}
            value={quality}
            onChange={handleQuality}
            width={W - 40}
            height={compact ? 40 : 44}
          />
        </View>

        <View style={styles.ctaCard}>
          <GinghamCorner corner="topLeft" size={44} />
          <GinghamCorner corner="bottomRight" size={44} />
          <PrimaryButton
            label="COOK AGAIN"
            Icon={CookingPot}
            onPress={onPlayAgain}
            height={compact ? 54 : 58}
          />
          <View style={styles.secondaryRow}>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="PANTRY SHELF" Icon={Jar} onPress={onPantry} height={46} />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="BACK TO MENU" onPress={onMenu} height={46} />
            </View>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  slot: { width: 44, height: 44 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headingBlock: { paddingHorizontal: 8 },
  heading: {
    ...theme.typography.heroSmall,
    color: theme.colors.berry.base,
  },
  ribbon: {
    marginTop: 12,
    width: 92,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.terracotta,
  },
  dateLine: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  statsRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  statSlot: { flex: 1 },
  rateLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
  qualityWrap: { alignItems: 'center' },
  ctaCard: {
    alignSelf: 'stretch',
    padding: 14,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  secondaryRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  secondarySlot: { flex: 1 },
});
