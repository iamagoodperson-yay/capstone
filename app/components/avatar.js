import { View, Image, StyleSheet } from 'react-native';
import { Image as RNImage } from 'react-native';

const Avatar = ({ size = 300, avatarSelection, avatarItems }) => {

    // pants sizing logic
    const pantsSrc = avatarItems.pants.find(item => item.id === avatarSelection.pants)?.name;
    const pantsDisplayW = size * 0.2366838488;
    let pantsDisplayH = pantsDisplayW;
    const pantsAsset = RNImage.resolveAssetSource(pantsSrc);
    if (pantsAsset && pantsAsset.width && pantsAsset.height) {
        pantsDisplayH = pantsDisplayW * (pantsAsset.height / pantsAsset.width);
    }

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
            {avatarSelection.pants !== 0 && (
                <View style={[styles.pantsContainer, { width: pantsDisplayW }]}>
                    <Image style={{ width: pantsDisplayW, height: pantsDisplayH, alignSelf: 'center' }}
                        source={pantsSrc} resizeMode="contain" />
                </View>
            )}
            {avatarSelection.shoes !== 0 && (
                <View style={styles.shoesContainer}>
                    <Image
                        style={{width: size * 0.0992268041, height: size * 0.0992268041, transform: [{ scaleX: -1 }]}}
                        source={avatarItems.shoes.find(item => item.id === avatarSelection.shoes)?.name}
                        resizeMode="contain"
                    />
                    <View style={{width: size * 0.085266323}}/>
                    <Image
                        style={{width: size * 0.0992268041, height: size * 0.0992268041}}
                        source={avatarItems.shoes.find(item => item.id === avatarSelection.shoes)?.name}
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
    pantsContainer: {
        zIndex: 1,
        position: 'absolute',
        top: '72.1649484536%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    shoesContainer: {
        zIndex: 1,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'end',
    },
});

export default Avatar;