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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Cell from '../components/cell';
import { changeVoice } from '../utils/tts';

function Settings({
  buttonLayout,
  setButtonLayout,
  caregiverNumber,
  setCaregiverNumber,
}) {
  const { t, i18n } = useTranslation();
  const [voice, setVoice] = useState(0);

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
    <ScrollView
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={true}
    >
      <View style={styles.container}>
        <Text style={styles.subtext}>
          {t('screens.settings.languageTitle')}
        </Text>
        <View style={styles.flagcontainer}>
          {renderFlag('en', require('../../assets/settings/englishflag.png'))}
          {renderFlag('cn', require('../../assets/settings/chineseflag.png'))}
        </View>
        <View style={styles.flagcontainer}>
          {renderFlag('my', require('../../assets/settings/malaysianflag.png'))}
          {renderFlag('id', require('../../assets/settings/indianflag.png'))}
        </View>
        <View style={{ height: 20 }} />
        <Text style={styles.subtext}>{t('screens.settings.buttonTitle')}</Text>
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
      </View>
      <View style={styles.container}>
        <Text style={styles.subheader}>
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
      </View>
      <View style={styles.container}>
        <Text style={styles.subtext}> User's Manual</Text>
        <Text style={styles.subheader}>Phrases</Text>
        <Text style={styles.small_text}>
          The buttons in the Phrases Tab allow you to choose between different
          scenarios, such as ordering food or asking for directions.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial1.png')}
          style={styles.main_image}
        />
        <Text style={styles.small_text}>
          Buttons with a loudspeaker icon will read out the phrase when pressed.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial2.png')}
          style={styles.main_image}
        />
        <Text style={styles.subheader}>Daily Challenge + Shop</Text>
        <Text style={styles.small_text}>
          The Daily Challenge resets daily, and requires the user to accomplish
          a certain task using the Phrases, such as ordering food.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial3.png')}
          style={styles.main_image}
        />
        <Text style={styles.small_text}>
          Successfully completing the Daily Challenge awards you coins, allowing
          you to purchase cosmetics for your avatar in the Shop Tab.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial4.png')}
          style={styles.main_image}
        />
        <Image
          source={require('../../assets/settings/tutorial5.png')}
          style={styles.main_image}
        />
        <Text style={styles.subheader}>Adding Custom Phrases</Text>
        <Text style={styles.small_text}>
          To add your own phrases, navigate to the Phrases tab and select the
          "Add Phrase" button at the bottom of the screen. You can then input
          your desired phrase, and even add an image to it.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial6.png')}
          style={styles.main_image}
        />
        <Image
          source={require('../../assets/settings/tutorial7.png')}
          style={styles.main_image}
        />
        <Image
          source={require('../../assets/settings/tutorial8.png')}
          style={styles.main_image}
        />
        <Text style={styles.subheader}>Editing / Deleting Phrases</Text>
        <Text style={styles.small_text}>
          To edit a specific phrase, simply long-press on the phrase button in
          the Phrases tab, and confirm the edit when prompted. From there, you
          can delete the specific phrase.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial9.png')}
          style={styles.main_image}
        />
        <Image
          source={require('../../assets/settings/tutorial10a.png')}
          style={styles.main_image}
        />
        <Image
          source={require('../../assets/settings/tutorial10b.png')}
          style={styles.main_image}
        />
        <Text style={styles.subheader}>Home Page</Text>
        <Text style={styles.small_text}>
          For easy access, you can long-press phrases to bookmark them. The
          bookmarked phrases can be accessed through the home page.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial11.png')}
          style={styles.main_image}
        />
        <Text style={styles.subheader}>Settings Customisation</Text>
        <Text style={styles.small_text}>
          If you wish to change the language and how each phrase icon looks, you
          can pick your desired language and button layout by clicking on the
          icons above in the Settings Tab. The currently selected option is
          highlighted in green.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial12.png')}
          style={styles.main_image}
        />
        <Text style={styles.small_text}>
          Additionally, you can customise the app's voice and your caregiver's
          number.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial13.png')}
          style={styles.main_image}
        />
        <Text style={styles.small_text}>
          When pressing the emergency button, you can call the preset number for
          easy access.
        </Text>
        <Image
          source={require('../../assets/settings/tutorial14.png')}
          style={styles.main_image}
        />
        <View style={styles.container}>
          <Text style={styles.subheader}>Credits & Acknowledgements:</Text>
          <Text style={styles.small_text}>
            This app was developed as part of the SST-NP IDP DiSpark Capstone
            project 2025.
          </Text>
          <Text style={styles.small_text}>
            Students: Kenzie Vimalaputta Irawan, Darius Yong, Janelle Lee Jia
            Yen
          </Text>
          <Text style={styles.small_text}>
            HWN Staff: Mr Tan Ter Soon, Miss Kang Yun Jie{' '}
          </Text>
          <Text style={styles.small_text}>MINDS Staff: Ms Julia </Text>
          <Text style={styles.small_text}>
            Technical Mentors: Mr Spencer Chiang, Mr Joshua Woon, Mr Liong Yuen
            Ming{' '}
          </Text>
          <Text style={styles.small_text}>
            SST Teacher Supervisors: Ms Jaslyn Ting, Ms Afiah{' '}
          </Text>
          <Text style={styles.small_text}>
            In collaboration with Heartware Network & MINDs
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: 20,
  },
  subtext: {
    fontSize: 35,
    color: '#000000',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 28,
    color: '#000000',
    marginBottom: 20,
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
    fontSize: 32,
  },
  small_text: {
    fontSize: 20,
    textAlign: 'center',
  },
  main_image: {
    height: 200,
    width: 300,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 20,
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
    width: '25%',
    padding: 20,
    backgroundColor: '#d9d9d9',
    marginVertical: 40,
    borderColor: '#d9d9d9',
    borderRadius: 15,
    borderWidth: 3,
  },
  selectedvoicebutton: {
    width: '25%',
    padding: 20,
    backgroundColor: '#d9d9d9',
    marginVertical: 40,
    borderColor: '#4CAF50',
    borderRadius: 15,
    borderWidth: 3,
  },
  voicetext: {
    textAlign: 'center',
  },
});

export default Settings;
