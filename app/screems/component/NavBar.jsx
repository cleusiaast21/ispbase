import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Text } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function NavBar() {

  const navigation = useNavigation();

  function inicio() {
    navigation.navigate("VideoPage")
  }

  function explorar() {
    navigation.navigate();
  }

  function inscricoes() {
    navigation.navigate();
  }

  function biblioteca() {
    navigation.navigate();
  }


  return (
    <View style={styles.navBar}>



      <View style={styles.container}>

        <View style={styles.navBar}>

          <TouchableOpacity>
            <View style={styles.navItem} onPress={inicio}>
              <Ionicons name='home-outline' size={25} color='black' />
              <Text style={styles.navItem}>Início</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.navItem} onPress={explorar}>
              <Ionicons name='radio-outline' size={25} color='black' />
              <Text style={styles.navItem}>Explorar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.navItem} onPress={inscricoes}>

              <Ionicons name='musical-notes-outline' size={25} color='black' />
              <Text style={styles.navItem}>Inscrições</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.navItem} onPress={biblioteca}>
              <Ionicons name='folder-outline' size={25} color='black' />
              <Text style={styles.navItem}>Biblioteca</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cec365',

  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  videoItem: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginBottom: 10,
    padding: 10
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    resizeMode: 'contain',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDescription: {
    marginTop: 5,
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: "#FFF7D1",
  },

});
