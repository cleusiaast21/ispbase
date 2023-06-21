import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';

const RadioListScreen = () => {
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const radiosCollection = collection(FIREBASE_DB, 'radios');
        const unsubscribe = onSnapshot(radiosCollection, (snapshot) => {
          const radioList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isPlaying: false,
            soundObject: null,
            isLoading: false
          }));
          setRadios(radioList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar as rádios:', error);
      }
    };

    fetchRadios();
  }, []);

  const handlePlayRadio = async (radio) => {
    try {
      if (radio.isLoading) {
        return; // Evita que o botão seja pressionado várias vezes enquanto o áudio está carregando
      }

      radio.isLoading = true;
      setRadios([...radios]);

      if (radio.isPlaying) {
        if (radio.soundObject) {
          await radio.soundObject.pauseAsync();
          radio.isPlaying = false;
        }
      } else {
        if (radio.soundObject) {
          await radio.soundObject.playAsync();
          radio.isPlaying = true;
        } else {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync({ uri: radio.frequency });
          await soundObject.playAsync();
          radio.soundObject = soundObject;
          radio.isPlaying = true;
        }
      }

      radio.isLoading = false;
      setRadios([...radios]);
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
      radio.isLoading = false;
      setRadios([...radios]);
    }
  };

  return (
    <View>
      <Text>Lista de Rádios:</Text>
      {radios.map((radio) => (
        <View key={radio.id}>
          <Text>Nome: {radio.name}</Text>
          <Text>Frequência: {radio.frequency}</Text>
          <Button
            title={radio.isLoading ? 'Carregando' : (radio.isPlaying ? 'Pausar' : 'Reproduzir')}
            disabled={radio.isLoading}
            onPress={() => handlePlayRadio(radio)}
          />
        </View>
      ))}
    </View>
  );
};

export default RadioListScreen;
