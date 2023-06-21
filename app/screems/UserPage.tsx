import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const UserPage = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'users'));
      const fetchedUsers = querySnapshot.docs.map((doc) => doc.data());
      setUsers(fetchedUsers);
    } catch (error) {
      console.log('Error fetching users: ', error);
    }
  };

  const addUser = async () => {
    try {
      const docRef = await addDoc(collection(FIREBASE_DB, 'users'), {
        name: name,
        id: id,
      });
      console.log('User added with ID: ', docRef.id);
      fetchUsers();
      setName('');
      setId('');
    } catch (error) {
      console.log('Error adding user: ', error);
    }
  };

  return (
    <View>
      <Text>Usuários:</Text>
      {users.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={(text) => setId(text)}
      />
      <Button title="Adicionar Usuário" onPress={addUser} />
    </View>
  );
};

export default UserPage;

