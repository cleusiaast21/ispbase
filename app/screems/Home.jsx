import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import profileImage from '../assets/logo.jpg';
import AudioListScreen from './AudioListScreen';
import RadioListScreen from './RadioListScreen.jsx';
import VideoListScreen from './VideoListScreen.jsx';
import BottomNav from '../components/BottomNav';

export default function Home({ route }) {

    const { personId } = route.params;
    const [personName, setPersonName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');


    useEffect(() => {
        const fetchPersonName = async () => {
            try {
                const docRef = doc(FIREBASE_DB, 'pessoa', personId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setPersonName(data.name);
                    setProfileImageUrl(data.imageUrl);
                }
            } catch (error) {
                console.log('Error fetching person name:', error);
            }
        };

        fetchPersonName();
    }, [personId]);


    return (

        <>
            <ScrollView style={{ flex: 1 }}>

                <View style={styles.header}>
                    <Text style={styles.label}>Olá, {personName}!</Text>
                    <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                </View>

                <Text style={styles.sectionTitle}>Videos</Text>
                <VideoListScreen />

                <Text style={styles.sectionTitle}>Áudios</Text>
                <AudioListScreen />

                <Text style={styles.sectionTitle}>Estações de Rádio</Text>
                <RadioListScreen />

            </ScrollView>

            <BottomNav></BottomNav>
        </>

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

