import './src/services/firebase';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OnboardingScreen from './screens/OnboardingScreen';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import ForgotPassword from './screens/ForgotPassword';
import ExploreScreen from './screens/ExploreScreen';
import HotelDetailsScreen from './screens/HotelDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import ProfileScreen from './screens/ProfileScreen';
import DealsScreen from './screens/DealsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnboardingScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
        <Stack.Screen name="HotelDetailsScreen" component={HotelDetailsScreen} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="DealsScreen" component={DealsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
