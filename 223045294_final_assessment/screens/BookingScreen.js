import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../config/firebaseConfig';
import { createBooking } from '../services/bookingService';

export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000));
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateTotalCost = () => {
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    return days * hotel.price * numberOfRooms;
  };

  const getDaysDifference = () => {
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  };

  const handleConfirmBooking = async () => {
    if (checkOutDate <= checkInDate) {
      Alert.alert('Invalid Dates', 'Check-out date must be after check-in date');
      return;
    }

    if (numberOfRooms < 1) {
      Alert.alert('Invalid Rooms', 'Please select at least one room');
      return;
    }

    const bookingData = {
      hotel: hotel.name,
      hotelId: hotel.id,
      checkIn: checkInDate.toDateString(),
      checkOut: checkOutDate.toDateString(),
      rooms: numberOfRooms,
      totalCost: calculateTotalCost(),
    };

    Alert.alert(
      'Confirm Booking',
      `Hotel: ${hotel.name}\nCheck-in: ${checkInDate.toDateString()}\nCheck-out: ${checkOutDate.toDateString()}\nRooms: ${numberOfRooms}\nTotal: $${calculateTotalCost()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            const result = await createBooking(auth.currentUser.uid, bookingData);
            setLoading(false);

            if (result.success) {
              Alert.alert(
                'Booking Confirmed!',
                'Your booking has been successfully confirmed.',
                [{ text: 'OK', onPress: () => navigation.navigate('ProfileTab') }]
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to create booking');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>

        <View style={styles.dateSection}>
          <Text style={styles.label}>Check-in Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckInPicker(true)}
          >
            <Text style={styles.dateText}>{checkInDate.toDateString()}</Text>
          </TouchableOpacity>
          {showCheckInPicker && (
            <DateTimePicker
              value={checkInDate}
              mode="date"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowCheckInPicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setCheckInDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.label}>Check-out Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckOutPicker(true)}
          >
            <Text style={styles.dateText}>{checkOutDate.toDateString()}</Text>
          </TouchableOpacity>
          {showCheckOutPicker && (
            <DateTimePicker
              value={checkOutDate}
              mode="date"
              minimumDate={checkInDate}
              onChange={(event, selectedDate) => {
                setShowCheckOutPicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setCheckOutDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.roomsSection}>
          <Text style={styles.label}>Number of Rooms</Text>
          <View style={styles.roomsControl}>
            <TouchableOpacity
              style={styles.roomButton}
              onPress={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
            >
              <Text style={styles.roomButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.roomsText}>{numberOfRooms}</Text>
            <TouchableOpacity
              style={styles.roomButton}
              onPress={() => setNumberOfRooms(numberOfRooms + 1)}
            >
              <Text style={styles.roomButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price per night:</Text>
          <Text style={styles.summaryValue}>${hotel.price}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of nights:</Text>
          <Text style={styles.summaryValue}>{getDaysDifference()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Number of rooms:</Text>
          <Text style={styles.summaryValue}>{numberOfRooms}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${calculateTotalCost()}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.confirmButton} 
        onPress={handleConfirmBooking}
        disabled={loading}
      >
        <Text style={styles.confirmButtonText}>
          {loading ? 'Processing...' : 'Confirm Booking'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hotelInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dateSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fafafa',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  roomsSection: {
    marginTop: 10,
  },
  roomsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  roomButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  roomsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 30,
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
