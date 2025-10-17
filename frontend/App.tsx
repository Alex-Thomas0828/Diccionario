import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import WordEditorScreen from './src/screens/WordEditorScreen';
import ContribuirScreen from './src/screens/contribuir';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dictionary" 
          component={DictionaryScreen}
          options={{ title: 'Diccionario' }}
        />
        <Stack.Screen 
          name="WordEditor" 
          component={WordEditorScreen}
          options={{ title: 'Editar' }}
        />
        <Stack.Screen 
          name="Contribuir" 
          component={ContribuirScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}