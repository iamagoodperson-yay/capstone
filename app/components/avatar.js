import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Avatar({ avatarItems, size = 300 }) {

    return (
        <View style={[styles.avatar, {width: size, height: size, borderRadius: size / 2} ]}>
            <Text style={styles.avatarText}>🙂</Text>
            <Text style={styles.itemsText}>
                Hat: {avatarItems.hats}{"\n"}
                Shirt: {avatarItems.shirts}{"\n"}
                Pant: {avatarItems.pants}{"\n"}
                Shoe: {avatarItems.shoes}{"\n"}
                Accessory: {avatarItems.accessories}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        overflow: 'hidden',
        backgroundColor: '#d9d9d9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 100,
        color: '#666',
    },
    itemsText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 10,
    }
});