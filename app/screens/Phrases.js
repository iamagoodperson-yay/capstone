import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Modal,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { initTTS, speak } from '../utils/tts';
import { usePhrasesContext } from '../context/PhrasesContext';
import Button from '../components/button';
import Cell from '../components/cell';

const Phrases = ({ buttonLayout, daily, caregiverNumber }) => {
  const insets = useSafeAreaInsets();
  const {
    inProcess,
    getCurrent,
    navigateToChoice,
    selectPhrase,
    getSpeechText,
    goBack,
    canGoBack,
    getBreadcrumbs,
    addCategory,
    deleteCategory,
    editCategory,
    addTask,
    addChoiceToTask,
  } = usePhrasesContext();

  const current = getCurrent();
  const breadcrumbs = getBreadcrumbs().join(' > ');
  const speechText = getSpeechText();

  const [searchQuery, setSearchQuery] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddProcess, setIsAddProcess] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Process configuration
  const [taskTitle, setTaskTitle] = useState('');
  const [processSpeech, setProcessSpeech] = useState('');
  const [processMultiSelect, setProcessMultiSelect] = useState(false);
  const [processDiverge, setProcessDiverge] = useState(false);

  const [editText, setEditText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editParent, setEditParent] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    initTTS();
  }, []);

  // Handle selecting or navigating
  const handlePress = item => {
    if (inProcess) {
      item.usageCount = (item.usageCount || 0) + 1;
      selectPhrase(item);
    } else {
      if (item.text === 'Emergency') Linking.openURL(`tel:${caregiverNumber}`);
      else if (item.type === 'phrase') speak(item.text);
      else {
        item.usageCount = (item.usageCount || 0) + 1;
        navigateToChoice(item);
      }
    }
  };

  const handleAdd = () => {
    if (!newItemText.trim()) {
      Alert.alert('Error', 'Please enter some text.');
      return;
    }
    setIsAdding(true);

    if (inProcess) {
      if (current.diverge) {
        if (!taskTitle.trim()) {
          Alert.alert('Error', 'Please enter a title for the process.');
          setIsAdding(false);
          return;
        } else if (!processSpeech.trim()) {
          Alert.alert('Error', 'Please enter speech text for the process.');
          setIsAdding(false);
          return;
        }

        const id = Date.now().toString();
        const newChoice = {
          text: newItemText.trim(),
          image: selectedImage || null,
          next: id,
          usageCount: 0,
        };
        addChoiceToTask(current.id, newChoice);

        const newTask = createTask(
          id,
          taskTitle.trim(),
          processSpeech.trim(),
          processMultiSelect,
          processDiverge,
          'end',
        );
        addTask(newTask);
      } else {
        const newChoice = {
          text: newItemText.trim(),
          image: selectedImage || null,
          usageCount: 0,
        };
        addChoiceToTask(current.id, newChoice);
      }
    } else if (isAddProcess) {
      if (!taskTitle.trim()) {
        Alert.alert('Error', 'Please enter a title for the process.');
        setIsAdding(false);
        return;
      } else if (!processSpeech.trim()) {
        Alert.alert('Error', 'Please enter speech text for the process.');
        setIsAdding(false);
        return;
      }

      const id = Date.now().toString();
      const newCategory = {
        text: newItemText.trim(),
        image: selectedImage || null,
        id: id,
        usageCount: 0,
      };
      addCategory(current, newCategory);

      const newTask = {
        id: id,
        text: taskTitle.trim(),
        speech: processSpeech.trim(),
        multiSelect: processMultiSelect,
        diverge: processDiverge,
        next: 'end',
      };
      addTask(newTask);
    } else {
      const newCategory = {
        text: newItemText.trim(),
        image: selectedImage || null,
        choices: [],
        usageCount: 0,
      };
      addCategory(current, newCategory);
    }

    resetFormFields();
  };

  const createTask = (
    id,
    title,
    speech,
    multiSelect = false,
    diverge = false,
    nextId = 'end',
  ) => ({
    id,
    text: title,
    speech,
    multiSelect,
    diverge,
    choices: [],
    next: nextId,
  });

  const resetFormFields = () => {
    setIsAddProcess(false);
    setTaskTitle('');
    setProcessSpeech('');
    setProcessMultiSelect(false);
    setProcessDiverge(false);
    setNewItemText('');
    setSelectedImage(null);
    setAddModal(false);
    setIsAdding(false);
  };

  const handleEditConfirm = () => {
    if (!editText.trim() || !editingItem) return;
    if (editingItem.image !== editImage) editingItem.image = editImage;
    editCategory(editParent, editingItem, editText.trim());
    setEditText('');
    setEditingItem(null);
    setEditParent(null);
    setEditImage(null);
    setEditModal(false);
  };

  // Filter choices by search query and sort by usageCount
  const getFilteredChoices = choices => {
    const filtered = (choices || []).filter(c =>
      c.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return filtered.sort((a, b) => {
      const countA = a.usageCount || 0;
      const countB = b.usageCount || 0;
      if (countA !== countB) return countB - countA;
      return a.text.localeCompare(b.text);
    });
  };

  const renderChoices = () => {
    const sortedChoices = getFilteredChoices(current.choices);
    return sortedChoices.map((item, index) => (
      <Cell
        key={index.toString()}
        content={item}
        buttonlayout={buttonLayout}
        onPress={() => handlePress(item)}
        onLongPress={() => {
          Alert.alert(
            'Edit or Delete',
            `What would you like to do with "${item.text}"?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Edit',
                onPress: () => {
                  setEditText(item.text);
                  setEditingItem(item);
                  setEditParent(current);
                  setEditImage(item.image || null);
                  setEditModal(true);
                },
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteCategory(current, item.text),
              },
            ],
          );
        }}
        delayLongPress={500}
      />
    ));
  };

  const renderProcess = () => {
    const sortedChoices = getFilteredChoices(current.choices);
    return (
      <>
        <Cell
          content={{
            text: speechText,
            image: require('../../assets/phrases/speaker.png'),
          }}
          buttonlayout={4}
          onPress={() => speak(speechText)}
          height={0.2}
        />
        {sortedChoices.map((item, index) => (
          <Cell
            key={index.toString()}
            content={item}
            buttonlayout={buttonLayout}
            onPress={() => handlePress(item)}
            onLongPress={() => {
              Alert.alert('Edit Option', `Edit text for "${item.text}"?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Edit',
                  onPress: () => {
                    setEditText(item.text);
                    setEditingItem(item);
                    setEditParent(null);
                    setEditImage(item.image || null);
                    setEditModal(true);
                  },
                },
              ]);
            }}
          />
        ))}
        <Cell
          content={{ text: 'Next', type: 'next' }}
          buttonlayout={3}
          height={0.1}
          onPress={() => {
            try {
              navigateToChoice(null);
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          }}
        />
      </>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <View style={styles.topBar}>
          {canGoBack ? (
            <TouchableOpacity style={styles.backBtn} onPress={goBack}>
              <Text style={styles.backText}>&lt;</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
          <Text style={styles.header}>{current.text}</Text>
          {daily ? (
            <View style={styles.spacer} />
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setAddModal(true)}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        {canGoBack && <Text style={styles.breadcrumbs}>{breadcrumbs}</Text>}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search phrases..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {inProcess ? renderProcess() : renderChoices()}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: { alignItems: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backBtn: {
    backgroundColor: '#d9d9d9',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  backText: { fontSize: 30 },
  addBtn: {
    backgroundColor: '#4CAF50',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  addText: { color: '#fff', fontSize: 30, fontWeight: '500' },
  spacer: { width: 70 },
  header: { fontSize: 40, fontWeight: '500' },
  breadcrumbs: { fontSize: 20 },
  searchContainer: {
    width: '95%',
    marginVertical: 10,
  },
  searchInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 8,
  },
});

export default Phrases;
