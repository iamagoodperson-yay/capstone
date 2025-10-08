import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Switch, ScrollView, Modal, Dimensions, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { initTTS, speak } from '../utils/tts';
import { usePhrasesContext } from '../context/PhrasesContext';
import Button from '../components/button';
import Cell from '../components/cell';

export let selected = '';

const Phrases = ({ buttonLayout, daily, caregiverNumber }) => {
    const insets = useSafeAreaInsets();

    const [addModal, setAddModal] = useState(false);
    const [newPhraseText, setNewPhraseText] = useState('');
    const [isPhrase, setIsPhrase] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
        
    useEffect(() => { initTTS() }, []);

  const {
    inProcess,
    getCurrent,
    navigateToChoice,
    selectPhrase,
    getSpeechText,
    goBack,
    canGoBack,
    getBreadcrumbs,
  } = usePhrasesContext();
  const current = getCurrent();
  const breadcrumbs = getBreadcrumbs().join(' > ');
  const speechText = getSpeechText();

    const renderChoices = () => (
        current.choices.map((item, index) => (
            <Cell
                key={index.toString()}
                content={item}
                buttonlayout={buttonLayout}
                onPress={() => {
                    if (item.text === 'Emergency') {
                        Linking.openURL(`tel:${caregiverNumber}`);
                    } else {
                        navigateToChoice(item);
                    }
                }}
            />
        ))
    );

    const renderProcess = () => (
        <>
            <Cell
                content={{text: speechText, image: require('../../assets/phrases/speaker.png')}}
                buttonlayout={4}
                onPress={() => speak(speechText)}
                height={0.20}
            />
            {current.choices.map((item, index) => (
                <Cell
                    key={index.toString()}
                    content={item}
                    buttonlayout={buttonLayout}
                    onPress={() => selectPhrase(item)}
                />
            ))}
            <Cell
                content={{text: 'Next', type: 'next'}}
                buttonlayout={3}
                height={0.1}
                onPress={() => {
                    try {
                        navigateToChoice(null)
                    } catch (error) {
                        Alert.alert('Error', error.message);
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
                    {canGoBack ?
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => {goBack()}}
                        >
                            <Text style={styles.backText} >&lt;</Text>
                        </TouchableOpacity> : <View style={{ width: 50 }} />}
                    <Text style={styles.header}>{current.text}</Text>
                    {daily ? <View style={{ width: 50 }} /> :
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => {setAddModal(true)}}
                        >
                            <Text style={styles.addText} >+</Text>
                        </TouchableOpacity>
                    }
                </View>
                {canGoBack && (<Text style={styles.breadcrumbText}>{breadcrumbs}</Text>)}
                {inProcess ? renderProcess() : renderChoices()}
            </ScrollView>

            <Modal
                animationType="slide"
                visible={addModal}
                onRequestClose={() => setAddModal(false)}
            >
                <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }] }>
                    <Text style={styles.header}>Add</Text>

                    <View style={{width: '95%'}}>
                        <Text style={styles.inputTitle}>Add {isPhrase ? 'phrase' : 'category'} text</Text>
                        <TextInput
                            style={styles.addTextInput}
                            value={newPhraseText}
                            onChangeText={setNewPhraseText}
                        />
                    </View>

                    <View style={{width: '95%'}}>
                        <Text style={styles.inputTitle}>Add phrase or category</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                            <Switch
                                style={styles.addSwitch}
                                value={isPhrase}
                                onValueChange={setIsPhrase}
                            />
                            <Text style={styles.inputTitle}>{isPhrase ? 'Phrase' : 'Category'}</Text>
                        </View>
                    </View>

                    {selectedImage ? (
                        <View style={styles.imgPreviewContainer}>
                            <Image source={selectedImage} style={styles.imagePreview} />
                            <Button title="Remove Image" width="0.4" color="#DC3545" onPress={() => setSelectedImage(null)} />
                        </View>
                    ) : (
                        <View style={styles.horizontalContainer}>
                            <Button 
                                title="Select Image" 
                                width="0.4"
                                color="#2196F3"
                                onPress={() => {
                                    const options = {
                                        mediaType: 'photo',
                                        quality: 0.8,
                                        maxWidth: 500,
                                        maxHeight: 500,
                                        selectionLimit: 1,
                                        includeBase64: false,
                                    };

                                    launchImageLibrary(options, (response) => {
                                        if (response.assets && response.assets[0]) {
                                            setSelectedImage({ uri: response.assets[0].uri });
                                            console.log('Selected image:', response.assets[0]);
                                        }
                                    });
                                }}
                            />
                            <Button 
                                title="Take Photo" 
                                width="0.4" 
                                color="#2196F3"
                                onPress={() => {
                                    const options = {
                                        mediaType: 'photo',
                                        quality: 0.8,
                                        maxWidth: 500,
                                        maxHeight: 500,
                                    };
                                    launchCamera(options, (response) => {
                                        if (response.didCancel || response.error) {
                                            return;
                                        }
                                        if (response.assets && response.assets[0]) {
                                            setSelectedImage({ uri: response.assets[0].uri });
                                            console.log('Camera photo:', response.assets[0]);
                                        }
                                    });
                                }} 
                            />
                        </View>
                    )}

                    <View style={styles.horizontalContainer}>
                        <Button
                            title="Close"
                            width="0.4"
                            color="#DC3545"
                            onPress={() => setAddModal(false)}
                        />
                        <Button 
                            title={isAdding ? "Adding..." : "Add"} 
                            width="0.4" 
                            // onPress={handleAddPhrase}
                            disabled={isAdding}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView : {
        flex: 1,
    },
    container: {
        alignItems: 'center',
        paddingTop: 20,
    },
    topBar: {
        zIndex : 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
    },
    backBtn: {
        backgroundColor: '#d9d9d9',
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    backText: {
        fontSize: 30,
    },
    addBtn: {
        backgroundColor: '#4CAF50',
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    addText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '500',
    },
    header: {
        fontSize: 40,
        fontWeight: '500',
    },
    breadcrumbText: {
        fontSize: 20,
    },
    modalContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 20,
    },
    horizontalContainer: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputTitle: {
        fontSize: 20,
        marginBottom: 5,
    },
    addTextInput: {
        fontSize: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    addSwitch: {
        marginVertical: 5,
    },
    imgPreviewContainer: {
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
});

export default Phrases;
