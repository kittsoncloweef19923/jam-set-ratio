import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { Icon } from 'phosphor-react-native';
import theme from '../constants/theme';

type Props = {
  Icon: Icon;
  name: string;
  hint: string;
  value: string;
  color: string;
  last?: boolean;
};

/**
 * The value is the loudest thing on the card — it has to read from the stove.
 * It pulses whenever the number changes so a recalculation is visible.
 */
function IngredientRowBase({ Icon: Glyph, name, hint, value, color, last }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 110, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start();
  }, [value, pulse]);

  return (
    <View style={[styles.row, last ? styles.last : null]}>
      <View style={[styles.well, { backgroundColor: `${color}1A` }]}>
        <Glyph size={22} weight="duotone" color={color} duotoneColor={theme.colors.text.muted} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      </View>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Text style={[styles.value, { color }]} numberOfLines={1}>
          {value}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  last: { borderBottomWidth: 0 },
  well: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: { flex: 1, marginLeft: 10, marginRight: 8 },
  name: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  hint: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
});

export const IngredientRow = memo(IngredientRowBase);
export default IngredientRow;
