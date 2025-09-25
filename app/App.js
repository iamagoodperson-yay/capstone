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
    const [avatarSelection, setAvatarSelection] = useState({
        hats: 0,
        shirts: 0,
        pants: 0,
        shoes: 0,
        accessories: 0,
    });

    const [avatarItems, setAvatarItems] = useState({
        hats:
            [
                { id: 0, name: require('../assets/avatar/none.png'), price: 0, unlocked: true, },
                { id: 1, name: require('../assets/avatar/hats/hat1.png'), price: 1, unlocked: false, },
                { id: 2, name: require('../assets/avatar/hats/hat2.png'), price: 1, unlocked: false, },
                { id: 3, name: require('../assets/avatar/hats/hat3.png'), price: 1, unlocked: false, },
            ],
        // shirts:
        //     [
        //         { id: 0, name: "X", price: 0, unlocked: true, },
        //         { id: 1, name: "👕", price: 2, unlocked: false, },
        //         { id: 2, name: "👔", price: 3, unlocked: false, },
        //         { id: 3, name: "👚", price: 2, unlocked: false, },
        //     ],
        // pants:
        //     [
        //         { id: 0, name: "X", price: 0, unlocked: true, },
        //         { id: 1, name: "👖", price: 2, unlocked: false, },
        //         { id: 2, name: "🩳", price: 2, unlocked: false, },
        //         { id: 3, name: "👗", price: 3, unlocked: false, },
        //     ],
        // shoes:
        //     [
        //         { id: 0, name: "X", price: 0, unlocked: true, },
        //         { id: 1, name: "👟", price: 2, unlocked: false, },
        //         { id: 2, name: "👠", price: 3, unlocked: false, },
        //         { id: 3, name: "🥾", price: 3, unlocked: false, },
        //     ],
        // accessories:
        //     [
        //         { id: 0, name: "X", price: 0, unlocked: true, },
        //         { id: 1, name: "🎒", price: 2, unlocked: false, },
        //         { id: 2, name: "🕶️", price: 3, unlocked: false, },
        //         { id: 3, name: "📿", price: 3, unlocked: false, },
        //     ],
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
                    {() => <Home
                        avatarSelection={avatarSelection}
                        avatarItems={avatarItems}
                    />}
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
                    {() => <Shop 
                        avatarSelection={avatarSelection}
                        setAvatarSelection={setAvatarSelection}
                        avatarItems={avatarItems}
                        setAvatarItems={setAvatarItems}
                    />}
                </Tab.Screen>
                {screen("Settings", Settings, "cog")}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;