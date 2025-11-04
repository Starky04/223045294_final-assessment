import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('ExploreScreen');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign In</Text>
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
      <Button title="Sign In" onPress={handleSignIn} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Forgot Password?" onPress={() => navigation.navigate('ForgotPassword')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}
