import React, { useState } from "react";
import { View, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const musicLogo = require('../assets/logo.jpg');
const musicCover = require('../assets/logo.jpg');

export default function BottomNav() {

    const navigation = useNavigation();

    function goHome() {
        navigation.navigate("Home");
    }

    return (
        <>
            <View >

                <View style={styles.bottomNav}>
                    <TouchableOpacity onPress={goHome}>
                        <Ionicons name="home-outline" size={30} color="pink" />
                    </TouchableOpacity>

                    <TouchableOpacity >
                        <Ionicons name="radio-outline" size={30} color="pink" />
                    </TouchableOpacity>

                    <TouchableOpacity >
                        <View style={styles.circleContainer} >
                            <Image source={musicCover} style={styles.circleImage} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity >
                        <Ionicons name="film-outline" size={30} color="pink" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="cloud-upload-outline" size={30} color="pink" />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )

}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: 'grey',
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
