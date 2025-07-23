import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import DictionaryScreen from './src/screens/DictionaryScreen';
import WordEditorScreen from './src/screens/WordEditorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
  name="Dictionary" 
  component={DictionaryScreen}
  options={{ title: 'Diccionario' }}  // Changed
/>
        <Stack.Screen 
  name="WordEditor" 
  component={WordEditorScreen}
  options={{ title: 'Editor de Palabras' }}  // Changed
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}