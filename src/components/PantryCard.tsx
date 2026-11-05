import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Jar } from 'phosphor-react-native';
import theme from '../constants/theme';
import { formatMonthYear } from '../utils/format';

type Props = {
  fruitName: string;
  jarsLeft: number;
  useBy: Date;
  soon: boolean;
  width: number;
};

function PantryCardBase({ fruitName, jarsLeft, useBy, soon, width }: Props) {
  const pillBg = soon ? 'rgba(217,123,77,0.14)' : 'rgba(104,159,56,0.12)';
  const pillText = soon ? theme.colors.terracotta : theme.colors.leaf;

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.iconWell}>
        <Jar
          size={28}
          weight="duotone"
          color={theme.colors.berry.base}
          duotoneColor={theme.colors.leaf}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {fruitName}
      </Text>
      <Text style={styles.jars} numberOfLines={1}>
        {`${jarsLeft} JARS LEFT`}
      </Text>
      <View style={[styles.pill, { backgroundColor: pillBg }]}>
        <Text style={[styles.pillText, { color: pillText }]} numberOfLines={1}>
          {soon ? 'USE SOON' : `USE BY ${formatMonthYear(useBy)}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 108,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(194,24,91,0.08)',
  },
  name: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
  },
  jars: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  pill: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
});

export const PantryCard = memo(PantryCardBase);
export default PantryCard;
