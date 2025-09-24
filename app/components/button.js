import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Button({ onPress, title, color="#4CAF50" }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
    },
});

