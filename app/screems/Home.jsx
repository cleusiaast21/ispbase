import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import profileImage from '../assets/logo.jpg';
import AudioListScreen from './AudioListScreen';
import RadioListScreen from './RadioListScreen.jsx';
import VideoListScreen from './VideoListScreen.jsx';
import ArtistListScreen from './ArtistListScreen.jsx';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import gradientLogo from '../assets/gradient.jpg';


export default function Home({ route }) {

    const { personId } = route.params;
    const [personName, setPersonName] = useState('');
    const [surname, setSurname] = useState('');

    const [profileImageUrl, setProfileImageUrl] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        const fetchPersonName = async () => {
            try {
                const docRef = doc(FIREBASE_DB, 'pessoa', personId);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setPersonName(data.name);
                    setSurname(data.surname);
                    setProfileImageUrl(data.imageUrl);
                }
            } catch (error) {
                console.log('Error fetching person name:', error);
            }
        };

        fetchPersonName();
    }, [personId]);

    function goToRadio() {
        const registeredPersonId = personId;
        navigation.navigate('Radio', { personId: registeredPersonId });
    }

<<<<<<< HEAD
    function search() {
        navigation.navigate('Search');
    }

=======
>>>>>>> e9a632213529df74301800dbdd38bd845733458f
    function goToVideos() {
        const registeredPersonId = personId;
        navigation.navigate('Videos', { personId: registeredPersonId });
    }

    function goToSongs() {
        const registeredPersonId = personId;
        navigation.navigate('Songs', { personId: registeredPersonId });
    }

    function goToProfilePage() {
        const registeredPersonId = personId;
        navigation.navigate('ProfilePage', { personId: registeredPersonId });
    }

    return (

        <>
<<<<<<< HEAD

            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.label}>Olá, {personName}!</Text>

                    <TouchableOpacity onPress={search}>
                        <Ionicons style={styles.iconSearch} name="search" size={40} color="pink" />
                    </TouchableOpacity>


                    <TouchableOpacity onPress={goToProfilePage}>
                        <Image
                            style={styles.profileImage}
                            source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/loading.jpg')}
                        />
                    </TouchableOpacity>

                </View>

                <View style={styles.content}>


                    <Text style={styles.sectionTitle}>Videos</Text>
                    <VideoListScreen />

                    <Text style={styles.sectionTitle}>Áudios</Text>
                    <AudioListScreen />

                    <Text style={styles.sectionTitle}>Artistas Recomendados</Text>
                    <ArtistListScreen />

                    <Text style={styles.sectionTitle}>Estações de Rádio</Text>
                    <RadioListScreen />

                </View>


            </ScrollView>


            <View style={styles.bottomNav}>
                <TouchableOpacity >
                    <Ionicons style={styles.homeIcon} name="home-outline" size={30} color="purple" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToVideos}>
                    <Ionicons name="film-outline" size={30} color="pink" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={styles.circleContainer} >
                        <Image source={profileImage} style={styles.circleImage} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToSongs}>
                    <Ionicons name="musical-notes-outline" size={30} color="pink" />
                </TouchableOpacity>

                <TouchableOpacity onPress={goToRadio}>
                    <Ionicons name="radio-outline" size={30} color="pink" />
                </TouchableOpacity>
            </View>
=======
            
                <ScrollView style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.label}>Olá, {personName}!</Text>

                        <Ionicons style={styles.iconSearch} name="search" size={40} color="pink" />


                        <TouchableOpacity onPress={goToProfilePage}>
                            <Image
                                style={styles.profileImage}
                                source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/loading.jpg')}
                            />
                        </TouchableOpacity>

                    </View>

                    <View style={styles.content}>


                        <Text style={styles.sectionTitle}>Videos</Text>
                        <VideoListScreen />

                        <Text style={styles.sectionTitle}>Áudios</Text>
                        <AudioListScreen />

                        <Text style={styles.sectionTitle}>Artistas Recomendados</Text>
                        <ArtistListScreen />

                        <Text style={styles.sectionTitle}>Estações de Rádio</Text>
                        <RadioListScreen />

                    </View>


                </ScrollView>


                <View style={styles.bottomNav}>
                    <TouchableOpacity >
                        <Ionicons style={styles.homeIcon} name="home-outline" size={30} color="purple" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToVideos}>
                        <Ionicons name="film-outline" size={30} color="pink" />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={styles.circleContainer} >
                            <Image source={profileImage} style={styles.circleImage} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToSongs}>
                        <Ionicons name="musical-notes-outline" size={30} color="pink" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToRadio}>
                        <Ionicons name="radio-outline" size={30} color="pink" />
                    </TouchableOpacity>
                </View>
>>>>>>> e9a632213529df74301800dbdd38bd845733458f


        </>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    backgroundImage: {
        resizeMode: 'cover', // Adjust the resizeMode as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        marginBottom: '20%',
    },
    header: {
        flexDirection: 'row',
        marginTop: '10%',
        justifyContent: 'space-between',
    },
    iconSearch: {
        marginLeft: '20%',
        marginTop: 15,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        marginRight: '3%',
        marginTop: '3%',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'grey',
        opacity: 0.5,
        paddingTop: 15,
        paddingLeft: 10,
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
        color: 'grey',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: 'pink',
        marginBottom: 0,
    },
    circleContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'pink',
        overflow: 'hidden',
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
});

