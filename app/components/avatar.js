import { View, Image, StyleSheet } from 'react-native';

const Avatar = ({ size = 400, avatarSelection, avatarItems }) => {
    return (
        <View style={[styles.avatarContainer, {width: size, height: size} ]}>
            <Image
                style={styles.avatarImage}
                source={require('../../assets/avatar/avatar.png')}
                resizeMode="contain"
            />
            {avatarSelection.hats !== 0 && avatarItems.hats && (
                <View style={styles.hatContainer}>
                    <Image
                        style={{width: size * 0.3, height: size * 0.3}}
                        source={avatarItems.hats.find(item => item.id === avatarSelection.hats)?.name}
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
        top: '20%',
        width: '80%',
        height: '80%',
    },
    hatContainer: {
        zIndex: 1,
        position: 'absolute',
        top: '10%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});

export default Avatar;