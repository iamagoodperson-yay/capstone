import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function Settings({ buttonLayout, setButtonLayout }) {
    const [language, setLanguage] = useState('english');
    return (
        <View style={styles.container}>
            <View style={styles.bigcontainer}>
                <Text style={styles.subtext}>Languages</Text>
                <View style={styles.flagcontainer}>
                    <TouchableOpacity onPress={() => setLanguage('english')}>
                        <Image
                            source={require('../../assets/settings/englishflag.png')}
                            style={language === 'english' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLanguage('chinese')}>
                        <Image
                            source={require('../../assets/settings/chineseflag.png')}
                            style={language === 'chinese' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.flagcontainer}>
                    <TouchableOpacity onPress={() => setLanguage('malay')}>
                        <Image
                            source={require('../../assets/settings/malaysianflag.png')}
                            style={language === 'malay' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLanguage('indonesian')}>
                        <Image
                            source={require('../../assets/settings/indonesianflag.png')}
                            style={language === 'indonesian' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.subtext}>Button Layout</Text>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setButtonLayout(1)}
                    style={buttonLayout === 1 ? styles.high_button : styles.normal_button}>
                    <Image
                        source={require('../../assets/phrases/food.png')}
                        style={styles.main_image}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setButtonLayout(2)}
                    style={buttonLayout === 2 ? styles.high_button : styles.normal_button}>
                    <Image
                        source={require('../../assets/phrases/food.png')}
                        style={styles.split_image}
                    />
                    <View style={styles.split_textdiv}>
                        <Text style={styles.split_text}>Food</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setButtonLayout(3)}
                    style={buttonLayout === 3 ? styles.high_button : styles.normal_button}>
                    <Text style={styles.main_text}>Food</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'top',
        alignItems:'center',
        margin_left:23,
    },
    subtext: {
        fontSize: 35,
        color: '#000000',
        marginBottom: 0
    },
    flagcontainer:{
        flexDirection:'row',
        marginTop:20,
        alignItems:'center',
        justifyContent:'center'
    },
    bigcontainer:{
        flexDirection:'column',
        marginTop:20,
        alignItems:'center'
    },
    flag: {
        height:75,
        width:125,
        marginHorizontal:18,
        opacity:0.75,
        borderColor:'black',
        borderWidth: 2
    },
    selectedFlag: {
        height:75,
        width:125,
        marginHorizontal:18,
        borderColor: '#4CAF50',
        borderWidth: 5
    },
    normal_button: {
        height: 93,
        width: 330,
        flexDirection:'row',
        backgroundColor: '#d9d9d9',
        fontSize: 24,
        color:'#000000',
        borderRadius: 0,
        marginTop: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'transparent',
        borderWidth: 5,
    },
    high_button: {
        height: 93,
        width: 330,
        flexDirection:'row',
        backgroundColor: '#d9d9d9',
        fontSize: 24,
        color:'#000000',
        borderRadius: 0,
        marginTop: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#4CAF50',
        borderWidth: 5
    },
    split_image:{
        height: 50,
        width: 50,
        marginRight:20,
        marginLeft:20
    },
    split_text:{
        fontSize:24
    },
    main_image: {
        height:80,
        width:80,
    },
    main_text:{
        fontSize:42
    },
    split_textdiv: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});