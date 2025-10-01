import { Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';

const Button = ({ onPress, title, color="#4CAF50", width="0.85" }) => {
    const buttonWidth = Dimensions.get('window').width * width;
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color, width: buttonWidth }]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
});

export default Button;