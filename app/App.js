import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faComment, faCalendar, faShoppingCart, faCog } from '@fortawesome/free-solid-svg-icons';

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
  buttonLayout,
  setButtonLayout,
  caregiverNumber,
  setCaregiverNumber,
  coins,
  setCoins,
  avatarSelection,
  setAvatarSelection,
  avatarItems,
  setAvatarItems,
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
        <Home
          avatarSelection={avatarSelection}
          avatarItems={avatarItems}
        />
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
          buttonLayout={buttonLayout}
          setCoins={setCoins}
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
          setAvatarItems={setAvatarItems}
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
          setButtonLayout={setButtonLayout}
          caregiverNumber={caregiverNumber}
          setCaregiverNumber={setCaregiverNumber}
        />
      )}
    </Tab.Screen>
  </Tab.Navigator>
);

const App = () => {
  const [buttonLayout, setButtonLayout] = useState(2);
  const [coins, setCoins] = useState(0);
  const [caregiverNumber, setCaregiverNumber] = useState('');

  const [avatarSelection, setAvatarSelection] = useState({
    hats: 0,
    shirts: 0,
    pants: 0,
    shoes: 0,
    accessories: 0,
  });
  const [avatarItems, setAvatarItems] = useState({
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
      {
        id: 1,
        name: require('../assets/avatar/shirts/shirt1.png'),
        price: 1,
        unlocked: false,
      },
      {
        id: 2,
        name: require('../assets/avatar/shirts/shirt2.png'),
        price: 1,
        unlocked: false,
      },
      {
        id: 3,
        name: require('../assets/avatar/shirts/shirt3.png'),
        price: 1,
        unlocked: false,
      },
    ],
    pants: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
      {
        id: 1,
        name: require('../assets/avatar/pants/pants1.png'),
        price: 1,
        unlocked: false,
      },
      {
        id: 2,
        name: require('../assets/avatar/pants/pants2.png'),
        price: 1,
        unlocked: false,
      },
      {
        id: 3,
        name: require('../assets/avatar/pants/pants3.png'),
        price: 1,
        unlocked: false,
      },
    ],
    shoes: [
      {
        id: 0,
        name: require('../assets/avatar/none.png'),
        price: 0,
        unlocked: true,
      },
      {
        id: 1,
        name: require('../assets/avatar/shoes/shoe1.png'),
        price: 2,
        unlocked: false,
      },
      {
        id: 2,
        name: require('../assets/avatar/shoes/shoe2.png'),
        price: 2,
        unlocked: false,
      },
      {
        id: 3,
        name: require('../assets/avatar/shoes/shoe3.png'),
        price: 2,
        unlocked: false,
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('avatarSelection');
        const storedItems = await AsyncStorage.getItem('avatarItems');
        const storedCoins = await AsyncStorage.getItem('coins');
        const storedCaregiverNumber = await AsyncStorage.getItem('caregiverNumber');
        const storedButtonLayout = await AsyncStorage.getItem('buttonLayout');

        if (storedAvatar) setAvatarSelection(JSON.parse(storedAvatar));
        if (storedItems) setAvatarItems(JSON.parse(storedItems));
        if (storedCoins) setCoins(parseInt(storedCoins, 10));
        if (storedCaregiverNumber) setCaregiverNumber(storedCaregiverNumber);
        if (storedButtonLayout) setButtonLayout(parseInt(storedButtonLayout, 10));
      } catch (e) {
        console.warn('Failed to load data', e);
      }
    };
    loadData();
  }, []);


  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('avatarSelection', JSON.stringify(avatarSelection));
        await AsyncStorage.setItem('avatarItems', JSON.stringify(avatarItems));
        await AsyncStorage.setItem('coins', coins.toString());
        await AsyncStorage.setItem('caregiverNumber', caregiverNumber);
        await AsyncStorage.setItem('buttonLayout', buttonLayout.toString());
      } catch (e) {
        console.warn('Failed to save data', e);
      }
    };
    saveData();
  }, [avatarSelection, avatarItems, coins, caregiverNumber, buttonLayout]);

  return (
    <PhrasesProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs">
            {() => (
              <TabScreens
                buttonLayout={buttonLayout}
                setButtonLayout={setButtonLayout}
                caregiverNumber={caregiverNumber}
                setCaregiverNumber={setCaregiverNumber}
                coins={coins}
                setCoins={setCoins}
                avatarSelection={avatarSelection}
                setAvatarSelection={setAvatarSelection}
                avatarItems={avatarItems}
                setAvatarItems={setAvatarItems}
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
