import React, { useState } from 'react';
import { View, Text, Image, Button, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';

const profileImages = [
  require('../assets/images/profile-1.png'),
  require('../assets/images/profile-2.png'),
  require('../assets/images/profile-3.png'),
  require('../assets/images/profile-4.png'),
];

const initialReviews = [
  { id: '1', name: 'Sam', rating: 5, text: 'Amazing stay!', img: profileImages[0] },
  { id: '2', name: 'Lebo', rating: 4, text: 'Clean rooms, friendly staff.', img: profileImages[1] },
  { id: '3', name: 'Amira', rating: 5, text: 'Would book again.', img: profileImages[2] },
  { id: '4', name: 'John', rating: 3, text: 'Decent for the price.', img: profileImages[3] },
];

export default function HotelDetailsScreen({ route, navigation }) {
  const { hotel } = route.params;

  const [reviews, setReviews] = useState(initialReviews);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const canAddReview = !submitted;

  const submitReview = () => {
    if (newReview.trim().length === 0) return;
    setReviews([{ 
      id: Math.random().toString(), 
      name: 'You', 
      rating: newRating, 
      text: newReview, 
      img: profileImages[Math.floor(Math.random() * profileImages.length)] 
    }, ...reviews]);
    setSubmitted(true);
    setModalVisible(false);
    setNewReview('');
    setNewRating(5);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image source={hotel.img} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 15 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{hotel.name}</Text>
      <Text>{hotel.location} | Stars: {hotel.rating}</Text>
      <Text>R{hotel.price}/night</Text>
      <Button title="Book Now" onPress={() => navigation.navigate('BookingScreen', { hotel })} />

      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Reviews</Text>
        <FlatList
          data={reviews}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8, backgroundColor: '#ececec', padding: 10, borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={item.img} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
              <View>
                <Text style={{ fontWeight: 'bold' }}>{item.name} {'★'.repeat(item.rating)}</Text>
                <Text>{item.text}</Text>
              </View>
            </View>
          )}
        />

        {canAddReview ? (
          <Button title="Add Review" onPress={() => setModalVisible(true)} />
        ) : (
          <Text style={{ color: 'green', marginTop: 10 }}>Thank you for your review!</Text>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add Review</Text>
              <TextInput
                placeholder="Your review"
                multiline
                value={newReview}
                onChangeText={setNewReview}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
              />
              <Text>Rating:</Text>
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                {[1,2,3,4,5].map(r => (
                  <TouchableOpacity key={r} onPress={() => setNewRating(r)}>
                    <Text style={{ fontSize: 26, color: r <= newRating ? '#e2b007' : '#ccc' }}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button title="Submit" onPress={submitReview} />
              <Button title="Cancel" color="#b00" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>

      <Button title="Back to Explore" onPress={() => navigation.goBack()} />
    </View>
  );
}
