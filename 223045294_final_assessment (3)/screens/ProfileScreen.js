import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs } from 'firebase/firestore';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) navigation.replace('SignIn');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      if (user) {
        const bookingsCol = collection(db, 'users', user.uid, 'bookings');
        const q = query(bookingsCol);
        const snapshot = await getDocs(q);
        setBookings(snapshot.docs.map(doc => doc.data()));
      }
    })();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('SignIn');
    } catch (e) {
      Alert.alert('Logout Error', e.message);
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>
      <Text style={{ fontSize: 18 }}>Email: {user.email}</Text>
      <Button title="Edit Profile" onPress={() => Alert.alert('Edit Profile', 'Feature not yet implemented.')} />
      <Button title="Log Out" color="red" onPress={handleLogout} />

      <Text style={{ fontSize: 20, marginTop: 20 }}>Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#ececec', marginVertical: 8, padding: 10, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Hotel: {item.hotelName}</Text>
            <Text>
              {item.checkIn ? `Check-in: ${new Date(item.checkIn).toDateString()}` : ''}
              {'\n'}
              {item.checkOut ? `Check-out: ${new Date(item.checkOut).toDateString()}` : ''}
            </Text>
            <Text>Rooms: {item.rooms} | Price: R{item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>You have no bookings.</Text>}
      />
    </View>
  );
}
