//John Briggs, 2021
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SecondScreen from '../screens/SecondScreen';
import QueueScreen from '../screens/QueueScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MainTabs from './MainTabs';
import Login from "../screens/auth/Login"

const MainStack = createStackNavigator();
const Main = () => {
	return (
		<MainStack.Navigator
			screenOptions={{
				headerShown: false,
        
			}}
		>
      <MainStack.Screen name="Login" component={Login} options={{animationEnabled: false}}/>
			<MainStack.Screen name="MainTabs" component={MainTabs} options={{animationEnabled: false}}/>
			<MainStack.Screen name="SecondScreen" component={SecondScreen} options={{animationEnabled: false}}/>
      <MainStack.Screen name="QueueScreen" component={QueueScreen} options={{animationEnabled: false}}/>
      <MainStack.Screen name="HistoryScreen" component={HistoryScreen} options={{animationEnabled: false}}/>
      
		</MainStack.Navigator>
	);
};

export default Main;
