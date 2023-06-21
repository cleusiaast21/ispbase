import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';

const AudioListItem = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  const handlePlayAudio = async (url) => {
    try {
      if (soundObject === null) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
        setSoundObject(sound);
        setIsPlaying(true);
      } else {
        if (isPlaying) {
          await soundObject.pauseAsync();
        } else {
          await soundObject.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [soundObject]);

  return (
    <View style={{ marginBottom: 10 }}>
      <Text>{item.name}</Text>
      <Button
        title={isPlaying ? 'Pausar' : 'Reproduzir'}
        onPress={() => handlePlayAudio(item.url)}
      />
    </View>
  );
};

const AudioListScreen = () => {
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const audiosCollection = collection(FIREBASE_DB, 'audios');
        const unsubscribe = onSnapshot(audiosCollection, (snapshot) => {
          const audioList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setAudios(audioList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar os áudios:', error);
      }
    };

    fetchAudios();
  }, []);

  return (
    <View>
      <Text>Lista de Áudios:</Text>
      <FlatList
        data={audios}
        renderItem={({ item }) => <AudioListItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default AudioListScreen;
