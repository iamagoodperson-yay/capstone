import Tts from 'react-native-tts';
import { Platform } from 'react-native';

// Track speaking state manually since isSpeaking() doesn't exist
let isSpeaking = false;

// Lightweight TTS helper with diagnostics.
export async function initTTS() {
    if (!Tts) return;

    try {
        console.log('[TTS] Platform:', Platform.OS);
        const init = await Tts.getInitStatus();
        console.log('[TTS] init status:', init);

        try {
            Tts.setDefaultRate(0.5);
        } catch (e) {
            console.warn('[TTS] setDefaultRate failed', e);
        }
        Tts.setDefaultPitch(1.0);

        // Enumerate voices and choose a suitable one if available.
        let voices = [];
        voices = await Tts.voices();
        console.log('[TTS] available voices:', voices && voices.length);

        // Prefer an offline-ish English voice where possible, fallback to first en* voice, then default.
        const preferred = (voices || []).find(v => typeof v === 'object' && /en[-_]us|en/.test(v.language) && !v.notInstalled) ||
                          (voices || []).find(v => typeof v === 'object' && /en/.test(v.language));

        if (preferred && preferred.id) {
            await Tts.setDefaultVoice(preferred.id);
            console.log('[TTS] selected voice:', preferred.id, preferred.language);
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

export function speak(text) {
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