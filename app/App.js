import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@react-native-vector-icons/FontAwesome';

import Home from './Home';
import Phrases from './Phrases';
import Daily from './Daily';
import Shop from './Shop';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerTitleStyle: {
                        fontSize: 36,
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    tabBarStyle: {
                        height: 100,
                        paddingBottom: 10,
                    },
                    tabBarLabelStyle: {
                        fontSize: 16,
                    },
            }}>
                <Tab.Screen 
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Phrases"
                    component={Phrases}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="comment" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Challenge"
                    component={Daily}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="calendar" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Shop"
                    component={Shop}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="shopping-cart" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen 
                    name="Settings"
                    component={Settings}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="cog" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
