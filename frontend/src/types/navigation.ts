// If you want to use native-stack navigator
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Word } from '../models/word';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Dictionary: undefined;
      WordEditor: { word?: Word };
    }
  }
}

export type RootStackParamList = {
  Dictionary: { refresh?: boolean };
  WordEditor: { word?: Word };
};

export type DictionaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dictionary'>;
};

export type WordEditorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WordEditor'
>;