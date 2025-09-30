import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const Cell = ({ choice, buttonlayout, onPress }) => {
    const screenHeight = Dimensions.get('window').height;
    const renderContent = () => {
        switch (buttonlayout) {
            case 1:
                return <Image source={choice.image} style={styles.image} />;
            case 2:
                return (
                    <View style={styles.horizontalContainer}>
                        <Image source={choice.image} style={[styles.image, { width: "20%" }]} />
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
            style={[styles.normal_button, {height: screenHeight * 0.125}, choice.type === "selected" ? styles.selected_button : null]}
            onPress={onPress}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    normal_button: {
        fontSize: 24,
        backgroundColor: '#d9d9d9',
        margin: 10,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: 'transparent',
        borderWidth: 5,
    },
    selected_button: {
        borderColor: '#4CAF50',
    },
    horizontalContainer: {
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

export default Cell;