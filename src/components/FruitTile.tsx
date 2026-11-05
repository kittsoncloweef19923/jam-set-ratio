import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';
import type { Fruit } from '../game/fruits';

type Props = {
  fruit: Fruit;
  selected: boolean;
  onPress: (key: string) => void;
  size: number;
  height: number;
};

function FruitTileBase({ fruit, selected, onPress, size, height }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const { Icon: Glyph } = fruit;

  const press = useCallback(() => onPress(fruit.key), [fruit.key, onPress]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, ...SPRING.snappy }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.snappy }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={press}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={fruit.short}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ width: size, height }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          { width: size, height, transform: [{ scale }] },
          selected ? styles.tileSelected : null,
        ]}>
        <Glyph
          size={26}
          weight="duotone"
          color={selected ? theme.colors.berry.base : theme.colors.text.primary}
          duotoneColor={selected ? theme.colors.berry.light : theme.colors.leaf}
        />
        <Text
          style={[styles.name, selected ? styles.nameSelected : null]}
          numberOfLines={1}>
          {fruit.short}
        </Text>
        <View style={styles.dots}>
          <View
            style={[
              styles.dot,
              { borderColor: theme.colors.leaf },
              fruit.pectin === 'high' ? { backgroundColor: theme.colors.leaf } : null,
            ]}
          />
          <View
            style={[
              styles.dot,
              { borderColor: theme.colors.berry.base },
              fruit.acid === 'high' ? { backgroundColor: theme.colors.berry.base } : null,
            ]}
          />
        </View>
        {selected ? <View style={styles.underline} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: theme.colors.berry.base,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: theme.colors.berry.base,
    backgroundColor: '#FFF0F3',
  },
  name: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: theme.colors.text.primary,
  },
  nameSelected: { color: theme.colors.berry.base },
  dots: { flexDirection: 'row', gap: 4, marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, borderWidth: 1.5 },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.berry.base,
  },
});

export const FruitTile = memo(FruitTileBase);
export default FruitTile;
