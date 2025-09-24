import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from "react";
import storyData from "../phrases.json";

const story = storyData;

export let selected = null;

export function proceed(choice, setCurrentId) {
    if (choice.size == "sound_button") {
        // Play Sound
        selected = choice.next;
        return choice.next;
    }else{
        setCurrentId(choice.next);
    }

}

function Phrases() {
    const [currentId, setCurrentId] = useState("categories");
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
                    onPress={() => proceed(choice,setCurrentId)}>
                    <Text>{choice.text}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default Phrases;

const styles = StyleSheet.create({
container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    padding: 20,
},
normal_button: {
    backgroundColor: '#d9d9d9',
    fontSize: 24,
    color: '#000000',
    height: 93,
    width: 330,
    borderRadius: 0,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
},
sound_button: {
    backgroundColor: '#d9d9d9',
    fontSize: 24,
    color: '#000000',
    height: 330,
    width: 330,
    borderRadius: 0,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
},
back_button:{
    backgroundColor: '#d9d9d9',
    fontSize: 16,
    color: '#000000',
    height: 65,
    width: 40,
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