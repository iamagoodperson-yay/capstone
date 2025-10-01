import Tts from 'react-native-tts';

export function initTTS() {
    if (!Tts) return;

   Tts.getInitStatus()
        .then(() => {
            Tts.setDefaultRate(0.5);
            Tts.setDefaultPitch(1.0);
            Tts.setDefaultVoice('en-us-x-iob-local');
            // Tts.voices().then(voices => {
            //     const enVoices = voices.filter(voice => voice.language.startsWith('en') && voice.networkConnectionRequired === false);
            //     console.log(enVoices);
            // });
        })
        .catch(() => {});
}

export function speak(text) {
    if (!Tts || !text) return;
    try {
        Tts.stop();
        Tts.speak(text);
    } catch (e) {
        console.log('TTS speak error', e);
    }
}
