/**
 * Configuración de tipos para navegación con React Navigation
 * @module NavigationTypes
 * @description Define los tipos y parámetros para las rutas de navegación
 */

// Si deseas usar el navegador native-stack
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Word } from '../models/word';

/**
 * Declaración global para extender los tipos de React Navigation
 * @namespace ReactNavigation
 */
declare global {
  namespace ReactNavigation {
    /**
     * Interface para los parámetros de las rutas
     * @interface RootParamList
     */
    interface RootParamList {
      /**
       * Pantalla del diccionario
       * @property {undefined} Dictionary - No requiere parámetros
       */
      Dictionary: undefined;
      
      /**
       * Pantalla del editor de palabras
       * @property {Object} WordEditor - Parámetros opcionales
       * @property {Word} [word] - Objeto palabra para editar (opcional)
       */
      WordEditor: { word?: Word };
    }
  }
}

/**
 * Tipo para los parámetros de las rutas
 * @typedef {Object} RootStackParamList
 * @property {Object} Dictionary - Pantalla principal
 * @property {boolean} [refresh] - Bandera para refrescar datos
 * @property {Object} WordEditor - Editor de palabras
 * @property {Word} [word] - Palabra a editar (opcional)
 */
export type RootStackParamList = {
  Home: undefined;
  Dictionary: { searchTerm?: string };
  WordEditor: { word?: Word };
  Contribuir: undefined; // Add this line
};

/**
 * Props para la pantalla del diccionario
 * @typedef {Object} DictionaryScreenProps
 * @property {NativeStackNavigationProp} navigation - Objeto de navegación
 */
export type DictionaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dictionary'>;
};

/**
 * Props para la pantalla del editor de palabras
 * @typedef {Object} WordEditorScreenProps
 * @extends NativeStackScreenProps
 */
export type WordEditorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WordEditor'
>;