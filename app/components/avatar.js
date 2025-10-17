import { View, Image, StyleSheet } from 'react-native';

const Avatar = ({ size = 300, avatarSelection, avatarItems }) => {
    return (
        <View style={[styles.avatarContainer, {width: size, height: size} ]}>
            <Image
                style={styles.avatarImage}
                source={require('../../assets/avatar/avatar.png')}
                resizeMode="contain"
            />
            {avatarSelection.hats !== 0 && (
                <View style={styles.hatContainer}>
                    <Image
                        style={{width: size * 0.3339776632, height: size * 0.3339776632}}
                        source={avatarItems.hats.find(item => item.id === avatarSelection.hats)?.name}
                        resizeMode="contain"
                    />
                </View>
            )}
            {avatarSelection.shirts !== 0 && (
                <View style={styles.shirtContainer}>
                    <Image
                        style={{width: size * 0.262242268, height: size * 0.262242268}}
                        source={avatarItems.shirts.find(item => item.id === avatarSelection.shirts)?.name}
                        resizeMode="contain"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        position: 'absolute',
        top: '19.5661512%',
        width: '74.89261168%',
        height: '74.89261168%',
    },
    hatContainer: {
        zIndex: 1,
        position: 'absolute',
        top: 0,
    },
    shirtContainer: {
        zIndex: 1,
        position: 'absolute',
        top: '46.4991408935%',
    },
});

export default Avatar;