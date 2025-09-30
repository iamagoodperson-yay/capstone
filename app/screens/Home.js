import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../components/avatar';
import Button from '../components/button';
import { usePhrasesContext } from '../context/PhrasesContext';

const Home = ({ avatarSelection, avatarItems }) => {
    const navigation = useNavigation();
    const { phrases } = usePhrasesContext();
    
    // Filter to only get phrases (final speakable phrases)
    const validPhrases = phrases.filter(phrase => phrase.type === 'phrase');
    
    const filteredPhrases = validPhrases
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 4);

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            key={index}
            style={styles.listContainer}
            onPress={() => {
                navigation.navigate('Phrases');
            }}
        >
            <Image 
                style={styles.listImage}
                source={item.image || require('../../assets/phrases/food.png')} 
            />
            <Text style={styles.text}>{item.text}</Text>
            {item.usageCount > 0 && (
                <Text style={styles.usageText}>Used {item.usageCount} times</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Avatar size={250} avatarSelection={avatarSelection} avatarItems={avatarItems}/>
            <Text style={styles.header}>Common phrases that you use</Text>
            <View style={styles.list}>
                <FlatList
                    data={filteredPhrases}
                    renderItem={renderItem}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <Button
                title="See More..."
                onPress={() => {
                    navigation.navigate('Phrases');
                }}
                color="#2196F3"
            />
            <Button
                title="Solve Daily Challenge"
                onPress={() => {
                    navigation.navigate('Challenge');
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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