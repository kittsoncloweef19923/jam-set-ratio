import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  ArrowRight,
  CheckCircle,
  Cube,
  Drop,
  Leaf,
  Scales,
  Thermometer as ThermoIcon,
} from 'phosphor-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import SegmentedControl from '../components/SegmentedControl';
import RecipeCard from '../components/RecipeCard';
import IngredientRow from '../components/IngredientRow';
import WeightWheel from '../components/WeightWheel';
import JarShelf from '../components/JarShelf';
import Thermometer from '../components/Thermometer';
import ColdPlateTimer from '../components/ColdPlateTimer';
import Chip from '../components/Chip';
import StatStrip from '../components/StatStrip';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import { spriteAt } from '../assets';
import { fruitByKey, LEVEL_LABEL } from '../game/fruits';
import { celsiusToFahrenheit, setQualityStars, targetSetPointC } from '../game/batchMath';
import useBatchMath from '../hooks/useBatchMath';
import useSetPointTimer from '../hooks/useSetPointTimer';
import {
  ALTITUDES_M,
  JAR_SIZES_ML,
  SPRING,
  TIMING,
  WEIGHT_DEFAULT,
} from '../constants/config';
import type { SweetnessKey } from '../constants/config';
import {
  formatDecimal,
  formatGrams,
  formatMl,
  formatTempC,
  formatWeight,
} from '../utils/format';

const STAGES = ['BATCH', 'JARS', 'SET POINT'];

export type BatchSummary = {
  fruitKey: string;
  fruitName: string;
  weightG: number;
  sweetness: SweetnessKey;
  jars: number;
  reachedC: number;
  stars: number;
};

type Props = {
  fruitKey: string;
  sweetness: SweetnessKey;
  onBack: () => void;
  onGameOver: (summary: BatchSummary) => void;
};

export default function GameScreen({ fruitKey, sweetness, onBack, onGameOver }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const compact = H < 700;

  const [stage, setStage] = useState(0);
  const [weightG, setWeightG] = useState(WEIGHT_DEFAULT);
  const [jarSizeMl, setJarSizeMl] = useState(250);
  const [altitudeM, setAltitudeM] = useState(0);

  const fruit = useMemo(() => fruitByKey(fruitKey), [fruitKey]);
  const targetC = useMemo(() => targetSetPointC(altitudeM), [altitudeM]);
  const batch = useBatchMath({ fruit, weightG, sweetness, jarSizeMl });
  const timer = useSetPointTimer({ targetC });

  const enter = useRef(new Animated.Value(0.96)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(enter, { toValue: 1, useNativeDriver: true, ...SPRING.sheet }),
      Animated.timing(fade, {
        toValue: 1,
        duration: TIMING.screenFade,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enter, fade]);

  const goJars = useCallback(() => setStage(1), []);
  const goSheet = useCallback(() => setStage(0), []);

  const startTimer = useCallback(() => {
    setStage(2);
    timer.start();
  }, [timer]);

  const recalculate = useCallback(() => {
    setWeightG(WEIGHT_DEFAULT);
    setJarSizeMl(250);
    setAltitudeM(0);
    timer.reset();
  }, [timer]);

  const finish = useCallback(() => {
    onGameOver({
      fruitKey: fruit.key,
      fruitName: fruit.name,
      weightG,
      sweetness,
      jars: batch.fullJars,
      reachedC: timer.reached ? targetC : timer.currentC,
      stars: setQualityStars(timer.reached ? targetC : timer.currentC, targetC),
    });
  }, [onGameOver, fruit, weightG, sweetness, batch.fullJars, timer.reached, timer.currentC, targetC]);

  const stripItems = useMemo(
    () => [
      { key: 'batch', label: 'BATCH ' + formatWeight(weightG), color: theme.colors.berry.base },
      { key: 'yield', label: 'YIELD ' + batch.fullJars + ' JARS', color: theme.colors.leaf },
      { key: 'set', label: 'SET ' + formatTempC(targetC), color: theme.colors.terracotta },
    ],
    [weightG, batch.fullJars, targetC],
  );

  const wheelW = W - 32;
  const thermoH = compact ? 160 : 184;

  const headerRight = (
    <View style={styles.weightPill}>
      <Scales
        size={16}
        weight="duotone"
        color={theme.colors.berry.base}
        duotoneColor={theme.colors.terracotta}
      />
      <Text style={styles.weightPillText} numberOfLines={1}>
        {formatWeight(weightG)}
      </Text>
    </View>
  );

  return (
    <AppShell variant="game">
      <ScreenHeader
        title={fruit.name}
        subtitle={
          'PECTIN ' + LEVEL_LABEL[fruit.pectin] + ' · ACID ' + LEVEL_LABEL[fruit.acid]
        }
        onBack={onBack}
        rightSlot={headerRight}
      />

      <View style={styles.segmentWrap}>
        <SegmentedControl
          segments={STAGES}
          value={stage}
          onChange={setStage}
          width={W - 32}
          height={compact ? 40 : 44}
        />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.area, { opacity: fade, transform: [{ scale: enter }] }]}>
        {stage === 0 ? (
          <View style={styles.stage}>
            <RecipeCard>
              <IngredientRow
                Icon={Cube}
                name="SUGAR"
                hint={'target ' + Math.round(batch.sugarG / (weightG / 100)) + '% of fruit'}
                value={formatGrams(batch.sugarG)}
                color={theme.colors.berry.base}
              />
              <IngredientRow
                Icon={Drop}
                name="LEMON JUICE"
                hint={formatDecimal(batch.lemonTbsp) + ' tbsp, fresh'}
                value={formatMl(batch.lemonMl)}
                color={theme.colors.leaf}
              />
              <IngredientRow
                Icon={Leaf}
                name="PECTIN"
                hint={formatDecimal(batch.pectinTsp) + ' tsp, level'}
                value={formatGrams(batch.pectinG)}
                color={theme.colors.terracotta}
                last
              />
              <Image
                source={spriteAt(fruit.sprite)}
                style={styles.cardSprite}
                resizeMode="contain"
              />
            </RecipeCard>

            <View style={styles.wheelBlock}>
              <View style={styles.wheelHead}>
                <Text style={styles.wheelLabel} numberOfLines={1}>
                  PREPARED FRUIT
                </Text>
                <Text style={styles.wheelValue} numberOfLines={1}>
                  {formatWeight(weightG)}
                </Text>
              </View>
              <WeightWheel value={weightG} onChange={setWeightG} width={wheelW} />
            </View>
          </View>
        ) : null}

        {stage === 1 ? (
          <View style={styles.stage}>
            <View style={styles.jarChips}>
              {JAR_SIZES_ML.map(size => (
                <Chip
                  key={size}
                  flex
                  label={size + ' ML'}
                  active={size === jarSizeMl}
                  onPress={() => setJarSizeMl(size)}
                />
              ))}
            </View>

            <JarShelf fullJars={batch.fullJars} partialFill={batch.partialFill} />

            <Text style={styles.yield} numberOfLines={1}>
              {'YIELD ' +
                batch.fullJars +
                ' FULL JARS' +
                (batch.remainderMl > 10 ? ' + 1 PART' : '')}
            </Text>
            <Text style={styles.yieldHint} numberOfLines={1}>
              {formatMl(batch.volumeMl) + ' OF SET JAM AFTER REDUCING'}
            </Text>
          </View>
        ) : null}

        {stage === 2 ? (
          <View style={styles.stage}>
            <View style={styles.altChips}>
              {ALTITUDES_M.map(m => (
                <Chip
                  key={m}
                  flex
                  label={m === 0 ? 'SEA LEVEL' : m + ' M'}
                  active={m === altitudeM}
                  onPress={() => setAltitudeM(m)}
                />
              ))}
            </View>

            <View
              style={[
                styles.thermoCard,
                timer.reached ? styles.thermoCardReached : null,
              ]}>
              <Thermometer
                currentC={timer.currentC}
                targetC={targetC}
                reached={timer.reached}
                height={thermoH}
              />

              <View style={styles.readout}>
                <Text
                  style={[
                    styles.bigTemp,
                    timer.reached ? styles.bigTempReached : null,
                  ]}
                  numberOfLines={1}>
                  {formatTempC(timer.currentC)}
                </Text>
                <Text style={styles.fahrenheit} numberOfLines={1}>
                  {celsiusToFahrenheit(timer.currentC) + ' F'}
                </Text>
                {timer.reached ? (
                  <View style={styles.setBadge}>
                    <Text style={styles.setBadgeText} numberOfLines={1}>
                      SET POINT
                    </Text>
                  </View>
                ) : null}
                <View style={styles.ringWrap}>
                  <ColdPlateTimer seconds={timer.secondsLeft} size={compact ? 84 : 96} />
                </View>
              </View>
            </View>

            <Text style={styles.coldPlate} numberOfLines={1}>
              CHILL A SPOON, WAIT, PUSH THE DROP
            </Text>
          </View>
        ) : null}
      </Animated.View>

      <StatStrip items={stripItems} />

      <View style={styles.controls}>
        {stage === 0 ? (
          <View style={styles.row}>
            <View style={styles.rowSecondary}>
              <SecondaryButton
                label="RECALCULATE"
                onPress={recalculate}
                height={compact ? 52 : 56}
              />
            </View>
            <View style={styles.rowPrimary}>
              <PrimaryButton
                label="GO TO JARS"
                Icon={ArrowRight}
                onPress={goJars}
                height={compact ? 52 : 56}
              />
            </View>
          </View>
        ) : null}

        {stage === 1 ? (
          <View style={styles.row}>
            <View style={styles.rowSecondary}>
              <SecondaryButton
                label="BACK TO BATCH"
                onPress={goSheet}
                height={compact ? 52 : 56}
              />
            </View>
            <View style={styles.rowPrimary}>
              <PrimaryButton
                label="START TIMER"
                Icon={ThermoIcon}
                onPress={startTimer}
                height={compact ? 52 : 56}
              />
            </View>
          </View>
        ) : null}

        {stage === 2 ? (
          <PrimaryButton
            label="FINISH BATCH"
            Icon={CheckCircle}
            onPress={finish}
            height={compact ? 54 : 60}
          />
        ) : null}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  segmentWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  area: { flex: 1, paddingHorizontal: 16 },
  stage: { flex: 1, justifyContent: 'space-evenly' },

  weightPill: {
    height: 40,
    minWidth: 92,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  weightPillText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.berry.base,
    fontVariant: ['tabular-nums'],
  },

  cardSprite: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 44,
    height: 44,
    opacity: 0.2,
  },

  wheelBlock: { marginTop: 10 },
  wheelHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  wheelLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  wheelValue: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },

  jarChips: { flexDirection: 'row', gap: 6 },
  yield: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  yieldHint: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },

  altChips: { flexDirection: 'row', gap: 6 },
  thermoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: theme.radius.xl - 2,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  thermoCardReached: { borderWidth: 2, borderColor: theme.colors.berry.base },
  readout: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bigTemp: {
    fontSize: 38,
    fontWeight: '900',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  bigTempReached: { color: theme.colors.berry.base },
  fahrenheit: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  setBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(194,24,91,0.12)',
  },
  setBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.berry.base,
  },
  ringWrap: { marginTop: 8 },
  coldPlate: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },

  controls: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#3A1626',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 10,
  },
  row: { flexDirection: 'row', gap: 12 },
  rowSecondary: { flex: 1 },
  rowPrimary: { flex: 1.25 },
});
