import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';

const ImageUploadScreen = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need media library permissions to make this work!'
      );
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Error', 'No image selected');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      // Generate a unique filename using a timestamp
      const filename = `${Date.now()}.jpg`;

      const storageRef = ref(FIREBASE_STORAGE, `images/${filename}`);
      const uploadTask = uploadBytes(storageRef, blob);

      await uploadTask;

      Alert.alert('Success', 'Image uploaded!');
      setImage(null);
    } catch (error) {
      console.log('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }

    setUploading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 16 }}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 16 }} />
      )}
      <TouchableOpacity onPress={uploadImage} disabled={uploading}>
        <Text>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageUploadScreen;
