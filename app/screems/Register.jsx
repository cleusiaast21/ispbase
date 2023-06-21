import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      // Verifica se já existe um usuário com o mesmo nome de usuário e senha na base de dados
      const querySnapshot = await getDocs(
        query(
          collection(FIREBASE_DB, 'pessoa'),
          where('username', '==', username),
          where('password', '==', password)
        )
      );
  
      if (!querySnapshot.empty) {
        console.log('Usuário já existe na base de dados');
        return;
      }
  
      // Cria um novo documento na coleção 'pessoa' com os dados fornecidos
      const docRef = await addDoc(collection(FIREBASE_DB, 'pessoa'), {
        username,
        password,
        email,
      });
      console.log('Nova pessoa criada com ID:', docRef.id);
      navigation.navigate('VideoListScreen');
    } catch (error) {
      console.log('Erro ao criar uma nova pessoa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={'grey'}
          value={email}
          onChangeText={setEmail}
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFF7D1',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
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
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Register;
