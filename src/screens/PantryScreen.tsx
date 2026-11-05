import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { CookingPot } from 'phosphor-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import PantryCard from '../components/PantryCard';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import theme from '../constants/theme';
import assets from '../assets';
import { MAX_PANTRY_CARDS } from '../constants/config';
import type { PantryShelfItem } from '../hooks/usePantry';

const GAP = 12;
const PAD = 16;

type Props = {
  shelf: PantryShelfItem[];
  totalJars: number;
  bestStars: number;
  onBack: () => void;
  onStart: () => void;
};

export default function PantryScreen({
  shelf,
  totalJars,
  bestStars,
  onBack,
  onStart,
}: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const compact = H < 700;
  const cardW = Math.floor((W - 2 * PAD - GAP) / 2);

  const visible = useMemo(() => shelf.slice(0, MAX_PANTRY_CARDS), [shelf]);
  const hidden = Math.max(0, shelf.length - visible.length);

  const soonCount = useMemo(() => shelf.filter(s => s.soon).length, [shelf]);

  return (
    <AppShell variant="pantry">
      <ScreenHeader
        title="PANTRY SHELF"
        subtitle="WHAT IS SET AND WAITING"
        onBack={onBack}
        rightSlot={
          <Image source={assets.iconHome} style={styles.cornerIcon} resizeMode="contain" />
        }
      />

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatCard
              value={String(totalJars)}
              label="JARS ON SHELF"
              color={theme.colors.berry.base}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={String(shelf.length)}
              label="BATCHES"
              color={theme.colors.leaf}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={soonCount > 0 ? String(soonCount) : String(bestStars)}
              label={soonCount > 0 ? 'USE SOON' : 'BEST STARS'}
              color={theme.colors.terracotta}
            />
          </View>
        </View>

        <View style={styles.shelfWrap}>
          <View pointerEvents="none" style={styles.woodBand} />
          <View pointerEvents="none" style={[styles.woodBand, styles.woodBand2]} />

          <View style={styles.grid}>
            {visible.map(item => (
              <PantryCard
                key={item.id}
                fruitName={item.fruitName}
                jarsLeft={item.jarsLeft}
                useBy={item.useBy}
                soon={item.soon}
                width={cardW}
              />
            ))}
          </View>

          {hidden > 0 ? (
            <Text style={styles.more} numberOfLines={1}>
              {'+ ' + hidden + ' MORE IN THE CELLAR'}
            </Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint} numberOfLines={1}>
            EVERY BATCH KEEPS 18 MONTHS IN A SEALED JAR
          </Text>
          <PrimaryButton
            label="START BATCH"
            Icon={CookingPot}
            onPress={onStart}
            height={compact ? 54 : 60}
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  cornerIcon: { width: 28, height: 28, opacity: 0.55 },
  body: { flex: 1, paddingHorizontal: PAD, paddingTop: 14, paddingBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },
  shelfWrap: { flex: 1, justifyContent: 'center', paddingVertical: 10 },
  woodBand: {
    position: 'absolute',
    left: -PAD,
    right: -PAD,
    top: '32%',
    height: 6,
    backgroundColor: theme.colors.bg.shelfWood,
    opacity: 0.7,
  },
  woodBand2: { top: '72%' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'flex-start',
  },
  more: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  footer: { marginTop: 6 },
  hint: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: theme.colors.text.secondary,
  },
});
