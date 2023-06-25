import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const musicCover = require('../assets/logo.jpg');

export default function MusicPage({item}) {
  const navigation = useNavigation();

  function goHome() {
    navigation.navigate('Home');
  }

  console.log(item.url)

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up audio resources when unmounting the component
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
    }
  }, [sound]);

  const loadSound = async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        require('../assets/audio.mp3'),
        { shouldPlay: false },
        updatePlaybackStatus
      );
      setSound(audioSound);
    } catch (error) {
      console.log('Error loading audio:', error);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }
  };

  const togglePlayback = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        await loadSound();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Error toggling playback:', error);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goHome}>
          <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="black" />
        </TouchableOpacity>

        <Text style={styles.label}>Playing Now</Text>

        <TouchableOpacity onPress={toggleLike}>
          {isLiked ? (
            <Ionicons style={styles.iconHeart} name="heart" size={30} color="red" />
          ) : (
            <Ionicons style={styles.iconHeart} name="heart-outline" size={30} color="red" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.song}>
        <View style={styles.coverBack}>
          <Image source={musicCover} style={styles.cover} />
        </View>

        <Text style={styles.title}>At My Worst</Text>
        <Text style={styles.artist}>Pink Sweat$ ft. Kehlani</Text>

        <View style={styles.shareView}>
          <Ionicons name="download-outline" size={30} color="pink" style={styles.share} />
          <Ionicons name="share-social-outline" size={30} color="pink" style={styles.download} />
        </View>


        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayback}>
            {isPlaying ? (
              <Ionicons name="pause-circle" size={100} color="pink" />
            ) : (
              <Ionicons name="play-circle" size={100} color="pink" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 70,
  },
  iconBack: {
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'grey',
    paddingRight: 100,
    paddingLeft: 100,
    opacity: 0.5,
  },
  song: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 150,
  },
  shareView: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  share: {
    marginRight: 230,
  },
  coverBack: {
    width: 300,
    height: 300,
    marginBottom: 50,
    borderRadius: 200,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    fontSize: 20,
    marginBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 30,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: 300,
    marginBottom: 20,
  },
  sliderThumb: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: 'pink',
  },
  sliderTrack: {
    height: 5,
    borderRadius: 1,
    backgroundColor: 'grey',
  },
});
