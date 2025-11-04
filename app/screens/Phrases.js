import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { speak } from '../utils/tts';
import { usePhrasesContext } from '../context/PhrasesContext';
import { useTranslation } from 'react-i18next';
import Button from '../components/button';
import Cell from '../components/cell';
import Dropdown from '../components/dropdown';
import ImagePicker from '../components/imagePicker';

const Phrases = ({ buttonLayout, daily, caregiverNumber }) => {
  const { t } = useTranslation();
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
    deletePhrase,
    editPhrase,
    addTask,
    addChoiceToTask,
    getAllTaskIds,
    bookmarkedTexts,
    toggleBookmark,
  } = usePhrasesContext();

  const current = getCurrent();
  const breadcrumbs = getBreadcrumbs()
    .map(crumb => t(`phrases.${crumb}`) || crumb)
    .join(' > ');

  const [searchQuery, setSearchQuery] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddProcess, setIsAddProcess] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Process configuration fields
  const [taskChoices, setTaskChoices] = useState([]);
  const [targetTask, setTargetTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [processSpeech, setProcessSpeech] = useState('');
  const [processMultiSelect, setProcessMultiSelect] = useState(false);
  const [processDiverge, setProcessDiverge] = useState(false);

  // Edit modal fields
  const [editText, setEditText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editParent, setEditParent] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    // If multi-select is enabled, ensure diverge is disabled
    if (processMultiSelect && processDiverge) {
      setProcessDiverge(false);
    }
  }, [processMultiSelect, processDiverge]);

  const handlePress = item => {
    if (!item) return;
    if (inProcess) {
      selectPhrase(item);
    } else {
      if (item.text === 'Emergency') Linking.openURL(`tel:${caregiverNumber}`);
      else if (item.type === 'phrase') speak(item.text);
      else {
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

        const id =
          taskTitle.trim().toLowerCase().replace(/\s+/g, '_') +
          '_' +
          newItemText.trim().toLowerCase().replace(/\s+/g, '_') +
          '_' +
          Date.now().toString();
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
      if (targetTask === 'New Task') {
        if (!taskTitle.trim()) {
          Alert.alert('Error', 'Please enter a title for the process.');
          setIsAdding(false);
          return;
        } else if (!processSpeech.trim()) {
          Alert.alert('Error', 'Please enter speech text for the process.');
          setIsAdding(false);
          return;
        }

        const id =
          taskTitle.trim().toLowerCase().replace(/\s+/g, '_') +
          '_' +
          Date.now().toString();
        const newCategory = {
          text: newItemText.trim(),
          image: selectedImage || null,
          id: id,
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
      }
    } else {
      const newCategory = {
        text: newItemText.trim(),
        image: selectedImage || null,
        choices: [],
        usageCount: 0,
      };
      addCategory(current, newCategory);
    }

    // Reset all form fields
    resetAdd();
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

  const resetAdd = () => {
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

  const handleEdit = () => {
    if (!editText.trim()) {
      Alert.alert('Error', 'Please put in some text in the text field.');
      setIsAdding(false);
      return;
    }

    if (editingItem.text !== editText.trim()) {
      editingItem.text = editText.trim();
    }
    if (editingItem.image && editingItem.image !== editImage) {
      editingItem.image = editImage;
    }
    if (editingItem.speech && editingItem.speech !== processSpeech) {
      editingItem.speech = processSpeech;
    }
    if (
      editingItem.multiSelect !== null &&
      editingItem.multiSelect !== processMultiSelect
    ) {
      editingItem.multiSelect = processMultiSelect;
    }
    if (
      editingItem.diverge !== null &&
      editingItem.diverge !== processDiverge
    ) {
      editingItem.diverge = processDiverge;
      editingItem.next = null;
    }
    if (
      inProcess && current.id === editingItem.id ? !editingItem.diverge : true
    ) {
      if (editingItem.next !== targetTask) {
        if (targetTask === 'End (no next task)') {
          editingItem.next = 'end';
        } else {
          editingItem.next = targetTask;
        }
      }
    }

    editPhrase(editParent, editingItem);
    resetEdit();
  };

  const resetEdit = () => {
    setEditText('');
    setEditingItem(null);
    setEditParent(null);
    setEditImage(null);
    setTaskChoices([]);
    setTargetTask(null);
    setTaskTitle('');
    setProcessSpeech('');
    setProcessMultiSelect(false);
    setProcessDiverge(false);
    setEditModal(false);
  };

  // ---------------- SEARCH ----------------
  const getFilteredChoices = choices => {
    const results = [];
    const searchRecursive = (items, parentPath = []) => {
      if (!items) return;
      items.forEach(item => {
        const fullPath = [...parentPath, item.text];
        if (
          item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.speech &&
            item.speech.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          results.push({ ...item, path: fullPath.join(' > ') });
        }
        if (item.choices && item.choices.length)
          searchRecursive(item.choices, fullPath);
      });
    };
    searchRecursive(choices);
    return results;
  };

  // ---------------- RENDER CHOICES ----------------
  const renderChoices = () => {
    const choicesToShow = searchQuery
      ? getFilteredChoices(current.choices)
      : current.choices;

    // Filter out processes unless inProcess or in search mode
    const filtered = choicesToShow.filter(
      c => !c.speech || inProcess || searchQuery,
    );

    // Sort by bookmark -> usageCount -> alphabetical
    filtered.sort((a, b) => {
      const aBook = bookmarkedTexts.includes(a.text) ? 1 : 0;
      const bBook = bookmarkedTexts.includes(b.text) ? 1 : 0;
      if (aBook !== bBook) return bBook - aBook;
      const countA = a.usageCount || 0;
      const countB = b.usageCount || 0;
      if (countA !== countB) return countB - countA;
      return a.text.localeCompare(b.text);
    });

    return filtered.map((item, index) => (
      <Cell
        key={index.toString()}
        content={{
          transText: t(`phrases.${item.text}`, {
            defaultValue: item.text,
          }),
          text: item.text,
          subtitle: searchQuery ? item.path : undefined,
          image: item.image,
          type: item.type,
          bookmarked: bookmarkedTexts.includes(item.text),
        }}
        buttonlayout={buttonLayout}
        onPress={() => handlePress(item)}
        onLongPress={() => {
          Alert.alert(
            `${t(`screens.phrases.Edit or Bookmark`)}"${t(
              `phrases.${item.text}`,
              { defaultValue: item.text },
            )}"?`,
            '',
            [
              { text: t('screens.phrases.Cancel'), style: 'cancel' },
              {
                text: bookmarkedTexts.includes(item.text)
                  ? t('screens.phrases.Remove Bookmark')
                  : t('screens.phrases.Bookmark'),
                onPress: () => toggleBookmark(item.text),
              },
              {
                text: t('screens.phrases.Edit'),
                onPress: () => {
                  setEditText(item.text);
                  setEditingItem(item);
                  setEditParent(current);
                  setEditImage(item.image || null);
                  setEditModal(true);
                },
              },
            ],
          );
        }}
      />
    ));
  };

  const renderProcess = () => {
    if (!inProcess) return null;

    const choicesToShow = searchQuery
      ? getFilteredChoices(current.choices)
      : current.choices;

    // Filter out processes unless inProcess or in search mode
    const filtered = choicesToShow.filter(
      c => !c.speech || inProcess || searchQuery,
    );

    // Sort by bookmark -> usageCount -> alphabetical
    filtered.sort((a, b) => {
      const aBook = bookmarkedTexts.includes(a.text) ? 1 : 0;
      const bBook = bookmarkedTexts.includes(b.text) ? 1 : 0;
      if (aBook !== bBook) return bBook - aBook;
      const countA = a.usageCount || 0;
      const countB = b.usageCount || 0;
      if (countA !== countB) return countB - countA;
      return a.text.localeCompare(b.text);
    });

    return (
      <>
        {/* Top speech cell */}
        <Cell
          content={{
            transText: t(`phrases.${getSpeechText()}`, {
              defaultValue: getSpeechText(),
            }),
            text: getSpeechText(),
            image: require('../../assets/phrases/speaker.png'),
            type: 'speech',
          }}
          buttonlayout={4}
          onPress={() => speak(getSpeechText(true))}
          onLongPress={() => {
            Alert.alert(`Edit current task "${current.text}"?`, '', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Edit',
                onPress: () => {
                  setEditText(current.text);
                  setEditingItem(current);
                  setEditParent(null);
                  setEditImage(null);
                  setProcessSpeech(current.speech);
                  setProcessMultiSelect(current.multiSelect);
                  setProcessDiverge(current.diverge);
                  setEditModal(true);
                  const choices = getAllTaskIds();
                  setTargetTask(
                    choices.find(c => c === current.next) || current.next,
                  );
                  setTaskChoices(['End (no next task)', ...choices]);
                },
              },
            ]);
          }}
          height={0.2}
        />

        {/* Choices */}
        {filtered.map((item, index) => (
          <Cell
            key={index.toString()}
            content={{
              text: item.text,
              transText: t(`phrases.${item.text}`, {
                defaultValue: item.text,
              }),
              subtitle: searchQuery ? item.path : undefined,
              image: item.image,
              type: item.type,
              bookmarked: bookmarkedTexts.includes(item.text),
            }}
            buttonlayout={buttonLayout}
            onPress={() => handlePress(item)}
            onLongPress={() => {
              Alert.alert(`Edit or Bookmark "${item.text}"?`, '', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: bookmarkedTexts.includes(item.text)
                    ? 'Remove Bookmark'
                    : 'Bookmark',
                  onPress: () => toggleBookmark(item.text),
                },
                {
                  text: 'Edit',
                  onPress: () => {
                    setEditText(item.text);
                    setEditingItem(item);
                    setEditParent(null);
                    setEditImage(item.image || null);
                    setProcessSpeech(null);
                    setProcessMultiSelect(null);
                    setProcessDiverge(null);
                    if (item.next) {
                      const choices = getAllTaskIds();
                      setTargetTask(
                        choices.find(c => c === item.next) || item.next,
                      );
                      setTaskChoices(['End (no next task)', ...choices]);
                    }
                    setEditModal(true);
                  },
                },
              ]);
            }}
          />
        ))}

        {/* Next button */}
        <Cell
          content={{ text: 'Next', transText: t('screens.phrases.next'), type: 'next' }}
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
          <View style={styles.titleContainer}>
            <Text style={styles.header}>
                {t(`phrases.${current.text}`, { defaultValue: current.text })}
            </Text>
          </View>
          {daily ? (
            <View style={styles.spacer} />
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setAddModal(true);
                setTargetTask('New Task');
                setTaskChoices(['New Task', ...getAllTaskIds()]);
              }}
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
            placeholder={t('screens.phrases.searchPhrases')}
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {inProcess ? renderProcess() : renderChoices()}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={addModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModal(false)}
      >
        <SafeAreaView
          style={[styles.modalSafeArea, { paddingTop: insets.top }]}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.modalContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            keyboardDismissMode="interactive"
          >
            <Text style={styles.modalTitle}>
              {(inProcess
                ? current.diverge
                  ? t('screens.phrases.add.addNewTaskTitle')
                  : t('screens.phrases.add.addCurrentTaskTitle')
                : t('screens.phrases.add.addTitle'))}
            </Text>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>
                {inProcess
                  ? t('screens.phrases.add.choiceText')
                  : (isAddProcess ? t('screens.phrases.add.processText') : t('screens.phrases.add.catText'))}
              </Text>
              <TextInput
                style={styles.textInput}
                value={newItemText}
                onChangeText={setNewItemText}
              />
            </View>
            <ImagePicker
              selectedImage={selectedImage}
              onImageSelected={setSelectedImage}
              onImageRemoved={() => setSelectedImage(null)}
            />
            {!inProcess && (
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>{t('screens.phrases.add.processOrCat')}</Text>
                <View style={styles.switchRow}>
                  <Switch
                    value={isAddProcess}
                    onValueChange={setIsAddProcess}
                  />
                  <Text style={styles.switchText}>
                    {isAddProcess ? t('screens.phrases.add.process') : t('screens.phrases.add.category')}
                  </Text>
                </View>
              </View>
            )}
            {(!inProcess && isAddProcess) || (inProcess && current.diverge) ? (
              <>
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t('screens.phrases.add.targetTask')}</Text>
                  <Dropdown
                    values={taskChoices}
                    base={targetTask}
                    changebase={setTargetTask}
                  />
                </View>
                {targetTask === 'New Task' ? (
                  <>
                    <View style={styles.inputSection}>
                      <Text style={styles.inputLabel}>{t('screens.phrases.add.taskTitle')}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={taskTitle}
                        onChangeText={setTaskTitle}
                      />
                    </View>

                    <View style={styles.inputSection}>
                      <Text style={styles.inputLabel}>{t('screens.phrases.add.speechText')}</Text>
                      <TextInput
                        style={styles.textInput}
                        value={processSpeech}
                        onChangeText={setProcessSpeech}
                      />
                    </View>

                    <View style={styles.inputSection}>
                      <Text style={styles.inputLabel}>{t('screens.phrases.add.processSettings')}</Text>
                      <View style={styles.switchRow}>
                        <Switch
                          value={processMultiSelect}
                          onValueChange={setProcessMultiSelect}
                        />
                        <Text style={styles.switchText}>
                          {t('screens.phrases.add.multiChoice')}
                        </Text>
                      </View>
                      <View style={{ height: 5 }} />
                      <View style={styles.switchRow}>
                        <Switch
                          disabled={processMultiSelect}
                          value={processDiverge}
                          onValueChange={setProcessDiverge}
                        />
                        <Text style={styles.switchText}>
                          {t('screens.phrases.add.diverge')}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={{ height: 150 }} />
                )}
              </>
            ) : null}
            <View style={styles.buttonRow}>
              <Button
                title={t('screens.phrases.add.close')}
                width="0.4"
                color="#DC3545"
                onPress={resetAdd}
              />
              <Button
                title={isAdding ? t('screens.phrases.add.adding') : t('screens.phrases.add.add')}
                width="0.4"
                onPress={handleAdd}
                disabled={isAdding}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setEditModal(false);
          setEditImage(null);
        }}
      >
        <SafeAreaView
          style={[styles.modalSafeArea, { paddingTop: insets.top }]}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.modalContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            keyboardDismissMode="interactive"
          >
            <Text style={styles.modalTitle}>{t('screens.phrases.edit.editTitle')}</Text>
            <Button
              title={t('screens.phrases.edit.delete')}
              width="0.8"
              color="#DC3545"
              onPress={() => {
                Alert.alert(
                  t('screens.phrases.edit.confirmDeleteTitle'),
                  t('screens.phrases.edit.confirmDeleteMsg', { item: editingItem.text }),
                  [
                    { text: t('screens.phrases.edit.cancel'), style: 'cancel' },
                    {
                      text: t('screens.phrases.edit.delete'),
                      style: 'destructive',
                      onPress: () => {
                        if (editingItem.id) {
                          deletePhrase(editParent, editingItem.id);
                        } else {
                          deletePhrase(editParent || current, editingItem.text);
                        }
                        resetEdit();
                        if (inProcess && editingItem.id === current.id) {
                          goBack();
                        }
                      },
                    },
                  ],
                );
              }}
            />
            {!inProcess || (inProcess && editingItem?.id !== current?.id) ? (
              <>
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t('screens.phrases.edit.editText')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editText}
                    onChangeText={setEditText}
                  />
                </View>
                {inProcess &&
                  (current.diverge
                    ? editingItem?.id !== current?.id
                    : editingItem?.id === current?.id) && (
                    <View style={styles.inputSection}>
                      <Text style={styles.inputLabel}>{t('screens.phrases.edit.editTargetTask')}</Text>
                      <Dropdown
                        values={taskChoices}
                        base={targetTask}
                        changebase={setTargetTask}
                        width="0.85"
                      />
                    </View>
                  )}
                {(!inProcess || editingItem?.id !== current?.id) && (
                  <ImagePicker
                    selectedImage={editImage}
                    onImageSelected={setEditImage}
                    onImageRemoved={() => setEditImage(null)}
                  />
                )}
              </>
            ) : (
              <>
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t('screens.phrases.add.taskTitle')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editText}
                    onChangeText={setEditText}
                  />
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t('screens.phrases.add.speechText')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={processSpeech}
                    onChangeText={setProcessSpeech}
                  />
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>{t('screens.phrases.add.processSettings')}</Text>
                  <View style={styles.switchRow}>
                    <Switch
                      value={processMultiSelect}
                      onValueChange={setProcessMultiSelect}
                    />
                    <Text style={styles.switchText}>
                        {t('screens.phrases.add.multiChoice')}
                    </Text>
                  </View>
                  <View style={{ height: 5 }} />
                  <View style={styles.switchRow}>
                    <Switch
                      disabled={processMultiSelect}
                      value={processDiverge}
                      onValueChange={setProcessDiverge}
                    />
                    <Text style={styles.switchText}>{t('screens.phrases.add.diverge')}</Text>
                  </View>
                </View>

                {!processDiverge && (
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>{t('screens.phrases.edit.targetTask')}</Text>
                    <Dropdown
                      values={taskChoices}
                      base={targetTask}
                      changebase={setTargetTask}
                      width="0.85"
                    />
                  </View>
                )}
              </>
            )}
            <View style={styles.buttonRow}>
              <Button
                title={t('screens.phrases.edit.cancel')}
                width="0.4"
                color="#DC3545"
                onPress={resetEdit}
              />
              <Button title={t('screens.phrases.edit.save')} width="0.4" onPress={handleEdit} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  backBtn: {
    backgroundColor: '#d9d9d9',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  backText: {
    fontSize: 30,
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  addText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '500',
  },
  spacer: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    minWidth: '50%', // Ensures it takes up space to trigger wrapping
  },
  header: {
    fontSize: 40,
    fontWeight: '500',
    textAlign: 'center',
  },
  breadcrumbs: {
    fontSize: 20,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 40,
    fontWeight: '500',
  },
  inputSection: {
    width: '95%',
  },
  inputLabel: {
    fontSize: 20,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  switchText: {
    fontSize: 20,
  },
  buttonRow: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    color: 'gray',
  },
});

export default Phrases;
