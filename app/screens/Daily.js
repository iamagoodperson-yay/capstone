import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import Phrases from './Phrases';
import { selected }from './Phrases';
import Button from '../components/button';

const submit = () => {
    if (selected === "chicken_rice") {
        alert('Correct Answer!');
    } else {
        alert('Wrong Answer!');
    }
}

const Daily = () => {

    const [chall, setChall] = useState('Order Chicken Rice');

    return (
        <View style={styles.container}>
            <Text style={styles.challengeText}>Challenge: {chall}</Text>
            <Phrases/>
            <Button title="Submit Answer" onPress={submit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeText: {
        fontSize: 24,
        marginVertical: 20,
    },
});

export default Daily;