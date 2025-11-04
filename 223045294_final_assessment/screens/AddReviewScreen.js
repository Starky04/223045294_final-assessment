import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { addReview } from '../services/reviewService';

export default function AddReviewScreen({ route, navigation }) {
  const { hotel, onReviewAdded } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Comment Required', 'Please write at least 10 characters');
      return;
    }

    const reviewData = {
      rating,
      comment: comment.trim(),
    };

    setLoading(true);
    const result = await addReview(
      auth.currentUser.uid,
      auth.currentUser.displayName || 'Anonymous',
      hotel.id,
      reviewData
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Thank you for your review!', [
        {
          text: 'OK',
          onPress: () => {
            if (onReviewAdded) onReviewAdded();
            navigation.goBack();
          },
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to submit review');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review {hotel.name}</Text>

      <View style={styles.ratingSection}>
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={styles.starText}>
                {star <= rating ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Share your experience with other travelers..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{comment.length} characters</Text>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitReview}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  ratingSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  starButton: {
    padding: 5,
  },
  starText: {
    fontSize: 36,
  },
  commentSection: {
    marginBottom: 30,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
