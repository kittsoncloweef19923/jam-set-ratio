import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import {
  BOARD_PAD,
  BOARD_W,
  JAR_COLS,
  JAR_TILE,
  MAX_JARS_SHOWN,
  TIMING,
} from '../constants/config';
import JarGlyph from './JarGlyph';

type Props = {
  fullJars: number;
  partialFill: number;
};

/**
 * Board geometry follows the frame formula so the tiles never poke out of the
 * padded, bordered parent: TILE = (BOARD_MAX_W - 2*FRAME) / COLS.
 */
function JarShelfBase({ fullJars, partialFill }: Props) {
  const jars = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < fullJars && out.length < MAX_JARS_SHOWN; i += 1) {
      out.push(1);
    }
    if (partialFill > 0.02 && out.length < MAX_JARS_SHOWN) {
      out.push(partialFill);
    }
    return out;
  }, [fullJars, partialFill]);

  const hidden = Math.max(0, fullJars + (partialFill > 0.02 ? 1 : 0) - jars.length);
  const jarW = Math.round(JAR_TILE * 0.62);
  const jarH = Math.round(JAR_TILE * 0.9);
  const rows = Math.max(1, Math.ceil(jars.length / JAR_COLS));

  return (
    <View style={[styles.board, { width: BOARD_W }]}>
      <View style={[styles.grid, { height: rows * (jarH + 6) }]}>
        {jars.map((fill, i) => (
          <View
            key={`jar-${i}`}
            style={[styles.cell, { width: JAR_TILE, height: jarH + 6 }]}>
            <JarGlyph fill={fill} width={jarW} height={jarH} delay={i * TIMING.jarStagger} />
          </View>
        ))}
        {jars.length === 0 ? (
          <Text style={styles.empty}>NOT ENOUGH FOR ONE JAR YET</Text>
        ) : null}
      </View>
      {hidden > 0 ? (
        <Text style={styles.more} numberOfLines={1}>
          {`+ ${hidden} MORE ON THE BENCH`}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    padding: BOARD_PAD,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  cell: { alignItems: 'center', justifyContent: 'flex-end' },
  empty: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  more: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
});

export const JarShelf = memo(JarShelfBase);
export default JarShelf;
