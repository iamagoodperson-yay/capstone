import { View, Image, StyleSheet } from 'react-native';

export default function Avatar({ size = 300, avatarSelection, avatarItems }) {
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
                        style={{width: size * 0.35, height: size * 0.35}}
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
        top: '10%',
        width: '90%',
        height: '90%',
    },
    hatContainer: {
        zIndex: 1,
        position: 'absolute',
        top: '0%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});