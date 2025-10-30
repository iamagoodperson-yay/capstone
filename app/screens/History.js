import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { usePhrasesContext } from '../context/PhrasesContext';
import { speak } from '../utils/tts';

const History = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { allSelections, moveGroupToTop, deleteGroup } = usePhrasesContext();

  const handlePressGroup = index => {
    const group = allSelections[index];
    if (!group) return;

    // Speak stored full phrase or fallback to individual items
    speak(group);

    // Move to top of history
    moveGroupToTop(index);
  };

  const handleDeleteGroup = index => {
    Alert.alert(
      t('screens.history.delTitle'),
      t('screens.history.delMessage'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteGroup(index),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            {'<'} {t('screens.history.backButton')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('screens.history.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {allSelections.map((group, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={styles.historyButton}
            onPress={() => handlePressGroup(index)}
            onLongPress={() => handleDeleteGroup(index)}
          >
            <Text style={styles.historyText}>{group}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  backButton: { marginLeft: 5, padding: 10 },
  backText: { fontSize: 20, color: '#2196F3' },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: { gap: 10, paddingVertical: 10, alignItems: 'center' },
  historyButton: {
    width: '90%',
    padding: 20,
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyText: { fontSize: 18 },
});

export default History;
