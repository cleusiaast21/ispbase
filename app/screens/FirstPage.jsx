import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.jpg';
import backgroundImg from '../assets/model2.jpg';

export default function FirstPage() {

    const navigation = useNavigation();


    return (
        <ImageBackground source={backgroundImg} style={styles.backgroundImage}>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },

});

