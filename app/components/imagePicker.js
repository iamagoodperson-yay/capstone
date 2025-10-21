import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Button from './button';

const ImagePicker = ({ selectedImage, onImageSelected, onImageRemoved }) => {
  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      },
      response => {
        if (response.assets && response.assets[0]) {
          onImageSelected({ uri: response.assets[0].uri });
        }
      },
    );
  };

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      },
      response => {
        if (response.assets && response.assets[0]) {
          onImageSelected({ uri: response.assets[0].uri });
        }
      },
    );
  };

  if (selectedImage) {
    return (
      <View style={styles.imagePreviewContainer}>
        <Image source={selectedImage} style={styles.imagePreview} />
        <Button
          title="Remove Image"
          width="0.4"
          color="#DC3545"
          onPress={onImageRemoved}
        />
      </View>
    );
  }

  return (
    <View style={styles.buttonRow}>
      <Button
        title="Select Image"
        width="0.4"
        color="#2196F3"
        onPress={handleSelectImage}
      />
      <Button
        title="Take Photo"
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
});

export default ImagePicker;
