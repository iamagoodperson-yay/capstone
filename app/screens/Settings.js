import { useState } from 'react';
import { Tts } from '../utils/tts';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Cell from '../components/cell';
import Button from '../components/button';
import { changeVoice } from '../utils/tts';

function Settings({
  buttonLayout,
  setButtonLayout,
  caregiverNumber,
  setCaregiverNumber,
}) {
  const { t, i18n } = useTranslation();
  const [voice, setVoice] = useState(0);
  const [guideVisible, setGuideVisible] = useState(false);

  const renderFlag = (lang, imgSrc) => (
    <TouchableOpacity onPress={() => langSwitch(lang)}>
      <Image
        source={imgSrc}
        style={[
          styles.flag,
          i18n.language === lang ? styles.selectedFlag : null,
        ]}
      />
    </TouchableOpacity>
  );

  const langSwitch = async lang => {
    await i18n.changeLanguage(lang);
    Tts.stop();

    const voices = await Tts.voices();
    let voiceId;

    if (lang === 'en') {
      voiceId = voices.find(v => v.language.startsWith('en'))?.id;
    } else if (lang === 'cn') {
      voiceId = voices.find(v => v.language.startsWith('zh'))?.id;
    } else if (lang === 'my') {
      voiceId = voices.find(v => v.language.startsWith('ms'))?.id;
    } else if (lang === 'id') {
      voiceId = voices.find(v => v.language.startsWith('ta'))?.id;
    }

    if (voiceId) {
      await Tts.setDefaultVoice(voiceId);
    } else {
      console.warn('No TTS voice available for', lang);
    }

    try {
      await Tts.setDefaultLanguage(langMap[lang]);
    } catch (e) {
      console.warn('TTS language not available', e);
    }
  };

  const langMap = {
    cn: 'zh-SG',
    my: 'ms-MY',
    in: 'en-IN',
    ta: 'ta-IN',
    en: 'en-GB',
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
      <View style={styles.container}>
        <Text style={styles.subheader}>
          {t('screens.settings.languageTitle')}
        </Text>
        <View style={styles.flagcontainer}>
          {renderFlag('en', require('../../assets/settings/englishflag.png'))}
          {renderFlag('cn', require('../../assets/settings/chineseflag.png'))}
        </View>
        <View style={styles.flagcontainer}>
          {renderFlag('my', require('../../assets/settings/malaysianflag.png'))}
          {renderFlag('ta', require('../../assets/settings/indianflag.png'))}
        </View>

        <View style={{ height: 20 }} />

        <Text style={styles.subheader}>{t('screens.settings.buttonTitle')}</Text>
        <Cell
          content={{
            type: buttonLayout == 1 ? 'selected' : 'normal_button',
            image: require('../../assets/phrases/food.png'),
          }}
          buttonlayout={1}
          onPress={() => setButtonLayout(1)}
        />
        <Cell
          content={{
            type: buttonLayout == 2 ? 'selected' : 'normal_button',
            image: require('../../assets/phrases/food.png'),
            text: t('screens.settings.buttonFood'),
          }}
          buttonlayout={2}
          onPress={() => setButtonLayout(2)}
        />
        <Cell
          content={{
            type: buttonLayout == 3 ? 'selected' : 'normal_button',
            text: t('screens.settings.buttonFood'),
          }}
          buttonlayout={3}
          onPress={() => setButtonLayout(3)}
        />

        <Text style={styles.subtext}>
          {t('screens.settings.caregiverNumberTitle')}
        </Text>
        <TextInput
          value={caregiverNumber}
          onChangeText={setCaregiverNumber}
          keyboardType="phone-pad"
          style={styles.text_input}
        />
        <View style={styles.flagcontainer}>
          <TouchableOpacity
            style={[
              voice === 0 ? styles.selectedvoicebutton : styles.voicebutton,
            ]}
            onPress={() => {
              setVoice(0);
              changeVoice(0);
            }}
          >
            <Text style={styles.voicetext}>{t('screens.settings.Voice1')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              voice === 1 ? styles.selectedvoicebutton : styles.voicebutton,
            ]}
            onPress={() => {
              setVoice(1);
              changeVoice(1);
            }}
          >
            <Text style={styles.voicetext}>{t('screens.settings.Voice2')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              voice === 2 ? styles.selectedvoicebutton : styles.voicebutton,
            ]}
            onPress={() => {
              setVoice(2);
              changeVoice(2);
            }}
          >
            <Text style={styles.voicetext}>{t('screens.settings.Voice3')}</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="User's Guide"
          onPress={() => setGuideVisible(true)}
        />

        <Text style={styles.subtext}>Credits & Acknowledgements:</Text>
        <Text style={styles.text}>This app was developed as part of the SST-NP IDP DiSpark Capstone project 2025.</Text>
        <Text style={styles.text}>Students: Kenzie Vimalaputta Irawan, Darius Yong, Janelle Lee Jia Yen</Text>
        <Text style={styles.text}>HWN Staff: Mr Tan Ter Soon, Miss Kang Yun Jie</Text>
        <Text style={styles.text}>MINDS Staff: Ms Julia</Text>
        <Text style={styles.text}>Technical Mentors: Mr Spencer Chiang, Mr Joshua Woon, Mr Liong Yuen Ming</Text>
        <Text style={styles.text}>SST Teacher Supervisors: Ms Jaslyn Ting, Ms Afiah</Text>
        <Text style={styles.text}>In collaboration with Heartware Network & MINDs</Text>

      </View>
    </ScrollView>
        <UserGuideModal visible={guideVisible} onClose={() => setGuideVisible(false)} t={t} />
    </View>
  );
}

const UserGuideModal = ({ visible, onClose, t }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t('screens.guide.title')}</Text>
          <View style={{ width: 30 }} />
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.subtext}>{t('screens.guide.gettingStarted')}</Text>
          <Text style={styles.text}>{t('screens.guide.gettingStartedDesc1')}</Text>
          <Image source={require('../../assets/manual/gettingStarted.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.gettingStartedDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.homeScreen')}</Text>
          <Text style={styles.text}>{t('screens.guide.homeScreenDesc1')}</Text>
          <Image source={require('../../assets/manual/homeScreen.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.homeScreenDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.phrasesNavigation')}</Text>
          <Image source={require('../../assets/manual/phrasesNavigation.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.phrasesNavigationDesc1')}</Text>
          <Text style={styles.text}>{t('screens.guide.phrasesNavigationDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.addingPhrases')}</Text>
          <Image source={require('../../assets/manual/addButton.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.addingPhrasesDesc1')}</Text>
          <Image source={require('../../assets/manual/addScreen.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.addingPhrasesDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.editingPhrases')}</Text>
          <Text style={styles.text}>{t('screens.guide.editingPhrasesDesc1')}</Text>
          <Image source={require('../../assets/manual/longPressMenu.png')} style={styles.main_image} />
          <Image source={require('../../assets/manual/editScreen.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.editingPhrasesDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.bookmarkSystem')}</Text>
          <Image source={require('../../assets/manual/longPressMenu.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.bookmarkSystemDesc1')}</Text>
          <Image source={require('../../assets/manual/bookmarkHome.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.bookmarkSystemDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.processingMode')}</Text>
          <Text style={styles.text}>{t('screens.guide.processingModeDesc1')}</Text>
          <Image source={require('../../assets/manual/processingMode.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.processingModeDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.dailyChallenge')}</Text>
          <Image source={require('../../assets/manual/challengeScreen.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.dailyChallengeDesc1')}</Text>
          <Image source={require('../../assets/manual/challengeCompleted.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.dailyChallengeDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.shopAvatar')}</Text>
          <Image source={require('../../assets/manual/shopScreen.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.shopAvatarDesc1')}</Text>
          <Text style={styles.text}>{t('screens.guide.shopAvatarDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.historyTracking')}</Text>
          <Image source={require('../../assets/manual/historyScreen.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.historyTrackingDesc1')}</Text>
          <Text style={styles.text}>{t('screens.guide.historyTrackingDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.languageSettings')}</Text>
          <Image source={require('../../assets/manual/settingsScreenLang.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.languageSettingsDesc1')}</Text>
          <Text style={styles.text}>{t('screens.guide.languageSettingsDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.emergencyFeatures')}</Text>
          <Image source={require('../../assets/manual/settingsEmergency.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.emergencyFeaturesDesc1')}</Text>
          <Image source={require('../../assets/manual/settingsEmergency.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.emergencyFeaturesDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.qrCodeScanning')}</Text>
          <Text style={styles.text}>{t('screens.guide.qrCodeScanningDesc1')}</Text>
          <Image source={require('../../assets/manual/qrCodeScanning.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.qrCodeScanningDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.searchFunction')}</Text>
          <Text style={styles.text}>{t('screens.guide.searchFunctionDesc1')}</Text>
          <Image source={require('../../assets/manual/searchFunction.png')} style={styles.main_image} />
          <Text style={styles.text}>{t('screens.guide.searchFunctionDesc2')}</Text>

          <Text style={styles.subtext}>{t('screens.guide.accessibilityFeatures')}</Text>
          <Text style={styles.text}>{t('screens.guide.accessibilityFeaturesDesc1')}</Text>
          <Text style={styles.text}>{t('screens.guide.accessibilityFeaturesDesc2')}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    gap: 5,
  },
  subheader: {
    fontSize: 35,
    marginBottom: 10,
  },
  subtext: {
    fontSize: 28,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  flagcontainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  flag: {
    height: 75,
    width: 125,
    opacity: 0.75,
    borderColor: 'black',
    borderWidth: 2,
  },
  selectedFlag: {
    borderColor: '#4CAF50',
    borderWidth: 5,
    opacity: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  text: {
    alignSelf: 'flex-start',
    fontSize: 20,
  },
  main_image: {
    maxHeight: 500,
    width: "90%",
    resizeMode: 'contain',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  text_input: {
    fontSize: 20,
    borderColor: 'gray',
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  voicebutton: {
    width: '29%',
    padding: 20,
    backgroundColor: '#d9d9d9',
    marginVertical: 40,
    borderColor: '#d9d9d9',
    borderRadius: 15,
    borderWidth: 3,
  },
  selectedvoicebutton: {
    width: '29%',
    padding: 20,
    backgroundColor: '#d9d9d9',
    marginVertical: 40,
    borderColor: '#4CAF50',
    borderRadius: 15,
    borderWidth: 3,
  },
  voicetext: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});

export default Settings;
