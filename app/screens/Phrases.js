import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Cell from '../components/cell';
import { usePhrasesContext } from '../context/PhrasesContext';

export let selected = null;

const Phrases = ({ buttonLayout }) => {
    const { 
        getCurrentNode, 
        navigateToChoice, 
        goBack, 
        canGoBack,
        updatePhraseUsage
    } = usePhrasesContext();
    
    const currentNode = getCurrentNode();

    if (!currentNode) {
        return (
            <View style={styles.container}>
                <Text>No choices available</Text>
            </View>
        );
    }

    const handleChoicePress = async (choice) => {
        if (choice.size === "sound_button") {
            // Handle sound button - context handles AsyncStorage automatically
            await updatePhraseUsage(choice.next);
            console.log(choice.text, "used - count updated");
            selected = choice.next;
        } else {
            navigateToChoice(choice);
        }
    };

    return (
        <View style={styles.container}>
            {canGoBack && (
                <TouchableOpacity
                    style={styles.back_button}
                    onPress={goBack}>
                    <Text style={styles.back_text}>← Back</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.header}>{currentNode.text}</Text>

            {currentNode.choices.map((choice, idx) => (
                <Cell
                    key={idx}
                    choice={choice}
                    buttonlayout={buttonLayout}
                    onPress={() => handleChoicePress(choice)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: '100%',
        width: '100%',
        padding: 20,
        gap: 20,
    },
    back_button: {
        backgroundColor: '#d9d9d9',
        fontSize: 24,
        color: '#000000',
        height: 50,
        width: 85,
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