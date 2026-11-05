/**
 * WARM_EARTHY preset (design-system/presets) with the JamSetRatio berry/leaf
 * accent overrides. The `name` field stays exactly as the preset defines it.
 */
export const theme = {
  name: 'warm-earthy',
  colors: {
    bg: {
      primary: '#FFF5EE',
      secondary: '#FBE7E0',
      tertiary: '#F8D9D3',
      accent: '#F3C2C8',
      shelf: '#F2EAD8',
      shelfWood: '#D8C9A8',
    },
    dark: {
      deep: '#3A1626',
      mid: '#5E1E38',
      warm: '#7B1F3F',
    },
    berry: {
      base: '#C2185B',
      light: '#E05A86',
      bright: '#D62A6B',
      deep: '#9E0F48',
    },
    leaf: '#689F38',
    terracotta: '#D97B4D',
    mustard: '#D9B36C',
    surface: '#FFFFFF',
    border: '#F0CFC5',
    divider: '#F6E2DC',
    ash: '#E7C8BF',
    text: {
      primary: '#3A1626',
      secondary: '#8A5A68',
      onDark: '#FFF5EE',
      muted: '#F8D9D3',
    },
  },
  gradients: {
    loader: ['#3A1626', '#5E1E38', '#7B1F3F'],
    menuSheet: ['#FFF5EE', '#F8D9D3'],
    game: ['#FFF5EE', '#FBE7E0', '#F8D9D3'],
    gameover: ['#FFF5EE', '#F8D9D3', '#F3C2C8'],
    pantry: ['#FFF5EE', '#F2EAD8'],
    primaryButton: ['#D62A6B', '#C2185B', '#9E0F48'],
    progress: ['#C2185B', '#E05A86', '#689F38'],
    mercury: ['#689F38', '#D9B36C', '#C2185B'],
    syrup: ['#E05A86', '#C2185B', '#9E0F48'],
    artFade: ['rgba(255,245,238,0)', 'rgba(255,245,238,0.55)', '#FFF5EE'],
  },
  typography: {
    hero: { fontSize: 38, fontWeight: '900' as const, letterSpacing: 3 },
    heroSmall: { fontSize: 34, fontWeight: '900' as const, letterSpacing: 1 },
    bigNumber: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 0 },
    title: { fontSize: 24, fontWeight: '800' as const, letterSpacing: 0.4 },
    cardTitle: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 0.3 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.4 },
    button: { fontSize: 18, fontWeight: '800' as const, letterSpacing: 1.5 },
    buttonSmall: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 1 },
  },
  radius: { sm: 8, md: 14, lg: 18, xl: 24, xxl: 32, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  shadow: {
    card: {
      shadowColor: '#C2185B',
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
    button: {
      shadowColor: '#C2185B',
      shadowOpacity: 0.38,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    sheet: {
      shadowColor: '#3A1626',
      shadowOpacity: 0.16,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: -8 },
      elevation: 12,
    },
  },
};

export type Theme = typeof theme;
export default theme;
