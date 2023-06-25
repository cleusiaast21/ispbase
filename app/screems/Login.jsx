import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ImageBackground, Alert } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.jpg';
import backgroundImg from '../assets/image2.jpg';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  function handleRegister() {
    navigation.navigate('Register');
  };

  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);

  };

  const handleLogin = async () => {

    if (validateEmail(email)) {

      try {
        const q = query(
          collection(FIREBASE_DB, 'pessoa'),
          where('email', '==', email),
          where('password', '==', password)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const registeredPersonId = querySnapshot.docs[0].id;
          console.log('Entered with ID: ', registeredPersonId);
          navigation.navigate('Home', { personId: registeredPersonId });
        } else {
          Alert.alert('Falha na internet','Verifique a sua conexão a internet');
        }
      } catch (error) {
        console.log('Error:', error);
        Alert.alert('Erro:', error);

      }
    } else {
      alert('Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC (Ex: 20230001@isptec.co.ao)');

    }
  };


  return (

      <View style={styles.container}>

      <Image source={logo} style={styles.logo} />

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>Não tem conta? Registar</Text>
        </TouchableOpacity>

      </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 250,
    height: 155,
    marginBottom: 50,
  },
  inputView: {
    width: 300,
    backgroundColor: 'pink',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  loginButton: {
    width: 100,
    backgroundColor: 'pink',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: 'pink',
    fontSize: 16,
    opacity: 0.7,
  },
});
