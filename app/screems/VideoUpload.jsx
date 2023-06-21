import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../../FirebaseConfig';
import { ref, uploadString } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const VideoUploadPage = () => {
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');

  const handleVideoSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.cancelled) {
        setVideoUri(result.uri);
      }
    } catch (error) {
      console.log('Erro ao selecionar o vídeo:', error);
    }
  };

  const handleThumbnailSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.cancelled) {
        setThumbnailUri(result.uri);
      }
    } catch (error) {
      console.log('Erro ao selecionar a thumbnail:', error);
    }
  };

  const handleUploadPress = async () => {
    if (description && videoUri && thumbnailUri) {
      try {
        // Fazer upload da thumbnail para a pasta "thumbnails" no Firebase Storage
        const thumbnailRef = ref(firebase.storage(), 'thumbnails/thumbnail.jpg');
        await uploadString(thumbnailRef, thumbnailUri, 'data_url');

        // Fazer upload do vídeo para a pasta "videos" no Firebase Storage
        const videoRef = ref(firebase.storage(), 'videos/video.mp4');
        await uploadString(videoRef, videoUri, 'data_url');

        // Salvar as referências dos caminhos no Firebase Firestore
        const videoData = {
          description,
          thumbnailPath: thumbnailRef.fullPath,
          videoPath: videoRef.fullPath,
        };

        const videosCollection = collection(firebase.firestore(), 'videos');
        await addDoc(videosCollection, videoData);

        console.log('Vídeo enviado com sucesso para a base de dados!');
        setDescription('');
        setVideoUri('');
        setThumbnailUri('');
      } catch (error) {
        console.log('Erro ao enviar o vídeo para a base de dados:', error);
      }
    } else {
      console.log('Por favor, preencha todos os campos antes de fazer o upload do vídeo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="grey"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Selecionar Vídeo" onPress={handleVideoSelection} />
        <Button title="Selecionar Thumbnail" onPress={handleThumbnailSelection} />
        <Button title="Enviar Vídeo" onPress={handleUploadPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cec365',
  },
  uploadContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default VideoUploadPage;
