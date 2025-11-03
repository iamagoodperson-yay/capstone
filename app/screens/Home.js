// app/screens/Home.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Camera, CameraType } from 'react-native-camera-kit';
import { usePhrasesContext } from '../context/PhrasesContext';
import Avatar from '../components/avatar';
import Button from '../components/button';
import { speak } from '../utils/tts';

const Home = ({
  avatarSelection,
  avatarItems,
  caregiverNumber,
  coins,
  setCoins,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    resetNav,
    getBookmarkedItems,
    bookmarkedHistory,
    navigateToPath,
    navigateToProcessChoice,
    toggleBookmark,
  } = usePhrasesContext();

  const bookmarked = getBookmarkedItems();
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = event => {
    setShowScanner(false);

    let data = null;
    if (!event) {
      data = null;
    } else if (typeof event === 'string') {
      data = event;
    } else if (event.nativeEvent && event.nativeEvent.codeStringValue) {
      data = event.nativeEvent.codeStringValue;
    } else if (event.codeStringValue) {
      data = event.codeStringValue;
    } else if (event.data) {
      data = event.data;
    }

    if (!data) {
      Alert.alert('Invalid QR code', 'No data found.');
      return;
    }

    const parts = data.trim().split('/');
    if (parts.length >= 4 && parts[0] === 'run') {
      runFunction(parts[1], parts[2], parts[3]);
    } else {
      Alert.alert('Scanned data', data);
    }
  };

  //function example: run/give/2/Person

  const runFunction = (category, numberOfCoins, giver) => {
    const numberOfCoinsInt = parseInt(numberOfCoins, 10);
    if (category === 'give') {
      Alert.alert(`${giver} awarded you ${numberOfCoinsInt} Coins!`);
      setCoins(coins + numberOfCoinsInt);
    }
  };

  if (showScanner) {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          cameraType={CameraType.Back}
          // enable barcode scanning
          scanBarcode={true}
          // the camera kit uses onReadCode (this matches v16 shape)
          onReadCode={handleScan}
        />
        <View style={styles.scannerCancel}>
          <Button 
            title="Cancel"
            onPress={() => setShowScanner(false)}
            color="#DC3545"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Avatar
          size={250}
          avatarSelection={avatarSelection}
          avatarItems={avatarItems}
        />
        <Text style={styles.header}>{t('screens.home.bookmarked')}</Text>

        {bookmarked.length > 0 ||
        (bookmarkedHistory && bookmarkedHistory.length > 0) ? (
          <>
            {bookmarked.length > 0 && (
              <View style={styles.gridContainer}>
                {bookmarked.map((b, i) => (
                  <TouchableOpacity
                    key={i.toString()}
                    style={styles.bookmarkCell}
                    onPress={() => {
                      if (b.item.text === 'Emergency')
                        Linking.openURL(`tel:${caregiverNumber}`);
                      else if (b.kind === 'process')
                        navigateToProcessChoice(b.processId, b.item.text);
                      else navigateToPath(b.path);
                      navigation.navigate('Phrases');
                    }}
                    onLongPress={() =>
                      Alert.alert(
                        t('screens.phrases.AlertTitle') || 'Manage Bookmark',
                        t('screens.phrases.AlertMessage') ||
                          'Do you want to delete this bookmark?',
                        [
                          {
                            text: t('screens.phrases.Cancel'),
                            style: 'cancel',
                          },
                          {
                            text: t('screens.phrases.Delete') || 'Delete',
                            onPress: () => toggleBookmark(b.item.text),
                          },
                        ],
                      )
                    }
                  >
                    <Image
                      source={b.item.image}
                      style={{ width: 60, height: 60 }}
                    />
                    <Text style={styles.bookmarkText}>{b.item.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {bookmarkedHistory && bookmarkedHistory.length > 0 && (
              <View style={styles.historyContainer}>
                {bookmarkedHistory.map((group, i) => (
                  <TouchableOpacity
                    key={`hist-${i}`}
                    style={styles.doubleBookmarkCell}
                    onPress={() => speak(group)}
                  >
                    <Text style={styles.bookmarkText}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noBookmarksText}>
            {t('screens.home.noBookmarks')}
          </Text>
        )}

        <Button
          title={t('screens.home.seeMore')}
          onPress={() => {
            resetNav();
            navigation.navigate(t('tabs.phrases'));
          }}
          color="#2196F3"
        />
        <Button
          title={t('screens.home.recentHistory')}
          onPress={() => navigation.navigate(t('tabs.history'))}
          color="#2196F3"
        />
        <Button
          title={t('screens.home.daily')}
          onPress={() => navigation.navigate(t('tabs.challenge'))}
        />
        <Button
          title={t('screens.home.scanQR')}
          onPress={() => setShowScanner(true)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 40,
  },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  gridContainer: {
    width: '85%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  bookmarkCell: {
    width: '48%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE082',
    borderRadius: 10,
    padding: 20,
  },
  doubleBookmarkCell: {
    width: '93%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE082',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center',
  },
  historyContainer: { width: '85%', marginTop: 10, alignItems: 'center' },
  bookmarkText: { fontSize: 20, textAlign: 'center' },
  noBookmarksText: { fontSize: 16, fontStyle: 'italic', opacity: 0.5 },
  scannerCancel: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default Home;
