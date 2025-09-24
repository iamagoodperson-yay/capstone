import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Home from './screens/Home';
import Phrases from './screens/Phrases';
import Daily from './screens/Daily';
import Shop from './screens/Shop';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();

const screen = (name, component, iconName) => {
    return (
        <Tab.Screen
            name={name}
            component={component}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name={iconName} color={color} size={size} />
                ),
            }}
        />
    );
}

const App = () => {

    const [avatarItems, setAvatarItems] = useState({
        hats: 0,
        shirts: 0,
        pants: 0,
        shoes: 0,
        accessories: 0,
    });

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
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name={"home"} color={color} size={size} />
                        ),
                    }}
                >
                    {() => <Home avatarItems={avatarItems} />}
                </Tab.Screen>
                {screen("Phrases", Phrases, "comment")}
                {screen("Challenge", Daily, "calendar")}
                <Tab.Screen
                    name="Shop"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name={"shopping-cart"} color={color} size={size} />
                        ),
                    }}
                >
                    {() => <Shop avatarItems={avatarItems} setAvatarItems={setAvatarItems} />}
                </Tab.Screen>
                {screen("Settings", Settings, "cog")}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;