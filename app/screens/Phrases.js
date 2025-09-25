import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { useState, useEffect } from "react";
import { phrases } from "../data";
import { buttonlayout } from './Settings';

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

const renderCell = ({choice,idx,buttonlayout}) => {
    switch(buttonlayout) {
        case 1:
            return(
                <TouchableOpacity
                    key={idx}
                    style={styles.normal_button}
                    onPress={() => proceed(choice,setCurrentId)}
                >
                    <Image source={choice.png}
                    style={styles.main_image} />
                </TouchableOpacity> 
            ) 
        case 2:
            return(
                <TouchableOpacity
                    key={idx}
                    style={styles.normal_button}
                    onPress={() => proceed(choice,setCurrentId)}
                >
                    <Image source={choice.png}
                    style={styles.split_image} />
                    <View style={styles.split_textdiv}>
                        <Text style={styles.split_text}>{choice.text}</Text>
                    </View>
                </TouchableOpacity>  
            )
        case 3:
            return(
                <TouchableOpacity
                    key={idx}
                    style={styles.normal_button}
                    onPress={() => proceed(choice)}
                >
                    <View style={styles.split_textdiv}>
                        <Text style={styles.main_text}>{choice.text}</Text>
                    </View>
                </TouchableOpacity>  
            )
    }
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

            {currentNode.choices.map((choice, idx,buttonlayout) => (
                renderCell({choice, idx, buttonlayout})
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
        split_image:{
        height: 50,
        width: 50,
        marginRight:20,
        marginLeft:20
    },
    split_text:{
        fontSize:24
    },
    main_image: {
        height:80,
        width:80,
    },
    main_text:{
        fontSize:42
    },
    split_textdiv: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Phrases;