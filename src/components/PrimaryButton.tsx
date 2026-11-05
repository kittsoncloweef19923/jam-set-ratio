import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { Icon } from 'phosphor-react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';

const ICON = 24;

type Props = {
  label: string;
  Icon?: Icon;
  onPress: () => void;
  height?: number;
  disabled?: boolean;
  style?: object;
};

/**
 * Pressable is the PARENT, the Animated.View scales INSIDE it (rule #8) —
 * an animated wrapper around a Pressable swallows onPress on Android release.
 */
function PrimaryButtonBase({ label, Icon: Glyph, onPress, height = 60, disabled, style }: Props) {
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
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }, disabled ? styles.disabled : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, { height, transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.primaryButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { height }]}>
          <View pointerEvents="none" style={styles.gloss} />
          <View style={styles.row}>
            {Glyph ? (
              <Glyph
                size={ICON}
                color={theme.colors.text.onDark}
                duotoneColor={theme.colors.text.muted}
                weight="duotone"
              />
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: theme.radius.lg,
    ...theme.shadow.button,
  },
  disabled: { opacity: 0.5 },
  anim: {
    width: '100%',
    borderRadius: theme.radius.lg,
  },
  fill: {
    width: '100%',
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  label: {
    ...theme.typography.button,
    lineHeight: ICON,
    color: theme.colors.text.onDark,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
