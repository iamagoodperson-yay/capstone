import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faComment, faCalendar, faShoppingCart, faCog } from '@fortawesome/free-solid-svg-icons';

import Home from './screens/Home';
import Phrases from './screens/Phrases';
import Daily from './screens/Daily';
import Shop from './screens/Shop';
import Settings from './screens/Settings';
import { PhrasesProvider } from './context/PhrasesContext';

const Tab = createBottomTabNavigator();

const screen = (name, component, icon) => {
    return (
        <Tab.Screen
            name={name}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <FontAwesomeIcon 
                        icon={icon} 
                        color={color} 
                        size={size} 
                    />
                ),
            }}
        >
            {() => (component)}
        </Tab.Screen>
    );
}

const App = () => {
    const [selectedPhrase, setSelectedPhrase] = useState("");
    const [buttonLayout, setButtonLayout] = useState(2);
    const [coins, setCoins] = useState(100);
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
        shirts:
            [
                { id: 0, name: require('../assets/avatar/none.png'), price: 0, unlocked: true, },
                { id: 1, name: require('../assets/avatar/shirts/shirt1.png'), price: 2, unlocked: false, },
            ],
        pants:
            [
                { id: 0, name: require('../assets/avatar/none.png'), price: 0, unlocked: true, },
                // { id: 1, name: require('../assets/avatar/pants/pant1.png'), price: 2, unlocked: false, },
            ],
        shoes:
            [
                { id: 0, name: require('../assets/avatar/none.png'), price: 0, unlocked: true, },
                // { id: 1, name: require('../assets/avatar/shoes/shoe1.png'), price: 2, unlocked: false, },
            ],
        accessories:
            [
                { id: 0, name: require('../assets/avatar/none.png'), price: 0, unlocked: true, },
                // { id: 1, name: require('../assets/avatar/accessories/accessory1.png'), price: 2, unlocked: false, },
            ],
    });

    return (
        <PhrasesProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        headerTitleStyle: {
                            fontSize: 24,
                            fontWeight: 'bold',
                        },
                        headerTitleAlign: 'center',
                        tabBarLabelStyle: {
                            fontSize: 14,
                        },
                }}>
                    {screen("Home", <Home
                        avatarSelection={avatarSelection}
                        avatarItems={avatarItems}
                    />, faHome)}
                    {screen("Phrases", <Phrases
                        setSelectedPhrase={setSelectedPhrase}
                        buttonLayout={buttonLayout}
                        sent_id='categories'
                    />, faComment)}
                    {screen("Challenge", <Daily
                        selectedPhrase={selectedPhrase}
                        setSelectedPhrase={setSelectedPhrase}
                        buttonLayout={buttonLayout}
                        coins={coins}
                        setCoins={setCoins}
                    />, faCalendar)}
                    {screen("Shop", <Shop 
                        coins={coins}
                        setCoins={setCoins}
                        avatarSelection={avatarSelection}
                        setAvatarSelection={setAvatarSelection}
                        avatarItems={avatarItems}
                        setAvatarItems={setAvatarItems}
                    />, faShoppingCart)}
                    {screen("Settings", <Settings
                        buttonLayout={buttonLayout}
                        setButtonLayout={setButtonLayout}
                    />, faCog)}
                </Tab.Navigator>
            </NavigationContainer>
        </PhrasesProvider>
    );
}

export default App;