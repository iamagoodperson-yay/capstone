import React from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  FlatList,
  ScrollView,
  Modal,
  Dimensions,
  StyleSheet,
  Alert,
  Touchable,
  Linking,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { initTTS, speak } from '../utils/tts';
import { usePhrasesContext } from '../context/PhrasesContext';
import Button from '../components/button';
import Cell from '../components/cell';

export let selected = '';

const Phrases = ({ buttonLayout, daily }) => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const insets = useSafeAreaInsets();

  const [addModal, setAddModal] = React.useState(false);
  const [newPhraseText, setNewPhraseText] = React.useState('');
  const [isPhrase, setIsPhrase] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);

  React.useEffect(() => {
    initTTS();
  }, []);

  const {
    inProcess,
    getCurrent,
    navigateToChoice,
    selectPhrase,
    getSpeechText,
    goBack,
    canGoBack,
    getBreadcrumbs,
    caregiverNumber,
  } = usePhrasesContext();
  const current = getCurrent();
  const breadcrumbs = getBreadcrumbs().join(' > ');
  const speechText = getSpeechText();

  const renderChoices = () => (
    <FlatList
      data={current.choices}
      renderItem={({ item }) => (
        <Cell
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
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

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
      <FlatList
        data={current.choices}
        renderItem={({ item }) => (
          <Cell
            content={item}
            buttonlayout={buttonLayout}
            onPress={() => selectPhrase(item)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Cell
        content={{ text: 'Next' }}
        buttonlayout={3}
        onPress={() => {
          try {
            navigateToChoice(null);
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        }}
      />
    </>
  );

  return (
    <>
      {canGoBack && (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{
              color: '#d9d9d9',
              width: 65,
              height: 40,
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
              borderColor: 'black',
              borderWidth: 3,
              cornerRadius: 5,
              borderRadius: 5,
            }}
            onPress={() => {
              goBack();
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
              &lt; Back
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 24 }}>{current.text}</Text>
        <Text>{breadcrumbs}</Text>
      </View>
      {inProcess ? renderProcess() : renderChoices()}
    </>
  );
};

export default Phrases;
