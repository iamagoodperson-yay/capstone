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

      <Button
        title="View Recent History"
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      />
      <Button
        title="See More..."
        onPress={() => {
          navigateToChoice({ text: 'Categories' });
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
  historyContainer: {
    width: '95%',
    gap: 10,
    marginVertical: 20,
  },
  historyButton: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Home;
