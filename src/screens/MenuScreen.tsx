import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CookingPot, Jar, Notebook } from 'phosphor-react-native';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Chip from '../components/Chip';
import FruitTile from '../components/FruitTile';
import GinghamCorner from '../components/GinghamCorner';
import theme from '../constants/theme';
import assets, { spriteAt } from '../assets';
import { FRUITS, fruitByKey } from '../game/fruits';
import { SPRING, SWEETNESS_LABEL, SWEETNESS_ORDER, TIMING } from '../constants/config';
import type { SweetnessKey } from '../constants/config';

const SHEET_PAD = 18;
const GRID_GAP = 8;
const COLS = 4;

type Props = {
  fruitKey: string;
  sweetness: SweetnessKey;
  jarsInPantry: number;
  bestStars: number;
  onPickFruit: (key: string) => void;
  onPickSweetness: (key: SweetnessKey) => void;
  onStart: () => void;
  onPantry: () => void;
  onJournal: () => void;
};

export default function MenuScreen({
  fruitKey,
  sweetness,
  jarsInPantry,
  bestStars,
  onPickFruit,
  onPickSweetness,
  onStart,
  onPantry,
  onJournal,
}: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const compact = H < 700;

  const tileW = Math.floor((W - 2 * SHEET_PAD - (COLS - 1) * GRID_GAP) / COLS);
  const tileH = compact ? 52 : 64;
  const heroSprite = Math.max(84, Math.min(compact ? 130 : 170, Math.round(H * 0.19)));
  const artH = Math.round(H * 0.56);

  const rise = useRef(new Animated.Value(60)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;
  const heroPop = useRef(new Animated.Value(0.88)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rise, { toValue: 0, useNativeDriver: true, ...SPRING.sheet }).start();
    Animated.spring(heroPop, { toValue: 1, useNativeDriver: true, ...SPRING.soft }).start();
    Animated.timing(ctaFade, {
      toValue: 1,
      duration: TIMING.elementFade,
      delay: 220,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(wobble, { toValue: -1, duration: 1600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [rise, ctaFade, heroPop, wobble]);

  const selected = useMemo(() => fruitByKey(fruitKey), [fruitKey]);

  const tilt = wobble.interpolate({ inputRange: [-1, 1], outputRange: ['-2deg', '2deg'] });

  const pantryBadge = (
    <Pressable
      onPress={onPantry}
      accessibilityRole="button"
      accessibilityLabel="Pantry shelf"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.badge}>
      <Jar
        size={18}
        weight="duotone"
        color={theme.colors.text.muted}
        duotoneColor={theme.colors.berry.base}
      />
      <Text style={styles.badgeText} numberOfLines={1}>
        {jarsInPantry + ' JARS'}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <ImageBackground
        source={assets.bg}
        resizeMode="cover"
        style={[styles.art, { height: artH }]}>
        <LinearGradient
          colors={theme.gradients.artFade}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View style={styles.column}>
        <ScreenHeader
          title="JAM SET RATIO"
          tone="light"
          transparent
          contentHeight={44}
          leftSlot={<View style={styles.wordmarkSlot} />}
          rightSlot={pantryBadge}
        />

        <View style={styles.hero}>
          <Animated.View
            pointerEvents="none"
            style={{ transform: [{ scale: heroPop }, { rotate: tilt }] }}>
            <Image
              source={spriteAt(selected.sprite)}
              style={{ width: heroSprite, height: heroSprite }}
              resizeMode="contain"
            />
          </Animated.View>
          {bestStars > 0 ? (
            <Text style={styles.bestLine} numberOfLines={1}>
              {'BEST SET: ' + bestStars + ' STARS'}
            </Text>
          ) : null}
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, { transform: [{ translateY: rise }] }]}>
          <GinghamCorner corner="topLeft" size={56} />
          <GinghamCorner corner="bottomRight" size={56} />

          <View pointerEvents="none" style={styles.handle} />

          <Text style={[styles.title, compact ? styles.titleCompact : null]} numberOfLines={1}>
            CHOOSE YOUR FRUIT
          </Text>
          <Text style={styles.tagline} numberOfLines={1}>
            Pick it, weigh it, set it.
          </Text>

          <View style={[styles.grid, compact ? styles.gapCompact : styles.gapRoomy]}>
            {FRUITS.map(fruit => (
              <FruitTile
                key={fruit.key}
                fruit={fruit}
                selected={fruit.key === fruitKey}
                onPress={onPickFruit}
                size={tileW}
                height={tileH}
              />
            ))}
          </View>

          <View style={[styles.chips, compact ? styles.gapCompact : styles.gapRoomy]}>
            {SWEETNESS_ORDER.map(key => (
              <Chip
                key={key}
                flex
                label={SWEETNESS_LABEL[key]}
                active={key === sweetness}
                onPress={() => onPickSweetness(key)}
              />
            ))}
          </View>

          <Text style={styles.hint} numberOfLines={1}>
            {selected.short.toUpperCase() + ' · SUGAR, ACID AND PECTIN IN ONE TAP'}
          </Text>

          <Animated.View pointerEvents="box-none" style={{ opacity: ctaFade }}>
            <PrimaryButton
              label="START BATCH"
              Icon={CookingPot}
              onPress={onStart}
              height={compact ? 54 : 60}
            />
          </Animated.View>

          <View style={[styles.secondaryRow, compact ? styles.gapCompact : styles.gapRoomy]}>
            <View style={styles.secondarySlot}>
              <SecondaryButton
                label="PANTRY SHELF"
                Icon={Jar}
                onPress={onPantry}
                height={compact ? 44 : 48}
              />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton
                label="JOURNAL"
                Icon={Notebook}
                onPress={onJournal}
                height={compact ? 44 : 48}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  art: { position: 'absolute', top: 0, left: 0, right: 0 },
  column: { flex: 1 },
  wordmarkSlot: { width: 44, height: 44 },
  badge: {
    height: 40,
    minWidth: 112,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(58,22,38,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(248,217,211,0.30)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.onDark,
  },
  hero: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestLine: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  sheet: {
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: SHEET_PAD,
    paddingTop: 12,
    paddingBottom: 16,
    ...theme.shadow.sheet,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    marginBottom: 8,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
  },
  titleCompact: { fontSize: 21 },
  tagline: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  gapCompact: { marginTop: 9 },
  gapRoomy: { marginTop: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  chips: { flexDirection: 'row', gap: 10 },
  hint: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  secondaryRow: { flexDirection: 'row', gap: 12 },
  secondarySlot: { flex: 1 },
});
