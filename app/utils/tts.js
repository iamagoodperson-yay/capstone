import Tts from 'react-native-tts';
import { Platform } from 'react-native';

let isSpeaking = false;
let preferredList = [];

// Lightweight TTS helper with diagnostics.
export const initTTS = async () => {
    if (!Tts) return;

    try {
        console.log('[TTS] Platform:', Platform.OS);
        const init = await Tts.getInitStatus();
        console.log('[TTS] init status:', init);

        Tts.setDefaultPitch(1.0);

        // Enumerate voices and choose a suitable one if available.
        let voices = [];
        voices = await Tts.voices();
        console.log('[TTS] available voices:', voices && voices.length);

        // Prefer an offline-ish English voice where possible, fallback to first en* voice, then default.
        preferredList = 
            (voices || []).filter(v => typeof v === 'object' && /en[-_]us|en/.test(v.language) && !v.notInstalled) ||
            (voices || []).filter(v => typeof v === 'object' && /en/.test(v.language));

        if (preferredList && preferredList[0] && preferredList[0].id) {
            await Tts.setDefaultVoice(preferredList[0].id);
            console.log('[TTS] selected voice:', preferredList[0].id, preferredList[0].language);
        } else {
            // Keep existing hard-coded fallback but only attempt if setDefaultVoice exists
            if (typeof Tts.setDefaultVoice === 'function') {
                await Tts.setDefaultVoice('en-us-x-iob-local');
                console.log('[TTS] set fallback voice en-us-x-iob-local');
            }
        }

        // Set up event listeners to track speaking state
        Tts.addEventListener('tts-start', () => {
            isSpeaking = true;
            console.log('[TTS] Started speaking');
        });

        Tts.addEventListener('tts-finish', () => {
            isSpeaking = false;
            console.log('[TTS] Finished speaking');
        });

        Tts.addEventListener('tts-cancel', () => {
            isSpeaking = false;
            console.log('[TTS] Cancelled speaking');
        });

    } catch (e) {
        console.warn('[TTS] init failed', e);
    }
}

export const speak = text => {
    if (!Tts || !text) return;
    try {
        // Check if TTS is currently speaking, if so, discard this request
        if (isSpeaking) {
            console.log('[TTS] Already speaking, discarding request:', text);
            return;
        }

        // On some iOS react-native-tts builds calling stop() with no args
        // causes a native bridge error (JS undefined -> ObjC BOOL). Avoid
        // calling stop() on iOS to prevent the error. On Android it's safe.
        if (Platform.OS !== 'ios' && typeof Tts.stop === 'function') {
            try { Tts.stop(); } catch (e) { console.warn('[TTS] stop() failed', e); }
        }

        Tts.speak(text);
    } catch (e) {
        console.log('[TTS] speak error', e);
    }
}

export const changeVoice = async (voiceNum) => {
    if (!Tts || !preferredList[voiceNum]) return;

    const voiceId = preferredList[voiceNum].id;

    try {
        await Tts.setDefaultVoice(voiceId);
        console.log('[TTS] Changed voice to:', voiceId);
        speak('This is voice ' + (voiceNum + 1));
    } catch (e) {
        console.log('[TTS] changeVoice error', e);
    }
};
