import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button';
import { usePhrasesContext } from '../context/PhrasesContext';
import Avatar from '../components/avatar';

const Home = ({ avatarSelection, avatarItems, caregiverNumber }) => {
  const navigation = useNavigation();
  const {
    resetNav,
    getBookmarkedItems,
    navigateToPath,
    navigateToProcessChoice,
  } = usePhrasesContext();
  const bookmarked = getBookmarkedItems();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar
        size={250}
        avatarSelection={avatarSelection}
        avatarItems={avatarItems}
      />

      <Text style={styles.header}>Bookmarked :</Text>

      {bookmarked.length > 0 ? (
        <View style={styles.gridContainer}>
          {bookmarked.map((b, i) => {
            // b is { item, path }
            return (
              <TouchableOpacity
                key={i.toString()}
                style={{
                  width: '48%',
                  height: 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FFE082',
                  borderRadius: 10,
                  padding: 20,
                }}
                onPress={() => {
                  if (b.item.text === 'Emergency')
                    Linking.openURL(`tel:${caregiverNumber}`);
                  else if (b.kind === 'process') {
                    navigateToProcessChoice(b.processId, b.item.text);
                  } else {
                    navigateToPath(b.path);
                  }
                  navigation.navigate('Phrases');
                }}
              >
                <Image
                  source={b.item.image}
                  style={{ width: 60, height: 60 }}
                />
                <Text style={{ fontSize: 20, textAlign: 'center' }}>
                  {b.item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text style={{ fontSize: 16, fontStyle: 'italic', opacity: 0.5 }}>
          No bookmarked items yet.
        </Text>
      )}

      <Button
        title="View Recent History"
        onPress={() => navigation.navigate('History')}
        color="#2196F3"
      />
      <Button
        title="See More..."
        onPress={() => {
          resetNav();
          navigation.navigate('Phrases');
        }}
        color="#2196F3"
      />
      <Button
        title="Solve Daily Challenge"
        onPress={() => navigation.navigate('Challenge')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  gridContainer: {
    width: '85%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default Home;
