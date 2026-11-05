import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Icon } from 'phosphor-react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';

const ICON = 20;

type Props = {
  label: string;
  Icon?: Icon;
  onPress: () => void;
  height?: number;
  style?: object;
};

function SecondaryButtonBase({ label, Icon: Glyph, onPress, height = 48, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...SPRING.snappy }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.snappy }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { height, transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Glyph ? (
            <Glyph
              size={ICON}
              color={theme.colors.berry.base}
              duotoneColor={theme.colors.terracotta}
              weight="duotone"
            />
          ) : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', borderRadius: theme.radius.md },
  fill: {
    width: '100%',
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194,24,91,0.07)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  label: {
    ...theme.typography.buttonSmall,
    lineHeight: ICON,
    color: theme.colors.berry.base,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
