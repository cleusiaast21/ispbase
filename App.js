import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoUpload from './app/screems/VideoUpload';
import UploadScreen from './app/screems/UploadScreen';
import ImageUploadScreen from './app/screems/ImageUploadScreen';
import AudioUploadScreen from './app/screems/AudioUploadScreen';
import Login from './app/screems/Login';
import Register from './app/screems/Register';
import Home from './app/screems/Home';
import ProfilePage from './app/screems/ProfilePage';
import Radio from './app/screems/Radio';
import Videos from './app/screems/Videos';
import Songs from './app/screems/Songs';




// Importe os componentes de tela que você deseja navegar

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

        <Stack.Screen name="ProfilePage"
          component={ProfilePage}
          options={{ headerShown: true }} />

        <Stack.Screen name="ImageUploadScreen"
          component={ImageUploadScreen}
          options={{ headerShown: true }} />

        <Stack.Screen name="VideoUpload"
          component={VideoUpload}
          options={{ headerShown: true }} />

        <Stack.Screen name="UploadScreen"
          component={UploadScreen}
          options={{ headerShown: true }} />

        <Stack.Screen name="AudioUploadScreen"
          component={AudioUploadScreen}
          options={{ headerShown: true }} />

        <Stack.Screen name="Login"
          component={Login}
          options={{ headerShown: false }} />

        <Stack.Screen name="Radio"
          component={Radio}
          options={{ headerShown: false }} />

        <Stack.Screen name="Videos"
          component={Videos}
          options={{ headerShown: false }} />

        <Stack.Screen name="Register"
          component={Register}
          options={{ headerShown: true }} />

        <Stack.Screen name="Home"
          component={Home}
          options={{ headerShown: false }} />

        <Stack.Screen name="Songs"
          component={Songs}
          options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;