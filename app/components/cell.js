import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Cell = ({ choice, buttonlayout, onPress }) => {
    const renderContent = () => {
        switch (buttonlayout) {
            case 1:
                return <Image source={choice.png} style={styles.image} />;
            case 2:
                return (
                    <View style={styles.contentContainer}>
                        <Image source={choice.png} style={[styles.image, { width: "20%" }]} />
                        <View style={styles.textContainer}>
                            <Text style={[styles.text, {fontSize: 28}]}>{choice.text}</Text>
                        </View>
                    </View>
                );
            case 3:
                return <Text style={styles.text}>{choice.text}</Text>;
        }
    };

    return (
        <TouchableOpacity
            style={[choice.size === "sound_button" ? styles.sound_button : styles.normal_button, choice.size === "selected" ? styles.selected_button : null]}
            onPress={onPress}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

export default Cell;

const styles = StyleSheet.create({
    sound_button: {
        fontSize: 36,
        color: '#000000',
        backgroundColor: '#d9d9d9',
        height: '25%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    normal_button: {
        fontSize: 24,
        color: '#000000',
        backgroundColor: '#d9d9d9',
        height: "15%",
        width: "80%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'transparent',
        borderWidth: 5,
    },
    selected_button: {
        borderColor: '#4CAF50',
        borderWidth: 5,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        margin: '5%',
        width: "25%",
        aspectRatio: 1,
    },
    text: {
        textAlign: 'center',
        fontSize: 32,
    },
});
