/**
 * JamSetRatio — a home-preserving bench companion.
 * App.tsx is the screen state machine only; every rule of the craft lives in src/game.
 */
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import PantryScreen from './src/screens/PantryScreen';
import usePantry from './src/hooks/usePantry';
import { DEFAULT_FRUIT_KEY, fruitByKey } from './src/game/fruits';
import { SET_QUALITY } from './src/constants/config';
import type { SetQuality, SweetnessKey } from './src/constants/config';
import type { BatchSummary } from './src/screens/GameScreen';
import theme from './src/constants/theme';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'pantry';

const EMPTY_SUMMARY: BatchSummary = {
  fruitKey: DEFAULT_FRUIT_KEY,
  fruitName: fruitByKey(DEFAULT_FRUIT_KEY).name,
  weightG: 1000,
  sweetness: 'BALANCED',
  jars: 0,
  reachedC: 104.5,
  stars: 5,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [fruitKey, setFruitKey] = useState(DEFAULT_FRUIT_KEY);
  const [sweetness, setSweetness] = useState<SweetnessKey>('BALANCED');
  const [summary, setSummary] = useState<BatchSummary>(EMPTY_SUMMARY);

  const pantry = usePantry();
  const { addBatch } = pantry;

  const toMenu = useCallback(() => setScreen('menu'), []);
  const toGame = useCallback(() => setScreen('game'), []);
  const toPantry = useCallback(() => setScreen('pantry'), []);

  const handleGameOver = useCallback(
    (result: BatchSummary) => {
      setSummary(result);
      addBatch({
        fruitKey: result.fruitKey,
        fruitName: result.fruitName,
        weightG: result.weightG,
        sweetness: result.sweetness,
        jars: result.jars,
        reachedC: result.reachedC,
        stars: result.stars,
        quality: SET_QUALITY[1],
      });
      setScreen('gameover');
    },
    [addBatch],
  );

  const handleRate = useCallback((stars: number, _quality: SetQuality) => {
    setSummary(prev => ({ ...prev, stars }));
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {screen === 'loader' ? <LoaderScreen onDone={toMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          fruitKey={fruitKey}
          sweetness={sweetness}
          jarsInPantry={pantry.totalJars}
          bestStars={pantry.bestStars}
          onPickFruit={setFruitKey}
          onPickSweetness={setSweetness}
          onStart={toGame}
          onPantry={toPantry}
          onJournal={toPantry}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          fruitKey={fruitKey}
          sweetness={sweetness}
          onBack={toMenu}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'gameover' ? (
        <GameOverScreen
          fruitName={summary.fruitName}
          weightG={summary.weightG}
          jars={summary.jars}
          reachedC={summary.reachedC}
          stars={summary.stars}
          onPlayAgain={toGame}
          onPantry={toPantry}
          onMenu={toMenu}
          onRate={handleRate}
        />
      ) : null}

      {screen === 'pantry' ? (
        <PantryScreen
          shelf={pantry.shelf}
          totalJars={pantry.totalJars}
          bestStars={pantry.bestStars}
          onBack={toMenu}
          onStart={toGame}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
