import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Login1 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigation = useNavigation();

  function  handleRegister(){
    // Handle navigation to the registration page
    navigation.navigate('Register');
    console.log('Navigating to the registration page...');
  };


  useEffect(() => {
    const imageRef = ref(FIREBASE_STORAGE, '/imagens/teste.jpg');
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log('Error getting image URL from Firebase Storage:', error);
      });
  }, []);

  const handleLogin = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'pessoa'),
        where('username', '==', username),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        console.log('Entered');
        navigation.navigate('VideoListScreen');
      } else {
        console.log('The user does not exist');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

 
  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.logo} />
      ) : (
        <Text>Loading image...</Text>
      )}
      <View style={styles.card}>
        <Text style={styles.title}>ISPMIDIA</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor={'grey'}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={'grey'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button1} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink} onPress={handleRegister}>
              Register now
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'linear-gradient(23.1% 11.89% at 18.02% 8.11%, #FFFFFF 0.19%, rgba(255, 237, 86, 0.70) 100%)',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 50,
  },
  card: {
    width: '80%',
    backgroundColor: '#FFF7D1',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    marginBottom: 50,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: -30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF7D1',
    borderRadius: 0,
  },
  button1: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF7D1',
    borderRadius: 0,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  registerText: {
    marginTop: -5,
  },
  registerLink: {
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default Login1;
