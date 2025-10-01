import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const Cell = ({ content, buttonlayout, onPress, onLongPress, height }) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    const renderContent = () => {
        switch (buttonlayout) {
            case 1:
                return <Image source={content.image} style={styles.image} />;
            case 2:
                return (
                    <View style={styles.horizontalContainer}>
                        <Image source={content.image} style={[styles.image, { width: "20%" }]} />
                        <View style={styles.textContainer}>
                            <Text style={[styles.text, {fontSize: 28}]}>{content.text}</Text>
                        </View>
                    </View>
                );
            case 3:
                return <Text style={styles.text}>{content.text}</Text>;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.normal_button, {height: screenHeight * height, width: screenWidth * 0.80}, content.type === "selected" ? styles.selected_button : null]}
            onPress={onPress}
            onLongPress={() => {
                console.log('Long press detected on:', content.text);
                onLongPress && onLongPress();
            }}
            delayLongPress={500}
            activeOpacity={0.7}
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: 'transparent',
        borderWidth: 5,
        borderRadius: 15,
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
        marginLeft: 20,
        marginRight: 25,
        width: "25%",
        aspectRatio: 1,
    },
    text: {
        fontSize: 32,
    },
});

export default Cell;