import { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { usePhrasesContext } from '../context/PhrasesContext';
import Phrases from './Phrases';
import Button from '../components/button';

const DAILY_KEY = 'daily_challenge';
const DAILY_COMPLETION_KEY = 'daily_completion';
const DAILY_STREAK_KEY = 'daily_streak';

const Daily = ({ coins, setCoins, buttonLayout }) => {
    const { t } = useTranslation();
    const { processesState, categoriesState, selected, inProcess, navigationStack } = usePhrasesContext();
    const [chall, setChall] = useState({ text: t('screens.daily.status.loading'), kind: null, payload: null });
    const [isCompleted, setIsCompleted] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);

    useEffect(() => {
        const setup = async () => {
            try {
                const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
                const completionKey = `${DAILY_COMPLETION_KEY}:${today}`;
                
                // Check if already completed today
                const completed = await AsyncStorage.getItem(completionKey);
                setIsCompleted(completed === 'true');
                
                // Load current streak
                await loadStreak();
                
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
                    const fallback = { text: t('screens.daily.status.noChallenge'), kind: null, payload: null };
                    setChall(fallback);
                    return;
                }

                const pick = candidates[Math.floor(Math.random() * candidates.length)];
                await AsyncStorage.setItem(key, JSON.stringify(pick));
                setChall(pick);
            } catch (e) {
                console.warn('Failed to setup daily challenge', e);
                setChall({ text: t('screens.daily.status.loadingError'), kind: null, payload: null });
            }
        };
        setup();
    }, [categoriesState, processesState]);

    const loadStreak = async () => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
            
            const streakData = await AsyncStorage.getItem(DAILY_STREAK_KEY);
            if (streakData) {
                const { lastDate, streak } = JSON.parse(streakData);
                
                if (lastDate === today) {
                    // Already completed today
                    setCurrentStreak(streak);
                } else if (lastDate === yesterday) {
                    // Continuing streak from yesterday
                    setCurrentStreak(streak);
                } else {
                    // Streak broken, reset to 0
                    setCurrentStreak(0);
                    await AsyncStorage.setItem(DAILY_STREAK_KEY, JSON.stringify({ lastDate: '', streak: 0 }));
                }
            } else {
                // No streak data, start fresh
                setCurrentStreak(0);
                await AsyncStorage.setItem(DAILY_STREAK_KEY, JSON.stringify({ lastDate: '', streak: 0 }));
            }
        } catch (e) {
            console.warn('Failed to load streak', e);
            setCurrentStreak(0);
        }
    };

    const updateStreak = async () => {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const newStreak = currentStreak + 1;
            
            await AsyncStorage.setItem(DAILY_STREAK_KEY, JSON.stringify({ 
                lastDate: today, 
                streak: newStreak 
            }));
            
            setCurrentStreak(newStreak);
            return newStreak;
        } catch (e) {
            console.warn('Failed to update streak', e);
            return currentStreak;
        }
    };

    const submit = async () => {
        try {
            if (isCompleted) {
                Alert.alert(t('screens.daily.alreadyCompleted.title'), t('screens.daily.alreadyCompleted.text'));
                return;
            }

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
                // Mark as completed for today
                const today = new Date().toISOString().slice(0, 10);
                const completionKey = `${DAILY_COMPLETION_KEY}:${today}`;
                await AsyncStorage.setItem(completionKey, 'true');
                setIsCompleted(true);

                // Update streak and calculate reward
                const newStreak = await updateStreak();
                const coinsEarned = newStreak; // nth day gives n coins
                
                Alert.alert(
                    `✅ ${t('screens.daily.correct.title')}`, 
                    t('screens.daily.correct.text', { coinsEarned: coinsEarned, total: coins + coinsEarned, streak: newStreak }),
                );
                setCoins(coins + coinsEarned);
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
            {/* Challenge and streak on same line */}
            <View style={styles.headerBar}>
                <View style={{ width: 60 }}/>
                <Text style={styles.challengeText}>
                    {t('screens.daily.challenge')} 
                    {chall && t(`phrases.${chall.text}`, {
                        defaultValue: chall.text,
                    })}
                </Text>
                <Text style={styles.streakText}>{currentStreak} 🔥</Text>
            </View>
            
            <View style={styles.phrasesContainer}>
                <Phrases buttonLayout={buttonLayout} daily={true} style={styles.phrasesComponent} />
                
                {isCompleted && (
                    <View style={styles.overlayContainer}>
                        <View style={styles.overlay} />
                        <View style={styles.completedMessageContainer}>
                            <Text style={styles.completedText}>
                                ✅ {t('screens.daily.completedMessage')}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            
            <View style={styles.buttonContainer}>
                <Button 
                    title={isCompleted ? t('screens.daily.completedButton') : t('screens.daily.submit')} 
                    onPress={submit} 
                    color={isCompleted ? "gray" : "#4CAF50"}
                />
            </View>
            <View />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingHorizontal: 0,
        gap: 20,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    challengeText: {
        fontSize: 24,
        flex: 1,
        textAlign: 'center',
    },
    streakText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF6B35',
        width: 60,
    },
    phrasesContainer: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    phrasesComponent: {
        flex: 1,
        width: '100%',
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(128, 128, 128, 0.7)',
    },
    completedMessageContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 15,
        marginHorizontal: 20,
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    completedText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
    },
});

export default Daily;