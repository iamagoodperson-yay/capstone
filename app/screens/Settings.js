import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Cell from '../components/cell';

function Settings({ buttonLayout, setButtonLayout }) {
    const [language, setLanguage] = useState('english');
    const navigation = useNavigation();

    const renderFlag = (lang, imgSrc) => (
        <TouchableOpacity onPress={() => setLanguage(lang)}>
            <Image
                source={imgSrc}
                style={[styles.flag, language === lang ? styles.selectedFlag : null]}
            />
        </TouchableOpacity>
    );

    return (
        <ScrollView style = {styles.scrollView}>

        <View style={styles.container}>
            <Text style={styles.subtext}>Languages</Text>
            <View style={styles.flagcontainer}>
                {renderFlag('english', require('../../assets/settings/englishflag.png'))}
                {renderFlag('chinese', require('../../assets/settings/chineseflag.png'))}
            </View>
            <View style={styles.flagcontainer}>
                {renderFlag('malay', require('../../assets/settings/malaysianflag.png'))}
                {renderFlag('indonesian', require('../../assets/settings/indonesianflag.png'))}
            </View>
            <Text style={styles.subtext}>Button Layout</Text>
            <Cell
                content={{
                    type: buttonLayout == 1 ? "selected" : "normal_button",
                    image: require('../../assets/phrases/food.png'),
                }}
                buttonlayout={1}
                onPress={() => setButtonLayout(1)}
                height={0.125}
            />
            <Cell
                content={{
                    type: buttonLayout == 2 ? "selected" : "normal_button",
                    image: require('../../assets/phrases/food.png'),
                    text: "Food",
                }}
                buttonlayout={2}
                onPress={() => setButtonLayout(2)}
                height={0.125}
            />
            <Cell
                content={{
                    type: buttonLayout == 3 ? "selected" : "normal_button",
                    text: "Food",
                }}
                buttonlayout={3}
                onPress={() => setButtonLayout(3)}
                height={0.125}
            />
        </View>
        <View style = {styles.container}>
            <Text style={styles.subtext}> User's Manual</Text>
            <Text style={styles.small_text}>
                The buttons in the Phrases Tab allow you to choose between different scenarios, such as ordering food or asking for directions.
            </Text>
            <Image source={require('../../assets/settings/tutorial1.png')} style={styles.main_image}/>
            <Text style={styles.small_text}>
                Buttons with a loudspeaker icon will read out the phrase when pressed.
            </Text>
            <Image source={require('../../assets/settings/tutorial2.png')} style={styles.main_image}/>
            <Text style={styles.small_text}>
                The Daily Challenge resets daily, and requires the user to accomplish a certain task using the Phrases, such as ordering food.
            </Text>
            <Image source={require('../../assets/settings/tutorial3.png')} style={styles.main_image}/>
            <Text style={styles.small_text}>
                Successfully completing the Daily Challenge awards you coins, allowing you to purchase cosmetics for your avatar.
            </Text>
            <Image source={require('../../assets/settings/tutorial4.png')} style={styles.main_image}/>
            <Image source={require('../../assets/settings/tutorial5.png')} style={styles.main_image}/>
        </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
        textAlign: 'center',
        margin: 20,

    },
    subtext: {
        fontSize: 35,
        color: '#000000',
        marginBottom: 20,
    },
    flagcontainer:{
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    flag: {
        height: 75,
        width: 125,
        opacity: 0.75,
        borderColor: 'black',
        borderWidth: 2,
    },
    selectedFlag: {
        borderColor: '#4CAF50',
        borderWidth: 5
    },
    scrollView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 32,
    },
    normal_button: {
        fontSize: 24,
        backgroundColor: '#d9d9d9',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: 'transparent',
        borderWidth: 5,
        borderRadius: 15,
        width:330,
        height:93
    },
    small_text: {
        fontSize: 20,
        textAlign: 'center',
    },
    main_image: {
        height: 200,
        width: 300,
        resizeMode: 'contain',
        marginBottom: 20,
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'black',
    },
});

export default Settings;