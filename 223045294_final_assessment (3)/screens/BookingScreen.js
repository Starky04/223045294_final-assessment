import React, { useState } from 'react';
import { View, Text, Button, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';



export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params;

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [rooms, setRooms] = useState('1');
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const getStayNights = () => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const nights = Math.max(1, Math.floor((checkOut - checkIn) / msPerDay));
    return nights;
  };

  const calculateTotal = () => {
    return hotel.price * getStayNights() * parseInt(rooms);
  };

  const handleBooking = async () => {
  setError('');
  if (!auth.currentUser) {
    setError('You must be signed in to book.');
    return;
  }
  if (checkOut <= checkIn) {
    setError('Check-out must be after check-in.');
    return;
  }
  if (!rooms || parseInt(rooms) < 1) {
    setError('Rooms must be at least 1.');
    return;
  }

  try {
    await addDoc(
      collection(db, 'users', auth.currentUser.uid, 'bookings'),
      {
        hotelId: hotel.id,
        hotelName: hotel.name,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        rooms: parseInt(rooms),
        price: hotel.price,
        timestamp: new Date().toISOString(),
      }
    );
    setConfirmed(true);
  } catch (e) {
    setError('Error saving booking: ' + e.message);
  }
};


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{hotel.name} Booking</Text>
      <Text>Check-in Date:</Text>
      <Button title={checkIn.toDateString()} onPress={() => setShowCheckIn(true)} />
      {showCheckIn &&
        <DateTimePicker
          value={checkIn}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowCheckIn(Platform.OS === 'ios');
            if (selectedDate) setCheckIn(selectedDate);
          }}
        />
      }
      <Text>Check-out Date:</Text>
      <Button title={checkOut.toDateString()} onPress={() => setShowCheckOut(true)} />
      {showCheckOut &&
        <DateTimePicker
          value={checkOut}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowCheckOut(Platform.OS === 'ios');
            if (selectedDate) setCheckOut(selectedDate);
          }}
        />
      }
      <Text>Number of Rooms:</Text>
      <TextInput
        value={rooms}
        onChangeText={setRooms}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Text>Total Nights: {getStayNights()}</Text>
      <Text>Total Cost: R{calculateTotal()}</Text>
      <Button title="Confirm Booking" onPress={handleBooking} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {confirmed && <Text style={{ color: 'green' }}>Booking Confirmed!</Text>}
      <Button title="Back to Details" onPress={() => navigation.goBack()} />
    </View>
  );
}
