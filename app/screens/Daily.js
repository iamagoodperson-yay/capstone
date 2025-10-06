import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from 'react-native';
import Phrases from './Phrases';
import { selected }from './Phrases';
import Button from '../components/button';

const Daily = ({ coins, setCoins, buttonLayout }) => {
    const [chall, setChall] = useState('Order Chicken Rice');

    const submit = () => {
        if (selected === "chicken_rice") {
            Alert.alert('✅ Correct Answer!', 'You get your daily coin!\nTotal coins: ' + (coins + 1));
            setCoins(coins + 1);
        } else {
            Alert.alert('Wrong Answer!', 'Try Again!');
        }
    }

    return (
        <View style={styles.container}>
            <View />
            <Text style={styles.challengeText}>Challenge: {chall}</Text>
            <Phrases buttonLayout={buttonLayout} sent_id='categories' hideAddButton={true} />
            <Button title="Submit Answer" onPress={submit} />
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