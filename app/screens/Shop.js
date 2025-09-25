import { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../components/avatar';
import Dropdown from '../components/dropdown'; 

function Shop({ avatarSelection, setAvatarSelection, avatarItems, setAvatarItems }) {
    const [category, setCategory] = useState("Hats");

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => {
                setAvatarSelection(prev => ({
                    ...prev,
                    [category.toLowerCase()]: item.id
                }));
            }}
        >
            <Image style={styles.itemImage} source={item.name} />
            <Text style={styles.priceText}>${item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
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
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    priceText: {
        fontSize: 16,
        color: '#666',
    },
});

export default Shop;