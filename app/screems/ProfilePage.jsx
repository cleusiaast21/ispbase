import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';


export default function Profile({ route }) {

  const navigation = useNavigation();

  const { personId } = route.params;
  const [personName, setPersonName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [itemUri, setItemUri] = useState('');
  const [itemType, setItemType] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);


  const pickAudio = async () => {
    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      setItemType('audio');
      setItemUri({ uri });
      setSelectedAudio({ uri, name });

    } catch (error) {
      console.error('Erro ao escolher o áudio:', error);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setItemType('video');
        setItemUri(result.uri);
      }
    } catch (error) {
      console.log('Error picking video:', error);
    }
  };

  const pickImage = async () => {

    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      setThumbnailUri({ uri });
      setSelectedThumbnail({ uri, name });
    } catch (error) {
      console.error('Erro ao escolher a thumbnail:', error);
    }
  }

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

  const getFilenameFromURL = (url) => {
    const startIndex = url.lastIndexOf('/') + 1;
    return url.substring(startIndex);
  };

  const handleAudioSelection = async () => {
    try {
      await pickAudio();

    } catch (error) {
      console.error('Error selecting audio:', error);
    }
  };

  const handleVideoSelection = async () => {
    try {
      await pickVideo();

    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  function handleItemSelection() {
    Alert.alert(
      'Escolha o tipo de mídia',
      'Escolha o tipo de mídia que quer postar:',
      [
        {
          text: 'Áudio',
          onPress: handleAudioSelection,
        },
        {
          text: 'Vídeo',
          onPress: handleVideoSelection,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }



  const handleUploadNewItem = async () => {

    if (title && description && thumbnailUri && itemUri) {

      if (itemType === 'audio') {
        try {
          const audioStorageRef = ref(FIREBASE_STORAGE, `audios/${selectedAudio.name}`);
          const audioResponse = await fetch(selectedAudio.uri);
          const audioBlob = await audioResponse.blob();
          await uploadBytes(audioStorageRef, audioBlob);
          const url = await getDownloadURL(audioStorageRef);

          const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${selectedThumbnail.name}`);
          const thumbnailResponse = await fetch(selectedThumbnail.uri);
          const thumbnailBlob = await thumbnailResponse.blob();
          await uploadBytes(thumbnailStorageRef, thumbnailBlob);
          const thumbnailURL = await getDownloadURL(thumbnailStorageRef);

          const audioData = {
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            url,
            thumbnailURL,
            artist: personId,
          };

          const audiosCollection = collection(FIREBASE_DB, 'audios');
          await addDoc(audiosCollection, audioData);

          console.log('Áudio enviado com sucesso!');
          alert('Áudio enviado com sucesso!');

        } catch (error) {
          console.error('Erro ao enviar o áudio:', error);
        }
      } else if (itemType === 'video') {

        try {
          const thumbnailResponse = await fetch(thumbnailUri);
          const thumbnailBlob = await thumbnailResponse.blob();

          const videoResponse = await fetch(selectedAudio.uri);
          const videoBlob = await videoResponse.blob();

          // Generate unique filenames for the thumbnail and video
          const thumbnailExtension = thumbnailUri.split('.').pop();
          const thumbnailFilename = `${uuidv4()}.${thumbnailExtension}`;

          const videoExtension = selectedAudio.uri.split('.').pop();
          const videoFilename = `${uuidv4()}.${videoExtension}`;

          // Upload the thumbnail to "thumbnails" folder in Firebase Storage
          const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${thumbnailFilename}`);
          await uploadBytes(thumbnailStorageRef, thumbnailBlob);

          // Upload the video to "videos" folder in Firebase Storage
          const videoStorageRef = ref(FIREBASE_STORAGE, `videos/${videoFilename}`);
          const videoSnapshot = await uploadBytes(videoStorageRef, videoBlob);

          // Get the download URL of the video
          const videoURL = await getDownloadURL(videoSnapshot.ref);

          // Save the paths and video URL to Firestore
          const videoData = {
            title: title,
            description: description,
            thumbnailPath: thumbnailStorageRef.fullPath,
            videoPath: videoStorageRef.fullPath,
            videoURL: videoURL, // Add the video URL to the document data
            createdAt: new Date(), // Add the current timestamp as the created date
            artist: personId,
          };

          const videosCollection = collection(FIREBASE_DB, 'videos');
          await addDoc(videosCollection, videoData);

          console.log('Video successfully uploaded to the database!');

        } catch (error) {
          console.log('Error uploading video to the database:', error);
        }

      }

    } else {
      Alert.alert('Formulário incompleto', 'Por favor preencha todos os campos e selecione um ficheiro e uma thumbnail.');
    }
  };

  function logout() {
    navigation.navigate('Login');

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleChangeProfilePicture}>
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.label}>Hello, {personName}!</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonText}>Ver mídias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
          <Text style={styles.buttonText}>Postar novo mídia</Text>
        </TouchableOpacity>
      </View>
      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.thumbnailButton} onPress={pickImage}>
            {thumbnailUri ? (
              <Text style={{ color: 'green' }}>Thumbnail selecionada</Text>
            ) : (
              <Text style={styles.thumbnailButtonText}>Select Thumbnail</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemButton} onPress={handleItemSelection}>
            {itemUri ? (
              <Text style={styles.itemButtonText}>{itemType === 'audio' ? <Text style={{ color: 'green' }}>Audio selecionado</Text> : <Text style={{ color: 'green' }}>Video selecionado</Text>}</Text>
            ) : (
              <Text style={styles.itemButtonText}>Select Item</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadNewItem}>
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>

        </View>
      )}


      <TouchableOpacity onPress={logout}>
        <Text style={styles.uploadButtonText}>logout</Text>
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
  options: {
    flexDirection: 'row',

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
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  thumbnailButton: {
    backgroundColor: 'lightgray',
    width: '80%',
    height: 40,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  thumbnailButtonText: {
    color: 'gray',
  },
  itemButton: {
    backgroundColor: 'lightgray',
    width: '80%',
    height: 40,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemButtonText: {
    color: 'gray',
  },
  uploadButton: {
    backgroundColor: 'pink',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
