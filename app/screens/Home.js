import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../components/avatar';

const Home = ({ avatarItems }) => {
    const phrases = [
        { phrase: "Hello", image: "👋" },
        { phrase: "I want to eat chicken rice", image: "🍚" },
        { phrase: "Thank you", image: "🙏" },
        { phrase: "Goodbye", image: "👋" },
    ]

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.dropdownItem}
            onPress={() => handleSelect(item)}
        >
            <Text style={styles.dropdownItemImage}>{item.image} </Text>
            <Text style={styles.dropdownItemText}>{item.phrase}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Avatar size={200} avatarItems={avatarItems} />
            <Text style={styles.header}>Common phrases that you use</Text>
            <View style={styles.dropdownList}>
                <FlatList
                    data={phrases}
                    renderItem={renderItem}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    dropdownList: {
        width: '90%',
        marginTop: 20,
    },
    row: {
        justifyContent: 'space-between',
    },
    dropdownContainer: {
        margin: 10,
        padding: 20,
        backgroundColor: '#D0D0D0',
        alignContent: 'center',
    },
    dropdownItemImage: {
        height: 24,
        aspectRatio: 1,
    },
    dropdownItemText: {
        fontSize: 18,
    },
});

export default Home;