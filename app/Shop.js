import { View, Text, StyleSheet } from 'react-native';

function Shop() {
    return (
        <View style={styles.container}>
            <Text>Shop Screen</Text>
        </View>
    );
}

export default Shop;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});