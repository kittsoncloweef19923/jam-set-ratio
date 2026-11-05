import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: number;
  onChange: (n: number) => void;
  size?: number;
};

const SLOTS = [1, 2, 3, 4, 5];

function Star({
  index,
  filled,
  size,
  onChange,
}: {
  index: number;
  filled: boolean;
  size: number;
  onChange: (n: number) => void;
}) {
  const press = useCallback(() => onChange(index), [index, onChange]);
  return (
    <Pressable
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`Rate ${index} of 5`}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.slot, { width: size + 8, height: size + 8 }]}>
      <Text
        style={[
          styles.star,
          { fontSize: size, lineHeight: size + 4, color: filled ? theme.colors.berry.base : theme.colors.ash },
        ]}>
        {'★'}
      </Text>
    </Pressable>
  );
}

/** Five tappable stars. The star glyph is one of the few that Roboto renders. */
function StarRatingBase({ value, onChange, size = 28 }: Props) {
  return (
    <View style={styles.row}>
      {SLOTS.map(n => (
        <Star key={n} index={n} filled={n <= value} size={size} onChange={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  slot: { alignItems: 'center', justifyContent: 'center' },
  star: { fontWeight: '700' },
});

export const StarRating = memo(StarRatingBase);
export default StarRating;
