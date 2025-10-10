import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button';
import { usePhrasesContext } from '../context/PhrasesContext';
import Avatar from '../components/avatar';

const Home = ({ avatarSelection, avatarItems }) => {
  const navigation = useNavigation();
  const { allSelections, deleteGroup, navigateToChoice } = usePhrasesContext();

  // Placeholder delete handler
  const handleDeleteGroup = index => {
    if (deleteGroup) deleteGroup(index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar
        size={250}
        avatarSelection={avatarSelection}
        avatarItems={avatarItems}
      />

      <Text style={styles.header}>Last Saved Phrases:</Text>

      {allSelections.length > 0 && (
        <View style={styles.historyContainer}>
          {allSelections.map((group, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={styles.historyButton}
              onLongPress={() => handleDeleteGroup(index)}
            >
              <Text style={styles.historyText}>
                {group.map(item => item.text).join(', ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Button
        title="See More..."
        onPress={() => {
          navigateToChoice({ text: 'Categories' }); // omit id if starting at root
          navigation.navigate('Phrases');
        }}
        color="#2196F3"
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
  grid: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  groupRectangle: {
    width: '48%',
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    padding: 10,
  },
  groupText: {
    fontSize: 16,
    marginVertical: 2,
  },
  historyContainer: {
    width: '95%',
    gap: 10,
    marginVertical: 20,
  },
  historyButton: {
    width: '100%', // almost full width
    paddingVertical: 20, // make it taller
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center', // center text horizontally & vertically
  },
  historyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Home;
