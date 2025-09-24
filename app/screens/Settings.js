import { View, Text, StyleSheet } from 'react-native';

function Settings() {
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
        </View>
    );
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});