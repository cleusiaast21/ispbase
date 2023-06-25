import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { collection, getDocs, query, getFirestore } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import { Audio } from 'expo-av';

export default function AudioListScreen() {
  const [audios, setAudios] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const querySnapshot = await getDocs(audiosCollection);
      const audiosData = querySnapshot.docs.map((doc) => doc.data());
      setAudios(audiosData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  const handlePlayAudio = async (url) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  const AudioItem = ({ item }) => {
    const handlePress = () => {
      handlePlayAudio(item.url);
    };

    const handleThumbnailPress = () => {
      if (sound && sound.isPlaying) {
        sound.pauseAsync();
      }
    };

    const handlePlayPause = async () => {
      if (sound) {
        if (sound.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      }
    };
/*
    const renderAudioItem = ({ item }) => (
      <View style={styles.horizontalItem}>
        <Video
          source={{ uri: item.url }}
          style={{ width: 150, height: 150, borderRadius: '10px' }}
          resizeMode="cover"
          horizontal
          useNativeControls
        />


      </View>
    );*/

    return (
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={handlePress}>
          <Image source={{ uri: item.thumbnailURL }} style={styles.item} />
        </TouchableOpacity>
        <Text style={styles.horizontalTitle}>{item.title}</Text>
        <Text style={styles.horizontalArtist}>{item.artistName}</Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => <AudioItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 150,
    height: 150,
    padding: 10,
    margin: 10,
  },
  horizontalTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'pink',

  },
  horizontalArtist: {
    fontSize: 14,
    color: 'pink',
  },

});