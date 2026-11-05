import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  width?: number;
  flex?: boolean;
};

function ChipBase({ label, active, onPress, width, flex }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.chip,
        flex ? styles.flex : null,
        width ? { width } : null,
        active ? styles.chipActive : null,
      ]}>
      <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    minWidth: 64,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  flex: { flex: 1, minWidth: 0, paddingHorizontal: 6 },
  chipActive: {
    backgroundColor: theme.colors.berry.base,
    borderColor: theme.colors.berry.deep,
    shadowColor: theme.colors.berry.base,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.text.onDark },
});

export const Chip = memo(ChipBase);
export default Chip;
