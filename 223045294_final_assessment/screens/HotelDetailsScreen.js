import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { getHotelReviews } from '../services/reviewService';

export default function HotelDetailsScreen({ route, navigation }) {
  const { hotel } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const result = await getHotelReviews(hotel.id);
    setLoading(false);

    if (result.success) {
      setReviews(result.reviews);
    }
  };

  const handleBookNow = () => {
    if (!auth.currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book a hotel',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
        ]
      );
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const handleAddReview = () => {
    if (!auth.currentUser) {
      Alert.alert('Sign In Required', 'Please sign in to add a review');
      return;
    }
    navigation.navigate('AddReview', { 
      hotel, 
      onReviewAdded: loadReviews 
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: hotel.image }} style={styles.headerImage} />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.location}>{hotel.location}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{hotel.rating} / 5</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price per night</Text>
          <Text style={styles.price}>${hotel.price}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {hotel.description || `Experience luxury and comfort at ${hotel.name}. Our hotel offers world-class amenities, exceptional service, and the perfect location for your stay.`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            <Text style={styles.amenity}>✓ Free WiFi</Text>
            <Text style={styles.amenity}>✓ Swimming Pool</Text>
            <Text style={styles.amenity}>✓ Gym</Text>
            <Text style={styles.amenity}>✓ Restaurant</Text>
            <Text style={styles.amenity}>✓ Room Service</Text>
            <Text style={styles.amenity}>✓ Parking</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
            <TouchableOpacity onPress={handleAddReview}>
              <Text style={styles.addReviewButton}>Add Review</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator color="#007AFF" />
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.userName}</Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  hotelName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 18,
    marginRight: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenity: {
    fontSize: 15,
    color: '#666',
    width: '50%',
    marginBottom: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addReviewButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noReviews: {
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
