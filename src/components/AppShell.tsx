import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import assets from '../assets';

type Variant = 'loader' | 'game' | 'gameover' | 'pantry';

type Props = {
  variant: Variant;
  children: React.ReactNode;
};

const GRADIENTS: Record<Variant, string[]> = {
  loader: theme.gradients.loader,
  game: theme.gradients.game,
  gameover: theme.gradients.gameover,
  pantry: theme.gradients.pantry,
};

/** Overlay opacity sits high on the loader so it reads nothing like the menu. */
const ART_OPACITY: Record<Variant, number> = {
  loader: 0.22,
  game: 0.12,
  gameover: 0.16,
  pantry: 0.1,
};

const BLOBS: Record<Variant, { berry: string; leaf: string }> = {
  loader: { berry: 'rgba(194,24,91,0.10)', leaf: 'rgba(104,159,56,0.08)' },
  game: { berry: 'rgba(194,24,91,0.06)', leaf: 'rgba(104,159,56,0.05)' },
  gameover: { berry: 'rgba(194,24,91,0.08)', leaf: 'rgba(217,123,77,0.06)' },
  pantry: { berry: 'rgba(194,24,91,0.05)', leaf: 'rgba(104,159,56,0.06)' },
};

/**
 * Three stacked depth layers on every screen: art -> gradient + blobs -> content.
 */
function AppShellBase({ variant, children }: Props) {
  const blobs = BLOBS[variant];
  const isLoader = variant === 'loader';

  return (
    <View style={styles.root}>
      <ImageBackground
        source={assets.bg}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: ART_OPACITY[variant] }}>
        <LinearGradient
          colors={GRADIENTS[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, isLoader ? styles.loaderVeil : styles.veil]}
        />
      </ImageBackground>

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.blobTop, { backgroundColor: blobs.berry }]} />
        <View style={[styles.blobBottom, { backgroundColor: blobs.leaf }]} />
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  veil: { opacity: 0.94 },
  loaderVeil: { opacity: 0.88 },
  blobTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -40,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  content: { flex: 1 },
});

export const AppShell = memo(AppShellBase);
export default AppShell;
