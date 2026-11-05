/**
 * phosphor-react-native@3.0.6 ships `lib/typescript/index.d.ts.map` but not the
 * `.d.ts` it points at, so TypeScript cannot resolve the package's own types.
 * This ambient declaration restores them for the icons this app actually uses —
 * every name below was checked against node_modules/phosphor-react-native/src/icons.
 */
declare module 'phosphor-react-native' {
  import type * as React from 'react';
  import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export type IconWeight =
    | 'thin'
    | 'light'
    | 'regular'
    | 'bold'
    | 'fill'
    | 'duotone';

  export interface IconProps {
    color?: string;
    duotoneColor?: string;
    duotoneOpacity?: number;
    mirrored?: boolean;
    size?: string | number;
    style?: StyleProp<ViewStyle | Omit<TextStyle, 'cursor'>>;
    testID?: string;
    title?: string;
    titleId?: string;
    weight?: IconWeight;
  }

  export type Icon = React.FC<IconProps>;

  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const CheckCircle: Icon;
  export const Cherries: Icon;
  export const Circle: Icon;
  export const CircleHalf: Icon;
  export const CirclesFour: Icon;
  export const CirclesThree: Icon;
  export const CirclesThreePlus: Icon;
  export const CookingPot: Icon;
  export const Cube: Icon;
  export const Drop: Icon;
  export const Egg: Icon;
  export const Flower: Icon;
  export const Jar: Icon;
  export const Leaf: Icon;
  export const Notebook: Icon;
  export const Orange: Icon;
  export const OrangeSlice: Icon;
  export const Plant: Icon;
  export const Scales: Icon;
  export const Thermometer: Icon;
  export const Tree: Icon;
}
