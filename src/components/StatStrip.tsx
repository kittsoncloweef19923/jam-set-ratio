import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type StripItem = { key: string; label: string; color: string };

type Props = { items: StripItem[] };

/** The thin pill strip. A lone pill looks orphaned, so under two it renders nothing. */
function StatStripBase({ items }: Props) {
  if (items.length < 2) {
    return null;
  }
  return (
    <View style={styles.strip}>
      {items.map(item => (
        <View key={item.key} style={styles.pill}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  pill: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
  },
});

export const StatStrip = memo(StatStripBase);
export default StatStrip;
