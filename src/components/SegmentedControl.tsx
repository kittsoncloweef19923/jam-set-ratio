import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { TIMING } from '../constants/config';

type Props = {
  segments: string[];
  value: number;
  onChange: (index: number) => void;
  width: number;
  height?: number;
};

function SegmentedControlBase({ segments, value, onChange, width, height = 44 }: Props) {
  const count = Math.max(1, segments.length);
  const inner = width - 8;
  const segW = inner / count;
  const slide = useRef(new Animated.Value(value * segW)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: value * segW,
      duration: TIMING.segment,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, segW, slide]);

  return (
    <View style={[styles.track, { width, height }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.indicator,
          { width: segW, height: height - 8, transform: [{ translateX: slide }] },
        ]}
      />
      {segments.map((label, i) => (
        <Pressable
          key={label}
          onPress={() => onChange(i)}
          accessibilityRole="button"
          accessibilityState={{ selected: i === value }}
          accessibilityLabel={label}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.seg, { width: segW, height: height - 8 }]}>
          <Text
            style={[styles.label, i === value ? styles.labelActive : null]}
            numberOfLines={1}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  indicator: {
    position: 'absolute',
    left: 4,
    top: 4,
    borderRadius: theme.radius.sm + 2,
    backgroundColor: theme.colors.berry.base,
  },
  seg: { alignItems: 'center', justifyContent: 'center' },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.text.onDark },
});

export const SegmentedControl = memo(SegmentedControlBase);
export default SegmentedControl;
