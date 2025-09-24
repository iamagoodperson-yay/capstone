import { View, Text, StyleSheet } from 'react-native';
import Avatar from '../components/avatar';

const Home = ({ avatarItems }) => {
    return (
        <View style={styles.container}>
            <Avatar size={200} avatarItems={avatarItems} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Home;