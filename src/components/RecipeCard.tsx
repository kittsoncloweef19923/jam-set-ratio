import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import GinghamCorner from './GinghamCorner';

type Props = {
  children: React.ReactNode;
  style?: object;
  accent?: string;
};

/** Kraft recipe card: berry ribbon along the top edge, gingham in the corners. */
function RecipeCardBase({ children, style, accent = theme.colors.berry.base }: Props) {
  return (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={[accent, theme.colors.berry.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.ribbon}
      />
      <GinghamCorner corner="topLeft" size={48} />
      <GinghamCorner corner="bottomRight" size={48} />
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.xl - 2,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  ribbon: { height: 3, width: '100%' },
  body: { padding: 14 },
});

export const RecipeCard = memo(RecipeCardBase);
export default RecipeCard;
