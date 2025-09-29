import React, { useState } from 'react';
import { View, Text, FlatList, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../components/avatar';
import Dropdown from '../components/dropdown'; 

function Shop({ coins, setCoins, avatarSelection, setAvatarSelection, avatarItems, setAvatarItems }) {
    const [category, setCategory] = useState("Hats");

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => {
                if (item.unlocked) {
                    setAvatarSelection(prev => ({
                        ...prev,
                        [category.toLowerCase()]: item.id
                    }));
                } else {
                    if (coins >= item.price) {
                        setAvatarSelection(prev => ({
                            ...prev,
                            [category.toLowerCase()]: item.id
                        }));
                        setAvatarItems(prevItems => ({
                            ...prevItems,
                            [category.toLowerCase()]: prevItems[category.toLowerCase()].map(i =>
                                i.id === item.id ? { ...i, unlocked: true } : i
                            ),
                        }));
                        setCoins(prevCoins => prevCoins - item.price);
                    } else {
                        Alert.alert(
                            'Not enough 🪙',
                            `You need to have ${item.price} 🪙 but only have ${coins} 🪙.`,
                        );
                    }
                }
            }}
        >
            {!item.unlocked && (
                <View style={styles.lockedOverlay}>
                    <Image
                        style={styles.lockIcon}
                        source={require('../../assets/avatar/lock.png')}
                    />
                    <Text style={styles.priceText}>🪙 {item.price}</Text>
                </View>
            )}
            <Image style={styles.itemImage} source={item.name} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.coinsText}>🪙: {coins}</Text>
            <Avatar avatarSelection={avatarSelection} avatarItems={avatarItems} />
            <Dropdown
                values={["Hats", "Shirts", "Pants", "Shoes", "Accessories"]}
                base={category}
                changebase={setCategory}
            />
            <View style={styles.selectionContainer}>
                    <FlatList
                        data={avatarItems[category.toLowerCase()]}
                        numColumns={3}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        columnWrapperStyle={styles.row}
                        showsVerticalScrollIndicator={false}
                    />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
    },
    coinsText: {
        position: 'absolute',
        top: 20,
        left: "5%",
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    selectionContainer: {
        width: '90%',
    },
    row: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    itemContainer: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: '#d0d0d0',
        margin: 5,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '30%',
    },
    lockedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    lockIcon: {
        width: '45%',
        height: '45%',
        tintColor: 'white',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    priceText: {
        position: 'absolute',
        bottom: 3,
        fontSize: 20,
        color: '#fff',
    },
});

export default Shop;