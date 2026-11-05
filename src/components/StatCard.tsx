import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string;
  label: string;
  color: string;
};

/**
 * The single stat card used on every screen. No raster icons: colour carries
 * the meaning, so a row of these is pixel-identical apart from the number.
 * `width: '100%'` — never `flex: 1` inside an already-flexed slot (rule #19a).
 */
function StatCardBase({ value, label, color }: Props) {
  return (
    <View style={[styles.card, { borderColor: `${color}55` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    ...theme.shadow.card,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 7 },
  value: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
