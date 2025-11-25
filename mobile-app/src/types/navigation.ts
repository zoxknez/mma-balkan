import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Fighters: undefined;
  Events: undefined;
  News: undefined;
  Profile: undefined;
  EventDetail: { eventId: string | number };
  FighterDetail: { fighterId: string | number };
  NewsDetail: { articleId: string };
  Login: undefined;
  Register: undefined;
};

export type ScreenNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type ScreenRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
