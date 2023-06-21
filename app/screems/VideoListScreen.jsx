import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';

const VideoListScreen = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    subscribeToVideos();
  }, []);

  const subscribeToVideos = () => {
    const videosCollection = collection(FIREBASE_DB, 'videos');
    const videosQuery = query(videosCollection, orderBy('createdAt', 'desc'));

    onSnapshot(videosQuery, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    });
  };


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>Description: {item.description}
            </Text>
            <Text>id: {item.id}
            </Text>
            <Text>URL: {item.videoURL}</Text>
            <Video
              source={{ uri: item.videoURL }}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
              useNativeControls
            />
          </View>
        )}
      />
    </View>
  );
};

export default VideoListScreen;
