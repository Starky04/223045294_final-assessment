import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('ExploreScreen');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Already have an account? Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}
