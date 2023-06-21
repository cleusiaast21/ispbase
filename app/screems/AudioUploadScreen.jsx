import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';




const AudioUploadScreen = () => {
  const [selectedAudio, setSelectedAudio] = useState(null);

  const uploadAudio = async () => {
    try {
      if (selectedAudio) {
        const storageRef = ref(FIREBASE_STORAGE, `audios/${selectedAudio.name}`);
        const response = await fetch(selectedAudio.uri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
  
        const audioData = {
          name: selectedAudio.name,
          timestamp: new Date().toISOString(),
          url: downloadURL
        };
  
        const audiosCollection = collection(FIREBASE_DB, 'audios');
        await addDoc(audiosCollection, audioData);
  
        console.log('Áudio enviado com sucesso!');
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

  return (
    <View>
      <Button title="Escolher Áudio" onPress={pickAudio} />
      {selectedAudio && (
        <View>
          <Text>Áudio selecionado: {selectedAudio.name}</Text>
          <Button title="Enviar Áudio" onPress={uploadAudio} />
        </View>
      )}
    </View>
  );
};

export default AudioUploadScreen;
