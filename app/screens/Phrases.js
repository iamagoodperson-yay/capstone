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
  Alert,
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

const Phrases = ({ buttonLayout, daily }) => {
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
    addPhrase,
    deletePhrase,
  } = usePhrasesContext();

  const current = getCurrent();
  const breadcrumbs = getBreadcrumbs().join(' > ');
  const speechText = getSpeechText();

  const [addModal, setAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isPhrase, setIsPhrase] = useState(true);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    initTTS();
  }, []);

  const handleAddPhrase = () => {
    if (!newPhraseText.trim())
      return Alert.alert('Error', 'Please enter some text.');

    setIsAdding(true);
    const newItem = {
      text: newPhraseText.trim(),
      type: isPhrase ? 'phrase' : 'category',
      image: selectedImage || null,
      choices: isPhrase ? undefined : [],
    };
    addPhrase(current, newItem);

    setNewPhraseText('');
    setSelectedImage(null);
    setIsPhrase(true);
    setAddModal(false);
    setIsAdding(false);
  };

  const renderChoices = () =>
    current.choices.map((item, index) => (
      <Cell
        key={index.toString()}
        content={item}
        buttonlayout={buttonLayout}
        onPress={() =>
          item.type === 'phrase' ? speak(item.text) : navigateToChoice(item)
        }
        onLongPress={() => {
          Alert.alert('Delete', `Delete "${item.text}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deletePhrase(current, item.text),
            },
          ]);
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
      {current.choices.map((item, index) => (
        <Cell
          key={index.toString()}
          content={item}
          buttonlayout={buttonLayout}
          onPress={() => selectPhrase(item)}
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
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center', paddingTop: 20 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '95%',
          }}
        >
          {canGoBack ? (
            <TouchableOpacity
              style={{
                backgroundColor: '#d9d9d9',
                height: 50,
                width: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={goBack}
            >
              <Text style={{ fontSize: 30 }}>&lt;</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}
          <Text style={{ fontSize: 40, fontWeight: '500' }}>
            {current.text}
          </Text>
          {daily ? (
            <View style={{ width: 50 }} />
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                height: 50,
                width: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setAddModal(true)}
            >
              <Text style={{ color: '#fff', fontSize: 30, fontWeight: '500' }}>
                +
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {canGoBack && <Text style={{ fontSize: 20 }}>{breadcrumbs}</Text>}
        {inProcess ? renderProcess() : renderChoices()}
      </ScrollView>

      <Modal
        visible={addModal}
        animationType="slide"
        onRequestClose={() => setAddModal(false)}
      >
        <SafeAreaView
          style={{
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: insets.top,
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: '500' }}>Add</Text>

          <View style={{ width: '95%' }}>
            <Text style={{ fontSize: 20, marginBottom: 5 }}>
              Add {isPhrase ? 'phrase' : 'category'} text
            </Text>
            <TextInput
              style={{
                fontSize: 20,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 10,
                padding: 10,
              }}
              value={newPhraseText}
              onChangeText={setNewPhraseText}
            />
          </View>

          <View style={{ width: '95%' }}>
            <Text style={{ fontSize: 20, marginBottom: 5 }}>
              Add phrase or category
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}
            >
              <Switch value={isPhrase} onValueChange={setIsPhrase} />
              <Text style={{ fontSize: 20 }}>
                {isPhrase ? 'Phrase' : 'Category'}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '95%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              title="Close"
              width="0.4"
              color="#DC3545"
              onPress={() => setAddModal(false)}
            />
            <Button
              title={isAdding ? 'Adding...' : 'Add'}
              width="0.4"
              onPress={handleAddPhrase}
              disabled={isAdding}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Phrases;
