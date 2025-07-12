import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DictionaryScreen from './src/screens/DictionaryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Dictionary" 
          component={DictionaryScreen}
          options={{ title: 'My Dictionary' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}