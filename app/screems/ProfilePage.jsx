import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ route }) {
  const { personId } = route.params;
  const [personName, setPersonName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPersonName(data.name);
          setProfileImageUrl(data.imageUrl || null);
        }
      } catch (error) {
        console.log('Error fetching person data:', error);
      }
    };

    fetchPersonData();
  }, [personId]);

  const handleChangeProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const response = await fetch(selectedAsset.uri);
        const blob = await response.blob();

        // Generate a unique filename using a timestamp
        const filename = `${Date.now()}.jpg`;

        const storageRef = ref(FIREBASE_STORAGE, `profilePictures/${filename}`);
        const uploadTask = uploadBytes(storageRef, blob);

        await uploadTask;

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Delete the previous profile picture from the storage
        if (profileImageUrl) {
          const previousImageRef = ref(FIREBASE_STORAGE, getFilenameFromURL(profileImageUrl));
          try {
            await deleteObject(previousImageRef);
          } catch (error) {
            console.log('Error deleting previous profile picture:', error);
          }
        }

        // Update the profileImageUrl state with the new image URL
        setProfileImageUrl(downloadURL);

        // Update the profile image URL in the database
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        await updateDoc(docRef, {
          imageUrl: downloadURL,
        });

        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.log('Error changing profile picture:', error);
      Alert.alert('Error', 'Failed to change profile picture');
    }
  };

  const handleViewUploadedItems = () => {
    // Navigate to the "View Uploaded Items" screen
    // Implement the navigation logic based on your app's navigation library
  };

  const handleUploadNewItem = () => {
    // Navigate to the "Upload New Item" screen
    // Implement the navigation logic based on your app's navigation library
  };

  const getFilenameFromURL = (url) => {
    const startIndex = url.lastIndexOf('/') + 1;
    return url.substring(startIndex);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleChangeProfilePicture}>
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.label}>Hello, {personName}!</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewUploadedItems}>
        <Text style={styles.buttonText}>View Uploaded Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUploadNewItem}>
        <Text style={styles.buttonText}>Upload a New Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'pink',
    borderRadius: 25,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
