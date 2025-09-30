import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({ onPress, title, color="#4CAF50", width="85%" }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color, width: width }]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
});

export default Button;