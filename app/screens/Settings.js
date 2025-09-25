import { View, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';

import { useState } from 'react';

function Settings() {
    const [language, setLanguage] = useState('english');
    const [buttonlayout, setbuttonlayout] = useState('split');
    return (
        <View style={styles.container}>
            <Text style={styles.subtext}>Languages</Text>
            <View style={styles.bigcontainer}>
                <View style={styles.flagcontainer}>
                    <TouchableOpacity onPress={() => setLanguage('english')}>
                        <Image
                            source={require('../assets/flags/englishflag.png')}
                            style={language === 'english' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLanguage('chinese')}>
                        <Image
                            source={require('../assets/flags/chineseflag.png')}
                            style={language === 'chinese' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.flagcontainer}>
                    <TouchableOpacity onPress={() => setLanguage('malay')}>
                        <Image
                            source={require('../assets/flags/malaysianflag.png')}
                            style={language === 'malay' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLanguage('indonesian')}>
                        <Image
                            source={require('../assets/flags/indonesianflag.png')}
                            style={language === 'indonesian' ? styles.selectedFlag : styles.flag}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.subtext}>Button Layout</Text>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setbuttonlayout('image')}
                    style={buttonlayout === 'image' ? styles.high_button : styles.normal_button}>
                    <Image
                        source={require('../assets/phrases/food.png')}
                        style={styles.main_image}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setbuttonlayout('split')}
                    style={buttonlayout === 'split' ? styles.high_button : styles.normal_button}>
                    <Image
                        source={require('../assets/phrases/food.png')}
                        style={styles.split_image}
                    />
                    <View style={styles.split_textdiv}>
                        <Text style={styles.split_text}>Food</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setbuttonlayout('text')}
                    style={buttonlayout === 'text' ? styles.high_button : styles.normal_button}>
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
        margin_left:23,
    },
    subtext: {
        fontSize: 35,
        color: '#000000',
        marginLeft:23,
        marginBottom: 0
    },
    flagcontainer:{
        flexDirection:'row',
        marginTop:20
    },
    bigcontainer:{
        flexDirection:'column',
        marginTop:20
    },
    flag: {
        height:75,
        width:125,
        marginHorizontal:18,
        opacity:0.75
    },
    selectedFlag: {
        height:75,
        width:125,
        marginHorizontal:18,
        borderColor: 'yellow',
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
        borderColor: 'yellow',
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
        height:90,
        width:90,
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