import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../components/avatar';
import Dropdown from '../components/dropdown'; 

const selection = (selectedItem) => {
    switch (selectedItem) {
        case "Hats":
            return [
                { id: 0, name: "X", price: 0, unlocked: true, },
                { id: 1, name: "🧢", price: 1, unlocked: false, },
                { id: 2, name: "🧢", price: 1, unlocked: false, },
                { id: 3, name: "🧢", price: 1, unlocked: false, },
            ];
        case "Shirts":
            return [
                { id: 0, name: "X", price: 0, unlocked: false, },
                { id: 1, name: "👕", price: 2, unlocked: false, },
                { id: 2, name: "👔", price: 3, unlocked: false, },
                { id: 3, name: "👚", price: 2, unlocked: false, },
            ];
        case "Pants":
            return [
                { id: 0, name: "X", price: 0, unlocked: false, },
                { id: 1, name: "👖", price: 2, unlocked: false, },
                { id: 2, name: "🩳", price: 2, unlocked: false, },
                { id: 3, name: "👗", price: 3, unlocked: false, },
            ];
        case "Shoes":
            return [
                { id: 0, name: "X", price: 0, unlocked: false, },
                { id: 1, name: "👟", price: 2, unlocked: false, },
                { id: 2, name: "👠", price: 3, unlocked: false, },
                { id: 3, name: "🥾", price: 3, unlocked: false, },
            ];
        case "Accessories":
            return [
                { id: 0, name: "X", price: 0, unlocked: false, },
                { id: 1, name: "🎒", price: 2, unlocked: false, },
                { id: 2, name: "🕶️", price: 3, unlocked: false, },
                { id: 3, name: "📿", price: 3, unlocked: false, },
            ];
    }
};

function Shop({ avatarItems, setAvatarItems }) {
    const [category, setCategory] = useState("Hats");

    return (
        <View style={styles.container}>
            <Avatar avatarItems={avatarItems} />
            <Dropdown
                values={["Hats", "Shirts", "Pants", "Shoes", "Accessories"]}
                base={category}
                changebase={setCategory}
            />
            <View style={styles.selectionContainer}>
                    <FlatList
                        data={selection(category)}
                        numColumns={3}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.itemContainer}
                                onPress={() => {
                                    setAvatarItems(prev => ({
                                        ...prev,
                                        [category.toLowerCase()]: item.id
                                    }));
                                }}
                            >
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.priceText}>${item.price}</Text>
                            </TouchableOpacity>
                        )}
                        columnWrapperStyle={styles.row}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    selectionContainer: {
        width: '90%',
        marginTop: 20,
    },
    listContent: {
        paddingBottom: 20,
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
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '30%',
    },
    itemText: {
        fontSize: 40,
        fontWeight: '500',
        marginBottom: 5,
    },
    priceText: {
        fontSize: 16,
        color: '#666',
    },
});

export default Shop;