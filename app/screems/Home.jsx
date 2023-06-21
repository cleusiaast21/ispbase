import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';

export default function Home({ route }) {

  const { personId } = route.params;

  const [videos, setVideos] = useState([]);
  const [personName, setPersonName] = useState('');

  useEffect(() => {
    const fetchPersonName = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPersonName(data.name);
        }
      } catch (error) {
        console.log('Error fetching person name:', error);
      }
    };

    fetchPersonName();
  }, [personId]);

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

<Text>HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII</Text>
      <Text>Person ID: {personId}</Text>
      <Text>Person Name: {personName}</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>Description: {item.description}</Text>
            <Text>id: {item.id}</Text>
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

