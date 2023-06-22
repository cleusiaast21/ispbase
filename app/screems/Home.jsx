import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';
import profileImage from '../assets/logo.jpg';
import AudioListScreen from './AudioListScreen';
import { ScrollView } from 'react-native-gesture-handler';




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

    const renderHorizontalItem = ({ item }) => (
        <View style={styles.horizontalItem}>
            <Video
                source={{ uri: item.url }}
                style={{ width: 300, height: 200, borderRadius: 10 }}
                resizeMode="cover"
                horizontal
                useNativeControls
            />
            <Text style={styles.horizontalTitle}>{item.description}</Text>
        </View>
    );




    return (
        <ScrollView style={{ flex: 1 }}>

            <View style={styles.header}>
                <Text style={styles.label}>Olá, {personName}!</Text>

                <Image source={profileImage} style={styles.profileImage} />

            </View>

            <Text style={styles.sectionTitle}>Videos</Text>

            <FlatList style={styles.scrollContainer}
                data={videos}
                keyExtractor={(item) => item.id}
                renderItem={(renderHorizontalItem)}
                horizontal
                showsHorizontalScrollIndicator={true}

            />

            <Text style={styles.sectionTitle}>Áudios</Text>
            <AudioListScreen/>



        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        marginTop: 70,
    },
    iconSearch: {
        marginRight: 5,
        marginTop: 15,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        marginRight: 10,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'grey',
        paddingRight: 100,
        opacity: 0.5,
    },
    scrollContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 30,
    },
    horizontalItem: {
        marginLeft: 10,
    },
    rectangularCover: {
        marginTop: 10,
        width: 150,
        height: 150,
        borderRadius: 0,
    },
    circularCover: {
        marginTop: 10,
        width: 100,
        height: 100,
        borderRadius: 75,
    },
    horizontalTitle: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    horizontalArtist: {
        fontSize: 14,
        color: 'gray',
    },
});

