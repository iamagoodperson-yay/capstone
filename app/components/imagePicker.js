import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { saveImageToPersistentStorage, deleteImageFromStorage, isPersistentImage } from '../utils/imageStorage';
import { useTranslation } from 'react-i18next';
import Button from './button';

const ImagePicker = ({ selectedImage, onImageSelected, onImageRemoved }) => {
    const { t } = useTranslation();

    const [isSaving, setIsSaving] = useState(false);

    const handleSelectImage = async () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 500,
                maxHeight: 500,
            },
            async response => {
                if (response.didCancel) {
                    return;
                }

                if (response.errorCode) {
                    Alert.alert(t('imagePicker.errorTitle'), response.errorMessage || t('imagePicker.chooseImageError'));
                    return;
                }

                if (response.assets && response.assets[0]) {
                    setIsSaving(true);
                    try {
                        const asset = response.assets[0];
                        const sourceUri = asset.uri;
                        const mimeType = asset.type;
                        // Save to persistent storage with MIME type for better extension detection
                        const persistentUri = await saveImageToPersistentStorage(sourceUri, null, mimeType);
                        onImageSelected({ uri: persistentUri });
                    } catch (error) {
                        Alert.alert(t('imagePicker.errorTitle'), t('imagePicker.saveImgError') + ' ' + error.message);
                        console.error('Image save error:', error);
                    } finally {
                        setIsSaving(false);
                    }
                }
            },
        );
    };

    const handleTakePhoto = async () => {
        launchCamera(
            {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 500,
                maxHeight: 500,
                saveToPhotos: false, // Don't save to camera roll
            },
            async response => {
                if (response.didCancel) {
                    return;
                }

                if (response.errorCode) {
                    Alert.alert(t('imagePicker.errorTitle'), response.errorMessage || t('imagePicker.takePhotoError'));
                    return;
                }

                if (response.assets && response.assets[0]) {
                    setIsSaving(true);
                    try {
                        const asset = response.assets[0];
                        const sourceUri = asset.uri;
                        const mimeType = asset.type;
                        // Save to persistent storage with MIME type for better extension detection
                        const persistentUri = await saveImageToPersistentStorage(sourceUri, null, mimeType);
                        onImageSelected({ uri: persistentUri });
                    } catch (error) {
                        Alert.alert(t('imagePicker.errorTitle'), t('imagePicker.saveImgError') + ' ' + error.message);
                        console.error('Image save error:', error);
                    } finally {
                        setIsSaving(false);
                    }
                }
            },
        );
    };

    const handleRemoveImage = async () => {
        // Delete from persistent storage if it's a persistent image
        if (selectedImage && selectedImage.uri && isPersistentImage(selectedImage.uri)) {
            await deleteImageFromStorage(selectedImage.uri);
        }
        onImageRemoved();
    };

    if (isSaving) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    if (selectedImage) return (
        <View style={styles.imagePreviewContainer}>
            <Image source={selectedImage} style={styles.imagePreview} />
            <Button
                title={t('imagePicker.removeImage')}
                width="0.4"
                color="#DC3545"
                onPress={handleRemoveImage}
            />
        </View>
    );
    else return (
        <View style={styles.buttonRow}>
            <Button
                title={t('imagePicker.selectImage')}
                width="0.4"
                color="#2196F3"
                onPress={handleSelectImage}
            />
            <Button
                title={t('imagePicker.takePhoto')}
                width="0.4"
                color="#2196F3"
                onPress={handleTakePhoto}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    imagePreviewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: '95%',
        backgroundColor: '#d9d9d9',
        paddingVertical: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
    buttonRow: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loadingContainer: {
        width: '95%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ImagePicker;