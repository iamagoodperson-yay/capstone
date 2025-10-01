import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Cell from '../components/cell';

function Settings({ buttonLayout, setButtonLayout }) {
    const [language, setLanguage] = useState('english');

    const renderFlag = (lang, imgSrc) => (
        <TouchableOpacity onPress={() => setLanguage(lang)}>
            <Image
                source={imgSrc}
                style={[styles.flag, language === lang ? styles.selectedFlag : null]}
            />
        </TouchableOpacity>
    );

    return (
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
    },
    subtext: {
        fontSize: 35,
        color: '#000000',
        marginBottom: 20,
    },
    flagcontainer:{
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
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
});

export default Settings;