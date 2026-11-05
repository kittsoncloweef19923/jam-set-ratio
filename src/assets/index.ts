/**
 * Codex asset contract (Step 1.5) — these exact file names and no others.
 */
export const assets = {
  bg: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
};

const SPRITES = [
  assets.sprite1,
  assets.sprite2,
  assets.sprite3,
  assets.sprite4,
  assets.sprite5,
];

export function spriteAt(index: number) {
  const i = Math.max(1, Math.min(5, Math.round(index)));
  return SPRITES[i - 1];
}

export default assets;
