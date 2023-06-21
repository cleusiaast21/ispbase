import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';
import { v4 as uuidv4 } from 'uuid';

const VideoUploadScreen = () => {
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    getPermission();
    subscribeToVideos();
  }, []);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need media library permissions to make this work!'
      );
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
        setVideoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking video:', error);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleThumbnailSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error selecting thumbnail:', error);
    }
  };

  const handleUploadPress = async () => {
    if (description && videoUri && thumbnailUri) {
      try {
        const thumbnailResponse = await fetch(thumbnailUri);
        const thumbnailBlob = await thumbnailResponse.blob();

        const videoResponse = await fetch(videoUri);
        const videoBlob = await videoResponse.blob();

        // Generate unique filenames for the thumbnail and video
        const thumbnailExtension = thumbnailUri.split('.').pop();
        const thumbnailFilename = `${uuidv4()}.${thumbnailExtension}`;

        const videoExtension = videoUri.split('.').pop();
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
          description,
          thumbnailPath: thumbnailStorageRef.fullPath,
          videoPath: videoStorageRef.fullPath,
          videoURL: videoURL, // Add the video URL to the document data
          createdAt: new Date(), // Add the current timestamp as the created date
        };

        const videosCollection = collection(FIREBASE_DB, 'videos');
        await addDoc(videosCollection, videoData);

        console.log('Video successfully uploaded to the database!');
        setDescription('');
        setVideoUri('');
        setThumbnailUri('');
      } catch (error) {
        console.log('Error uploading video to the database:', error);
      }
    } else {
      console.log('Please fill in all fields before uploading the video.');
    }
  };

  const subscribeToVideos = async () => {
    try {
      const videosCollection = collection(FIREBASE_DB, 'videos');
      const videosQuery = query(videosCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(videosQuery);
      const videosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    } catch (error) {
      console.log('Error fetching videos:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={pickVideo} style={{ marginBottom: 16 }}>
        <Text>Select Video</Text>
      </TouchableOpacity>
      {videoUri && (
        <View style={{ width: 300, height: 300 }}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </View>
      )}
      <TouchableOpacity onPress={handleTogglePlay} style={{ marginTop: 16 }}>
        <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleThumbnailSelection} style={{ marginBottom: 16 }}>
        <Text>Select Thumbnail</Text>
      </TouchableOpacity>
      {thumbnailUri && (
        <Text style={{ marginBottom: 16 }}>Selected Thumbnail: {thumbnailUri}</Text>
      )}
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        style={{ marginBottom: 16, paddingHorizontal: 10, height: 40, borderColor: 'gray', borderWidth: 1 }}
      />
      <TouchableOpacity onPress={handleUploadPress}>
        <Text>Upload Video</Text>
      </TouchableOpacity>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text>Description: {item.description}</Text>
            <Text>Video URL: {item.videoURL}</Text>
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

export default VideoUploadScreen;
