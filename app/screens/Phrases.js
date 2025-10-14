import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Switch, ScrollView, Modal, Linking, Alert, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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

    const [addModal, setAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isAddProcess, setIsAddProcess] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Process configuration fields
    const [taskTitle, setTaskTitle] = useState('');
    const [processSpeech, setProcessSpeech] = useState('');
    const [processMultiSelect, setProcessMultiSelect] = useState(false);
    const [processDiverge, setProcessDiverge] = useState(false);

    const [editText, setEditText] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [editParent, setEditParent] = useState(null); // null = task option
    const [editModal, setEditModal] = useState(false);
    const [editImage, setEditImage] = useState(null);

    useEffect(() => {
        initTTS();
    }, []);

    const handleAdd = () => {
        if (!newItemText.trim()) {
            Alert.alert('Error', 'Please enter some text.');
            return;
        }
        setIsAdding(true);

        if (inProcess) {
            // If current task has diverge=true, create a new task for this choice
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
                };
                addChoiceToTask(current.id, newChoice);
                
                // Create a new task for this choice using form values or defaults
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
            };
            addCategory(current, newCategory);

            const newTask = {
                id: id,
                text: taskTitle.trim(),
                speech: processSpeech.trim(),
                multiSelect: processMultiSelect,
                diverge: processDiverge,
                next: 'end'
            };
            addTask(newTask);
        } else {
            const newCategory = {
                text: newItemText.trim(),
                image: selectedImage || null,
                choices: [],
            };
            addCategory(current, newCategory);
        }

        // Reset all form fields
        resetFormFields();
    };

    const createTask = (id, title, speech, multiSelect = false, diverge = false, nextId = 'end') => {
        return {
            id: id,
            text: title,
            speech: speech,
            multiSelect: multiSelect,
            diverge: diverge,
            choices: [],
            next: nextId,
        };
    };

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
        
        // Update image if it changed
        if (editingItem.image !== editImage) {
            editingItem.image = editImage;
        }
        
        editCategory(editParent, editingItem, editText.trim());
        
        setEditText('');
        setEditingItem(null);
        setEditParent(null);
        setEditImage(null);
        setEditModal(false);
    };

    const renderChoices = () =>
        current.choices?.map((item, index) => (
            <Cell
                key={index.toString()}
                content={item}
                buttonlayout={buttonLayout}
                onPress={() => {
                    if (item.text === 'Emergency')
                        Linking.openURL(`tel:${caregiverNumber}`);
                    else if (item.type === 'phrase') speak(item.text);
                    else navigateToChoice(item);
                }}
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

    const renderProcess = () => (
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
            {current.choices?.map((item, index) => (
                <Cell
                    key={index.toString()}
                    content={item}
                    buttonlayout={buttonLayout}
                    onPress={() => selectPhrase(item)}
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

    return (
        <>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.container}
            >
                <View style={styles.topBar}>
                    {canGoBack ? (
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={goBack}
                        >
                            <Text style={styles.backText}>&lt;</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.spacer} />
                    )}
                    <Text style={styles.header}>
                        {current.text}
                    </Text>
                    {daily ? (
                        <View style={styles.spacer} />
                    ) : (
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => setAddModal(true)}
                        >
                            <Text style={styles.addText}>
                                +
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {canGoBack && <Text style={styles.breadcrumbs}>{breadcrumbs}</Text>}
                {inProcess ? renderProcess() : renderChoices()}
            </ScrollView>

            {/* Add Modal */}
            <Modal
                visible={addModal}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => setAddModal(false)}
            >
                <SafeAreaView
                    style={[styles.modalSafeArea, { paddingTop: insets.top }]}
                >
                    <ScrollView
                        style={styles.modalScrollView}
                        contentContainerStyle={styles.modalContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustKeyboardInsets={true}
                        keyboardDismissMode="interactive"
                    >
                        <Text style={styles.modalTitle}>
                            {'Add' + (inProcess ? (current.diverge ? ' Choice with New Task' : ' Choice to Current Task') : '')}
                        </Text>
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>
                                {inProcess ? 'Choice text' : (isAddProcess ? 'Process' : 'Category') + ' text'}
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                value={newItemText}
                                onChangeText={setNewItemText}
                            />
                        </View>
                        {selectedImage ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={selectedImage}
                                    style={styles.imagePreview}
                                />
                                <Button
                                    title="Remove Image"
                                    width="0.4"
                                    color="#DC3545"
                                    onPress={() => setSelectedImage(null)}
                                />
                            </View>
                        ) : (
                            <View style={styles.buttonRow}>
                                <Button
                                    title="Select Image"
                                    width="0.4"
                                    color="#2196F3"
                                    onPress={() =>
                                        launchImageLibrary(
                                            {
                                                mediaType: 'photo',
                                                quality: 0.8,
                                                maxWidth: 500,
                                                maxHeight: 500,
                                            },
                                            response => {
                                                if (response.assets && response.assets[0])
                                                    setSelectedImage({ uri: response.assets[0].uri });
                                            },
                                        )
                                    }
                                />
                                <Button
                                    title="Take Photo"
                                    width="0.4"
                                    color="#2196F3"
                                    onPress={() =>
                                        launchCamera(
                                            {
                                                mediaType: 'photo',
                                                quality: 0.8,
                                                maxWidth: 500,
                                                maxHeight: 500,
                                            },
                                            response => {
                                                if (response.assets && response.assets[0])
                                                    setSelectedImage({ uri: response.assets[0].uri });
                                            },
                                        )
                                    }
                                />
                            </View>
                        )}
                        {!inProcess && (
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Add process or category</Text>
                                <View style={styles.switchRow}>
                                    <Switch
                                        value={isAddProcess}
                                        onValueChange={setIsAddProcess}
                                    />
                                    <Text style={styles.switchText}>{isAddProcess ? 'Process' : 'Category'}</Text>
                                </View>
                            </View>
                        )}
                        {(!inProcess && isAddProcess) || (inProcess && current.diverge) ? (
                            <>
                                <View style={styles.inputSection}>
                                    <Text style={styles.inputLabel}>Task Title</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={taskTitle}
                                        onChangeText={setTaskTitle}
                                    />
                                </View>

                                <View style={styles.inputSection}>
                                    <Text style={styles.inputLabel}>Speech Text</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={processSpeech}
                                        onChangeText={setProcessSpeech}
                                    />
                                </View>

                                <View style={styles.inputSection}>
                                    <Text style={styles.inputLabel}>Process Settings</Text>
                                    <View style={styles.switchRow}>
                                        <Switch
                                            value={processMultiSelect}
                                            onValueChange={setProcessMultiSelect}
                                        />
                                        <Text style={styles.switchText}>Allow Multiple Selections</Text>
                                    </View>
                                    <View style={styles.switchRow}>
                                        <Switch
                                            value={processDiverge}
                                            onValueChange={setProcessDiverge}
                                        />
                                        <Text style={styles.switchText}>Different Next Steps</Text>
                                    </View>
                                </View>
                            </>
                        ) : null}
                        <View style={styles.buttonRow}>
                            <Button
                                title="Close"
                                width="0.4"
                                color="#DC3545"
                                onPress={resetFormFields}
                            />
                            <Button
                                title={isAdding ? 'Adding...' : 'Add'}
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
                presentationStyle="fullScreen"
                onRequestClose={() => {
                    setEditModal(false);
                    setEditImage(null);
                }}
            >
                <SafeAreaView
                    style={[styles.modalSafeArea, { paddingTop: insets.top }]}
                >
                    <ScrollView
                        style={styles.modalScrollView}
                        contentContainerStyle={styles.modalContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustKeyboardInsets={true}
                        keyboardDismissMode="interactive"
                    >
                        <Text style={styles.modalTitle}>Edit</Text>
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Edit text</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editText}
                                onChangeText={setEditText}
                            />
                        </View>
                        {editImage ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={editImage}
                                    style={styles.imagePreview}
                                />
                                <Button
                                    title="Remove Image"
                                    width="0.4"
                                    color="#DC3545"
                                    onPress={() => setEditImage(null)}
                                />
                            </View>
                        ) : (
                            <View style={styles.buttonRow}>
                                <Button
                                    title="Select Image"
                                    width="0.4"
                                    color="#2196F3"
                                    onPress={() =>
                                        launchImageLibrary(
                                            {
                                                mediaType: 'photo',
                                                quality: 0.8,
                                                maxWidth: 500,
                                                maxHeight: 500,
                                            },
                                            response => {
                                                if (response.assets && response.assets[0])
                                                    setEditImage({ uri: response.assets[0].uri });
                                            },
                                        )
                                    }
                                />
                                <Button
                                    title="Take Photo"
                                    width="0.4"
                                    color="#2196F3"
                                    onPress={() =>
                                        launchCamera(
                                            {
                                                mediaType: 'photo',
                                                quality: 0.8,
                                                maxWidth: 500,
                                                maxHeight: 500,
                                            },
                                            response => {
                                                if (response.assets && response.assets[0])
                                                    setEditImage({ uri: response.assets[0].uri });
                                            },
                                        )
                                    }
                                />
                            </View>
                        )}
                        <View style={styles.buttonRow}>
                            <Button
                                title="Cancel"
                                width="0.4"
                                color="#DC3545"
                                onPress={() => {
                                    setEditModal(false);
                                    setEditImage(null);
                                }}
                            />
                            <Button title="Save" width="0.4" onPress={handleEditConfirm} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
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
        margin: 10,
    },
    addText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '500',
    },
    spacer: {
        width: 70,
    },
    header: {
        fontSize: 40,
        fontWeight: '500',
    },
    breadcrumbs: {
        fontSize: 20,
    },
    modalSafeArea: {
        flex: 1,
    },
    modalScrollView: {
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
    imagePreviewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: '95%',
        backgroundColor: '#d9d9d9',
        paddingVertical: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
    buttonRow: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default Phrases;