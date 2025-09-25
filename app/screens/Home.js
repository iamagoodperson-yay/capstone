import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../components/avatar';
import Button from '../components/button';

const Home = ({ avatarSelection, avatarItems }) => {
    const phrases = [
        { phrase: "Hello", image: require('../../assets/phrases/hello.png') },
        { phrase: "I want to eat chicken rice", image: require('../../assets/phrases/chicken_rice.png') },
        { phrase: "Thank you", image: require('../../assets/phrases/thank_you.png') },
        { phrase: "Goodbye", image: require('../../assets/phrases/goodbye.png') },
    ]

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.listContainer}
            onPress={() => {}}
        >
            <Image style={styles.listImage} source={item.image} />
            <Text style={styles.text}>{item.phrase}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Avatar size={200} avatarSelection={avatarSelection} avatarItems={avatarItems}/>
            <Text style={styles.header}>Common phrases that you use</Text>
            <View style={styles.list}>
                <FlatList
                    data={phrases}
                    renderItem={renderItem}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <Button
                title="See More..."
                onPress={() => {}}
                color="#2196F3"
            />
            <Button
                title="Solve Daily Challenge"
                onPress={() => {}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        width: '90%',
        alignItems: 'center',
    },
    listContainer: {
        margin: '2.5%',
        padding: 20,
        backgroundColor: '#d9d9d9',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        height: 150,
        borderRadius: 10,
    },
    listImage: {
        height: 50,
        aspectRatio: 1,
    },
    text: {
        fontSize: 20,
    },
});

export default Home;