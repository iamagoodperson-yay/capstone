import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faComment,
  faCalendar,
  faShoppingCart,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

import Home from './screens/Home';
import Phrases from './screens/Phrases';
import Daily from './screens/Daily';
import Shop from './screens/Shop';
import Settings from './screens/Settings';
import History from './screens/History';
import { PhrasesProvider } from './context/PhrasesContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreens = ({
  selectedPhrase,
  setSelectedPhrase,
  buttonLayout,
  setButtonLayout,
  caregiverNumber,
  setCaregiverNumber,
  coins,
  setCoins,
  avatarSelection,
  setAvatarSelection,
  avatarItems,
}) => (
  <Tab.Navigator
    screenOptions={{
      headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
      headerTitleAlign: 'center',
      tabBarLabelStyle: { fontSize: 14 },
    }}
  >
    <Tab.Screen
      name="Home"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faHome} color={color} size={size} />
        ),
      }}
    >
      {() => (
        <Home avatarSelection={avatarSelection} avatarItems={avatarItems} />
      )}
    </Tab.Screen>

    <Tab.Screen
      name="Phrases"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faComment} color={color} size={size} />
        ),
      }}
    >
      {() => (
        <Phrases
          setSelectedPhrase={setSelectedPhrase}
          buttonLayout={buttonLayout}
          caregiverNumber={caregiverNumber}
        />
      )}
    </Tab.Screen>

    <Tab.Screen
      name="Challenge"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faCalendar} color={color} size={size} />
        ),
      }}
    >
      {() => (
        <Daily
          selectedPhrase={selectedPhrase}
          setSelectedPhrase={setSelectedPhrase}
          buttonLayout={buttonLayout}
          coins={coins}
        />
      )}
    </Tab.Screen>

    <Tab.Screen
      name="Shop"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faShoppingCart} color={color} size={size} />
        ),
      }}
    >
      {() => (
        <Shop
          coins={coins}
          setCoins={setCoins}
          avatarSelection={avatarSelection}
          setAvatarSelection={setAvatarSelection}
          avatarItems={avatarItems}
        />
      )}
    </Tab.Screen>

    <Tab.Screen
      name="Settings"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faCog} color={color} size={size} />
        ),
      }}
    >
      {() => (
        <Settings
          buttonLayout={buttonLayout}
          caregiverNumber={caregiverNumber}
          setCaregiverNumber={setCaregiverNumber}
        />
      )}
    </Tab.Screen>
  </Tab.Navigator>
);

const App = () => {
  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [buttonLayout, setButtonLayout] = useState(2);
  const [coins, setCoins] = useState(100);
  const [caregiverNumber, setCaregiverNumber] = useState('');

  const [avatarSelection, setAvatarSelection] = useState({
    hats: 0,
    shirts: 0,
    pants: 0,
    shoes: 0,
    accessories: 0,
  });

  const [avatarItems] = useState({
    hats: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
      {
        id: 1,
        name: require('../assets/avatar/hats/hat1.png'),
        price: 1,
        unlocked: false,
      },
      {
        id: 2,
        name: require('../assets/avatar/hats/hat2.png'),
        price: 1,
        unlocked: false,
      },
      {
        id: 3,
        name: require('../assets/avatar/hats/hat3.png'),
        price: 1,
        unlocked: false,
      },
    ],
    shirts: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
    ],
    pants: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
    ],
    shoes: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
    ],
    accessories: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
    ],
  });

  return (
    <PhrasesProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs">
            {() => (
              <TabScreens
                selectedPhrase={selectedPhrase}
                setSelectedPhrase={setSelectedPhrase}
                buttonLayout={buttonLayout}
                caregiverNumber={caregiverNumber}
                setCaregiverNumber={setCaregiverNumber}
                coins={coins}
                setCoins={setCoins}
                avatarSelection={avatarSelection}
                setAvatarSelection={setAvatarSelection}
                avatarItems={avatarItems}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhrasesProvider>
  );
};

export default App;
