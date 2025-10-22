import { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { usePhrasesContext } from '../context/PhrasesContext';
import Phrases from './Phrases';
import Button from '../components/button';

const DAILY_KEY = 'daily_challenge';

const Daily = ({ coins, setCoins, buttonLayout }) => {
    const { t } = useTranslation();
    const { processesState, categoriesState, selected, inProcess, navigationStack } = usePhrasesContext();
    const [chall, setChall] = useState({ text: t('screens.daily.status.loading'), kind: null, payload: null });

    useEffect(() => {
        const setup = async () => {
            try {
                const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
                const key = `${DAILY_KEY}:${today}`;
                const stored = await AsyncStorage.getItem(key);
                if (stored) {
                    setChall(JSON.parse(stored));
                    return;
                }

                // build candidate list: category leaf choices and process choices
                const candidates = [];

                const recurse = (items, path = []) => {
                    if (!items) return;
                    for (const it of items) {
                        const newPath = [...path, it.text];
                        if (!it.choices || it.choices.length === 0) {
                            // leaf category item
                            candidates.push({ kind: 'category', text: it.text, payload: { path: newPath } });
                        } else {
                            recurse(it.choices, newPath);
                        }
                    }
                };
                recurse(categoriesState.choices || []);

                for (const proc of processesState || []) {
                    for (const choice of proc.choices || []) {
                        candidates.push({ kind: 'process', text: choice.text, payload: { processId: proc.id, choiceText: choice.text } });
                    }
                }

                if (!candidates.length) {
                    const fallback = { text: t('screens.daily.noChallenge'), kind: null, payload: null };
                    setChall(fallback);
                    return;
                }

                const pick = candidates[Math.floor(Math.random() * candidates.length)];
                await AsyncStorage.setItem(key, JSON.stringify(pick));
                setChall(pick);
            } catch (e) {
                console.warn('Failed to setup daily challenge', e);
                setChall({ text: t('screens.daily.loadingError'), kind: null, payload: null });
            }
        };
        setup();
    }, [categoriesState, processesState]);

    const submit = () => {
        try {
            if (!chall || !chall.kind) {
                Alert.alert(t('screens.daily.noChall.title'), t('screens.daily.noChall.text'));
                return;
            }

            let correct = false;

            if (chall.kind === 'process') {
                // if the user is in the process and selected contains the choice text
                if (inProcess && Array.isArray(selected) && selected.length > 0) {
                    correct = selected.some(s => s.text === chall.payload.choiceText);
                }
            } else if (chall.kind === 'category') {
                // check if navigationStack ends with the challenge path or current selected text matches
                const path = chall.payload.path;
                if (Array.isArray(navigationStack) && navigationStack.join('>') === path.join('>')) {
                    correct = true;
                } else if (Array.isArray(selected) && selected.length > 0) {
                    correct = selected.some(s => s.text === chall.text);
                }
            }

            if (correct) {
                Alert.alert(`✅ ${t('screens.daily.correct.title')}`, `${t('screens.daily.correct.text1')} 🪙 !\n${t('screens.daily.correct.text2')}: ${coins + 1} 🪙`);
                setCoins(coins + 1);
            } else {
                Alert.alert(t('screens.daily.wrong.title'), t('screens.daily.wrong.text'));
            }
        } catch (e) {
            console.warn('Submit error', e);
            Alert.alert(t('screens.daily.error.title'), t('screens.daily.error.text'));
        }
    };

    return (
        <View style={styles.container}>
            <View />
            <Text style={styles.challengeText}>{t('screens.daily.challenge')} {chall && chall.text ? chall.text : String(chall)}</Text>
            <Phrases buttonLayout={buttonLayout} daily={true} />
            <Button title={t('screens.daily.submit')} onPress={submit} />
            <View />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    challengeText: {
        fontSize: 24,
    },
});

export default Daily;