import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Image, FlatList } from 'react-native';
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
  const [thumbnailURL, setThumbnailURL] = useState('');
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
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
        setVideoUri(result.uri);
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
        setThumbnailUri(result.uri);
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

        // Get the download URL of the thumbnail
        const thumbnailURL = await getDownloadURL(thumbnailStorageRef);

        // Upload the video to "videos" folder in Firebase Storage
        const videoStorageRef = ref(FIREBASE_STORAGE, `videos/${videoFilename}`);
        const videoSnapshot = await uploadBytes(videoStorageRef, videoBlob);

        // Get the download URL of the video
        const url = await getDownloadURL(videoSnapshot.ref);

        // Save the paths, URLs, and description to Firestore
        const videoData = {
          description,
          thumbnailPath: thumbnailStorageRef.fullPath,
          thumbnailURL,
          videoPath: videoStorageRef.fullPath,
          url,
          createdAt: new Date(),
        };

        const videosCollection = collection(FIREBASE_DB, 'videos');
        await addDoc(videosCollection, videoData);

        console.log('Video successfully uploaded to the database!');
        setDescription('');
        setVideoUri('');
        setThumbnailUri('');
        setThumbnailURL('');
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

  const handleThumbnailPress = (url) => {
    setSelectedVideo(url);
  };

  const VideoItem = ({ item }) => {
    const handlePress = () => {
      handleThumbnailPress(item.videoURL);
    };

    return (
      <View style={{ marginBottom: 16 }}>
        {selectedVideo === item.videoURL ? (
          <Video
            source={{ uri: item.videoURL }}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
            useNativeControls
          />
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <Image source={{ uri: item.thumbnailURL }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity>
        )}
        <Text>Description: {item.description}</Text>
        <Text>Video URL: {item.url}</Text>
        <Text>Thumbnail URL: {item.thumbnailURL}</Text>
      </View>
    );
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


      <TouchableOpacity onPress={handleUploadPress}>
        <Text>Upload Video</Text>
      </TouchableOpacity>

      {thumbnailUri && (
        <View style={{ marginBottom: 16 }}>
          <Text>Selected Thumbnail:</Text>
          <Image source={{ uri: thumbnailUri }} style={{ width: 200, height: 200 }} />
        </View>
      )}
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        style={{
          marginBottom: 16,
          paddingHorizontal: 10,
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
      />
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoItem item={item} />}
      />
    </View>
  );
};

export default VideoUploadScreen;