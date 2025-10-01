import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ScrollView, Modal, Dimensions, StyleSheet, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { initTTS, speak } from '../utils/tts';
import { usePhrasesContext } from '../context/PhrasesContext';
import { useRoute } from '@react-navigation/native';
import Button from '../components/button';
import Cell from '../components/cell';

export let selected = '';

const Phrases = ({ buttonLayout, navigation }) => {

    const route = useRoute();
    const sent_id = route?.params?.sent_id ?? 'categories';

    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const {
        getCurrentNode, 
        navigateToChoice, 
        goBack, 
        canGoBack,
        phrases,
        getBreadcrumbs,
        addPhrase,
        deletePhrase,
        setStackToId
    } = usePhrasesContext();
    React.useEffect(() => {
        setStackToId(sent_id || 'categories');
    }, [sent_id]);

    const currentNode = getCurrentNode();

    React.useEffect(() => { initTTS() }, []);

    const [addModal, setAddModal] = React.useState(false);
    const [newPhraseText, setNewPhraseText] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [isAdding, setIsAdding] = React.useState(false);

    const choiceObjects = currentNode.choices.map(choiceId => {
        const choiceNode = phrases.find(p => p.id === choiceId);
        return {
            id: choiceId,
            text: choiceNode ? choiceNode.text : choiceId,
            image: choiceNode ? choiceNode.image : null,
            type: choiceNode ? choiceNode.type : 'select',
            terminator: choiceNode && choiceNode.choices.length === 0
        };
    });

    const handleChoicePress = (choiceObj) => {
        navigateToChoice(choiceObj.id);
        selected = choiceObj.id;
    };

    const handleAddPhrase = async () => {
        if (!newPhraseText.trim()) {
            Alert.alert('Please enter phrase text');
            return;
        }

        setIsAdding(true);
        try {
            await addPhrase({
                text: newPhraseText.trim(),
                image: selectedImage || require('../../assets/phrases/food.png'),
                type: 'phrase',
                choices: []
            });
            
            // Reset form
            setNewPhraseText('');
            setSelectedImage(null);
            setAddModal(false);
            Alert.alert('Phrase added successfully!');
        } catch (error) {
            console.error('Error adding phrase:', error);
            Alert.alert('Error adding phrase: ' + error.message);
        }
        setIsAdding(false);
    };

    

    const handleDeletePhrase = async (phraseId) => {
        console.log('Attempting to delete phrase:', phraseId);
        try {
            await deletePhrase(phraseId);
            console.log('Phrase deleted successfully:', phraseId);
            Alert.alert('Success', 'Phrase deleted successfully!');
        } catch (error) {
            console.error('Error deleting phrase:', error);
            Alert.alert('Error', 'Error deleting phrase: ' + error.message);
        }
    };

    const delAlert = (item) => {
        Alert.alert(
            'Delete Phrase',
            `Are you sure you want to delete "${item.text}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDeletePhrase(item.id) }
            ]
        );
    }

    const breadcrumbs = getBreadcrumbs();
    const title = breadcrumbs.length > 1 ? breadcrumbs[1] : currentNode.text;

    const phrase = (item) => {
        return(
            <View style={{alignItems: 'center'}}>
                <Image
                    source={item.image}
                    style={{ height: screenHeight * 0.25, aspectRatio: 1 }}
                />

                <TouchableOpacity
                    style={[styles.phraseButton, { height: screenHeight * 0.15, width: screenWidth * 0.8 }]}
                    onPress={() => { speak(item.text) }}
                    onLongPress={() => {delAlert(item)}}
                    delayLongPress={500}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.phraseButtonText}>{item.text}</Text>
                    </View>
                    <Image source={require('../../assets/phrases/speaker.png')} style={styles.phraseButtonImage} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.container}
            >
                {canGoBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={goBack}
                    >
                        <Text style={styles.backText}>&lt; Back</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.header}>{title}</Text>

                {breadcrumbs.length > 0 && 
                <Text style={styles.breadcrumbText}>
                    {breadcrumbs.join(' > ')}
                </Text>}

                {currentNode.type === 'phrase' && phrase(currentNode)}

                <FlatList style={styles.listView}
                    data={choiceObjects}
                    renderItem={({ item }) => (
                        item.terminator && item.type === 'phrase' ? phrase(item) : <Cell
                            key={item.id}
                            content={item}
                            buttonlayout={buttonLayout}
                            onPress={() => handleChoicePress(item)}
                            onLongPress={() => delAlert(item)}
                            height={currentNode.type === 'select' ? 0.125 : 0.1}
                        />
                    )}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </ScrollView>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddModal(true)}
            >
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                visible={addModal}
                onRequestClose={() => setAddModal(false)}
            >
                <View style={styles.container}>
                    <Text style={styles.header}>Add</Text>
                    <TextInput
                        placeholder="Add phrase text"
                        style={styles.phraseInput}
                        value={newPhraseText}
                        onChangeText={setNewPhraseText}
                    />
                    {selectedImage && (
                        <View style={styles.imagePreview}>
                            <Text style={styles.imagePreviewText}>Image selected ✓</Text>
                            <TouchableOpacity onPress={() => setSelectedImage(null)}>
                                <Text style={styles.removeImageText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
                                    setSelectedImage({ uri: response.assets[0].uri });
                                    console.log('Camera photo:', response.assets[0]);
                                });
                            }} 
                        />
                    </View>
                    <View style={styles.horizontalContainer}>
                        <Button title="Close" width="0.4" color="#DC3545" onPress={() => setAddModal(false)} />
                        <Button 
                            title={isAdding ? "Adding..." : "Add"} 
                            width="0.4" 
                            onPress={handleAddPhrase}
                            disabled={isAdding}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}



const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 20,
    },
    header: {
        fontSize: 40,
        fontWeight: '500',
    },
    breadcrumbText: {
        fontSize: 20,
        textAlign: 'center',
    },
    backButton: {
        zIndex: 1,
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#d9d9d9',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backText: {
        fontSize: 24,
    },
    listView: {
        width: '100%',
    },
    phraseButton: {
        backgroundColor: '#d9d9d9',
        margin: 10,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
    },
    phraseButtonText: {
        fontSize: 24,
    },
    phraseButtonImage: {
        margin: 25,
        width: '20%',
        aspectRatio: 1,
    },
    addButton: {
        zIndex: 100,
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    addText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '500',
    },
    horizontalContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    phraseInput: {
        fontSize: 20,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        borderRadius: 10,
        padding: 10,
    },
    imagePreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#e8f5e8',
        borderRadius: 8,
        width: '100%',
    },
    imagePreviewText: {
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    removeImageText: {
        color: '#d32f2f',
        textDecorationLine: 'underline',
    },
});

export default Phrases;