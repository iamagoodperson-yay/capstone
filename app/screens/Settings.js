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

  const renderFlag = (lang, langLabel) => (
    <TouchableOpacity
      style={[
        styles.languageButton,
        i18n.language === lang ? styles.selectedLanguage : null,
      ]}
      onPress={() => langSwitch(lang)}
    >
      <Text style={styles.languageText}>{langLabel}</Text>
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
        <View style={styles.languageGrid}>
          {renderFlag('en', 'English')}
          {renderFlag('cn', '华文')}
          {renderFlag('my', 'Bahasa Melayu')}
          {renderFlag('ta', 'தமிழ்')}
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

        <Text style={styles.subheader2}>
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
          title={t('screens.guide.title')}
          onPress={() => setGuideVisible(true)}
        />

        <Text style={styles.subheader2}>{t('screens.settings.credits.title')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.description')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.students')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.hwnStaff')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.mindsStaff')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.mentors')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.supervisors')}</Text>
        <Text style={styles.text}>{t('screens.settings.credits.collaboration')}</Text>
        
        <Text style={styles.text}>{t('screens.settings.credits.icons')}</Text>
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
                    <Text style={styles.subheader2}>{t('screens.guide.gettingStarted')}</Text>
                    <Text style={styles.text}>{t('screens.guide.gettingStartedDesc1')}</Text>
                    <Image source={require('../../assets/manual/gettingStarted.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.gettingStartedDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.homeScreen')}</Text>
                    <Text style={styles.text}>{t('screens.guide.homeScreenDesc1')}</Text>
                    <Image source={require('../../assets/manual/homeScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.homeScreenDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.phrasesOverview')}</Text>
                    <Text style={styles.text}>{t('screens.guide.phrasesOverviewDesc1')}</Text>
                    <Image source={require('../../assets/manual/phrasesNavigation.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.phrasesOverviewDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.categoriesStructure')}</Text>
                    <Text style={styles.text}>{t('screens.guide.categoriesStructureDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.categoriesStructureDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.processesAndTasks')}</Text>
                    <Text style={styles.text}>{t('screens.guide.processesAndTasksDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.processesAndTasksDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.taskNavigation')}</Text>
                    <Text style={styles.text}>{t('screens.guide.taskNavigationDesc1')}</Text>
                    <Image source={require('../../assets/manual/taskScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.taskNavigationDesc2')}</Text>
                    <Text style={styles.text}>{t('screens.guide.taskNavigationDesc3')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.taskExamples')}</Text>
                    <Text style={styles.text}>{t('screens.guide.taskExamplesDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.taskExamplesDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.addingPhrases')}</Text>
                    <Text style={styles.text}>{t('screens.guide.addingPhrasesDesc1')}</Text>
                    <Image source={require('../../assets/manual/addButton.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.addingPhrasesDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.addingCategories')}</Text>
                    <Text style={styles.text}>{t('screens.guide.addingCategoriesDesc1')}</Text>
                    <Image source={require('../../assets/manual/catAddScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.addingCategoriesDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.addingTasks')}</Text>
                    <Text style={styles.text}>{t('screens.guide.addingTasksDesc1')}</Text>
                    <Image source={require('../../assets/manual/taskAddScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.addingTasksDesc2')}</Text>
                    <Text style={styles.text}>{t('screens.guide.addingTasksDesc3')}</Text>
                    <Text style={styles.subheader3}>{t('screens.guide.addingTasksSubHeader4')}</Text>
                    <Text style={styles.text}>{t('screens.guide.addingTasksDesc4')}</Text>
                    <Text style={styles.subheader3}>{t('screens.guide.addingTasksSubHeader5')}</Text>
                    <Text style={styles.text}>{t('screens.guide.addingTasksDesc5')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.editingPhrases')}</Text>
                    <Text style={styles.text}>{t('screens.guide.editingPhrasesDesc1')}</Text>
                    <Image source={require('../../assets/manual/longPressMenu.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.editingPhrasesDesc2')}</Text>
                    <Image source={require('../../assets/manual/editScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.editingPhrasesDesc3')}</Text>
                    <Text style={styles.text}>{t('screens.guide.editingPhrasesDesc4')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.bookmarkSystem')}</Text>
                    <Image source={require('../../assets/manual/longPressMenu.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.bookmarkSystemDesc1')}</Text>
                    <Image source={require('../../assets/manual/bookmarkHome.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.bookmarkSystemDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.bookmarkManagement')}</Text>
                    <Text style={styles.text}>{t('screens.guide.bookmarkManagementDesc1')}</Text>
                    <Image source={require('../../assets/manual/deleteBookmark.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.bookmarkManagementDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.dailyChallenge')}</Text>
                    <Image source={require('../../assets/manual/challengeScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.dailyChallengeDesc1')}</Text>
                    <Image source={require('../../assets/manual/challengeCompleted.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.dailyChallengeDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.shopAvatar')}</Text>
                    <Image source={require('../../assets/manual/shopScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.shopAvatarDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.shopAvatarDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.historyTracking')}</Text>
                    <Image source={require('../../assets/manual/historyScreen.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.historyTrackingDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.historyTrackingDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.languageSettings')}</Text>
                    <Image source={require('../../assets/manual/settingsScreenLang.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.languageSettingsDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.languageSettingsDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.emergencyFeatures')}</Text>
                    <Image source={require('../../assets/manual/settingsEmergency.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.emergencyFeaturesDesc1')}</Text>
                    <Image source={require('../../assets/manual/settingsEmergency.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.emergencyFeaturesDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.qrCodeScanning')}</Text>
                    <Text style={styles.text}>{t('screens.guide.qrCodeScanningDesc1')}</Text>
                    <Image source={require('../../assets/manual/qrCodeScanning.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.qrCodeScanningDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.searchFunction')}</Text>
                    <Text style={styles.text}>{t('screens.guide.searchFunctionDesc1')}</Text>
                    <Image source={require('../../assets/manual/searchFunction.png')} style={styles.main_image} />
                    <Text style={styles.text}>{t('screens.guide.searchFunctionDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.searchTips')}</Text>
                    <Text style={styles.text}>{t('screens.guide.searchTipsDesc1')}</Text>
                    <Text style={styles.text}>{t('screens.guide.searchTipsDesc2')}</Text>

                    <Text style={styles.subheader2}>{t('screens.guide.accessibilityFeatures')}</Text>
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
  flagcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  languageGrid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 15,
  },
  languageButton: {
    width: '48%',
    paddingVertical: 20,
    justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    borderColor: '#d9d9d9',
    borderWidth: 3,
    borderRadius: 15,
  },
  selectedLanguage: {
    borderColor: '#4CAF50',
  },
  languageText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
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
    fontWeight: '500',
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
    alignItems: 'center',
    gap: 10,
  },
  subheader: {
    fontSize: 35,
    marginBottom: 10,
  },
  subheader2: {
    fontSize: 28,
    marginTop: 5,
    marginBottom: 5,
  },
  subheader3: {
    fontSize: 20,
    textAlign: 'flex-start',
    fontWeight: '600',
  },
});

export default Settings;
