import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../components/avatar';
import Button from '../components/button';
import { usePhrasesContext } from '../context/PhrasesContext';

const Home = ({ avatarSelection, avatarItems }) => {
    const navigation = useNavigation();
    const { phrases, navigateToPhrase } = usePhrasesContext();
    
    // Filter to only get phrases (final speakable phrases)
    const validPhrases = phrases.filter(phrase => phrase.type === 'phrase');
    
    const filteredPhrases = validPhrases
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 4);

    return (
        <ScrollView
            style={styles.ScrollView}
            contentContainerStyle={styles.container}
        >
            <Avatar size={250} avatarSelection={avatarSelection} avatarItems={avatarItems}/>
            <Text style={styles.header}>Common phrases that you use</Text>

            <View style={styles.list}>
                <View style={styles.grid}>
                    {filteredPhrases.map((item, index) => (
                        <TouchableOpacity
                            key={index.toString()}
                            style={styles.listContainer}
                            onPress={() => {
                                navigateToPhrase(item.id);
                                navigation.navigate('Phrases');
                            }}
                        >
                            <Image 
                                style={styles.listImage}
                                source={item.image || require('../../assets/phrases/food.png')} 
                            />
                            <Text style={styles.text}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Button
                title="See More..."
                onPress={() => {
                    navigateToPhrase('categories');
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    ScrollView: {
        flex: 1,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 40,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        width: '90%',
        alignItems: 'center',
    },
    grid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    listContainer: {
        margin: '2.5%',
        padding: 20,
        backgroundColor: '#d9d9d9',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        height: 150,
        borderRadius: 20,
    },
    listImage: {
        height: 50,
        aspectRatio: 1,
    },
    text: {
        fontSize: 20,
    },
    usageCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default Home;