import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from "react";
import { phrases } from "../data";
const story = phrases;

export let selected = null;


export async function proceed(choice, setCurrentId) {
    if (choice.size === "sound_button") {
        const phraseObj = phrases.find(phrases => phrases.id === choice.next);
        if (phraseObj) {
            if (typeof phraseObj.used !== "number") {
                phraseObj.used = 0;
            }
            phraseObj.used += 1;
            await AsyncStorage.setItem('phraseUsedCounts', JSON.stringify(phrases));
            console.log(choice.text, "used", phraseObj.used);
        } else {
            console.log("invalid", choice.next);
        }
        selected = choice.next;
    } else {
        selected = choice.next;
        setCurrentId(choice.next);
        console.log(choice.text, "used Not counted");
    }
    return choice.next;
}

const Phrases = ()  => {
    const [currentId, setCurrentId] = useState("categories");
    // Load used counts from AsyncStorage on mount
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('phraseUsedCounts');
            if (stored) {
                const savedPhrases = JSON.parse(stored);
                // Merge savedPhrases.used into phrases
                savedPhrases.forEach(saved => {
                    const phraseObj = phrases.find(p => p.id === saved.id);
                    if (phraseObj && typeof saved.used === "number") {
                        phraseObj.used = saved.used;
                    }
                });
            }
        })();
    }, []);
    const currentNode = story.find(node => node.id === currentId);

    if (!currentNode) {
        return (
            <View style={styles.container}>
                <Text>No choices available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {currentNode.back && (
                <TouchableOpacity
                    style={styles.back_button}
                    onPress={() => setCurrentId(currentNode.back)}>
                    <Text>&lt; Back</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.header}>{currentNode.text}</Text>

            {currentNode.choices.map((choice, idx) => (
                <TouchableOpacity
                    key={idx}
                    style={[styles.button, styles[choice.size]]}
                    onPress={async () => await proceed(choice,setCurrentId)}>
                    <Text style={styles.button_text}>{choice.text}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: '100%',
        width: '100%',
        padding: 20,
    },normal_button: {
        height: 93,
        width: 330,
        backgroundColor: '#d9d9d9',
        fontSize: 24,
        color:'#000000',
        borderRadius: 0,
        marginTop: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_text:{
        fontSize:24
    },
    sound_button: {
        backgroundColor: '#d9d9d9',
        fontSize: 36,
        color: '#000000',
        height: 168,
        width: 330,
        borderRadius: 0,
        marginTop: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    back_button:{
        backgroundColor: '#d9d9d9',
        fontSize: 24,
        color: '#000000',
        height: 40,
        width: 65,
        borderRadius: 0,
        marginTop: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 50,
        color: '#000000',
        marginBottom: 24,
    },
});

export default Phrases;