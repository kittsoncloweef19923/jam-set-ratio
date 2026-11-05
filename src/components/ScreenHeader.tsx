import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';
import theme from '../constants/theme';
import { HEADER_CONTENT_H, HEADER_TOP_PAD } from '../constants/config';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
  transparent?: boolean;
  contentHeight?: number;
};

/**
 * The one header used by every screen — Menu, Game, GameOver and Pantry pass
 * different slots instead of each re-inventing the markup.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  onBack,
  leftSlot,
  rightSlot,
  tone = 'dark',
  transparent,
  contentHeight = HEADER_CONTENT_H,
}: Props) {
  const onDark = tone === 'light';
  const titleColor = onDark ? theme.colors.text.onDark : theme.colors.text.primary;
  const subColor = onDark ? theme.colors.text.muted : theme.colors.text.secondary;

  const left = leftSlot ? (
    leftSlot
  ) : onBack ? (
    <Pressable
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.backBtn}>
      <ArrowLeft
        size={22}
        weight="duotone"
        color={theme.colors.berry.base}
        duotoneColor={theme.colors.text.muted}
      />
    </Pressable>
  ) : (
    <View style={styles.slot} />
  );

  return (
    <View style={[styles.wrap, transparent ? styles.transparent : null]}>
      <View style={[styles.row, { height: contentHeight }]}>
        <View style={styles.side}>{left}</View>
        <View style={styles.center}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: subColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={[styles.side, styles.sideRight]}>
          {rightSlot ? rightSlot : <View style={styles.slot} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: HEADER_TOP_PAD,
    backgroundColor: 'rgba(58,22,38,0.06)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  side: { width: 112, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  slot: { width: 44, height: 44 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800', letterSpacing: 0.6 },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
