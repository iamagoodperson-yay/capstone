import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import Phrases from './Phrases';
import { selected }from './Phrases';
import { Button } from '@react-navigation/elements';

function submit(){
    alert('Challenge Submitted!');
    if(selected == "chicken_rice"){
        alert('Correct Answer!');
    }else{
        alert('Wrong Answer!');
    }
}

function Daily() {

    const [chall, setChall] = useState('Order Chicken Rice');
    const [ansRight, setAnsRight] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.challengeText}>{chall}</Text>
            <Phrases/>
            <Button
                style={styles.submitButton}
                onPress={() => submit()}
            >Submit</Button>
        </View>
    );
}

export default Daily;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeText: {
        fontSize: 24,
        marginBottom: 20,
    },
    submitButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        margin: 20,
    },
});