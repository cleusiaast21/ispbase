import React, { useState } from 'react';
import { Button, Text, View, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AudioUploadScreen = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const uploadAudio = async () => {
    try {
      if (selectedAudio && selectedThumbnail) {
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
          name: selectedAudio.name,
          timestamp: new Date().toISOString(),
          url,
          thumbnailURL
        };

        console.log('Enviando áudio!');


        const audiosCollection = collection(FIREBASE_DB, 'audios');
        await addDoc(audiosCollection, audioData);

        console.log('Áudio enviado com sucesso!');
        alert('Áudio enviado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao enviar o áudio:', error);
    }
  };

  const pickAudio = async () => {
    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      setSelectedAudio({ uri, name });
    } catch (error) {
      console.error('Erro ao escolher o áudio:', error);
    }
  };

  const pickThumbnail = async () => {
    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      setSelectedThumbnail({ uri, name });
    } catch (error) {
      console.error('Erro ao escolher a thumbnail:', error);
    }
  };

  return (
    <View>
      <Button title="Escolher Áudio" onPress={pickAudio} />
      {selectedAudio && (
        <View>
          <Text>Áudio selecionado: {selectedAudio.name}</Text>
          <Button title="Escolher Thumbnail" onPress={pickThumbnail} />
          {selectedThumbnail && (
            <View>
              <Text>Thumbnail selecionada: {selectedThumbnail.name}</Text>
              <Button title="Enviar Áudio" onPress={uploadAudio} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AudioUploadScreen;