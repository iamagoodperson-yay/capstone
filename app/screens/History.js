import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePhrasesContext } from '../context/PhrasesContext';
import { speak } from '../utils/tts';

const History = () => {
  const navigation = useNavigation();
  const { allSelections, moveGroupToTop, deleteGroup } = usePhrasesContext();

  const handlePressGroup = index => {
    const group = allSelections[index];
    if (!group) return;

    // Speak stored full phrase or fallback to individual items
    if (group.fullSpeech) {
      speak(group.fullSpeech);
    } else if (group.items?.length) {
      const text = group.items.map(i => i.text).join(', ');
      speak(text);
    }

    // Move to top of history
    moveGroupToTop(index);
  };

  const handleDeleteGroup = index => {
    Alert.alert('Delete Group', 'Are you sure you want to delete this group?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteGroup(index),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {allSelections.map((group, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={styles.historyButton}
            onPress={() => handlePressGroup(index)}
            onLongPress={() => handleDeleteGroup(index)}
          >
            <Text style={styles.historyText}>
              {group.fullSpeech ||
                (group.items
                  ? group.items.map(i => i.text).join(', ')
                  : 'Unknown')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10, paddingVertical: 50 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  backButton: { position: 'absolute', padding: 5 },
  backText: { fontSize: 18, color: '#2196F3' },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: { gap: 10, paddingVertical: 10 },
  historyButton: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyText: { fontSize: 18, textAlign: 'center' },
});

export default History;
