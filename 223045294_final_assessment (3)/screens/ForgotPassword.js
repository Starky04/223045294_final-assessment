import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    setMsg('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg('Password reset email sent!');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Forgot Password?</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Reset Password" onPress={handleReset} />
      {msg ? <Text style={{ color: "green" }}>{msg}</Text> : null}
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Back to Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}
