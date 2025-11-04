import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const addReview = async (userId, userName, hotelId, reviewData) => {
  try {
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      userId,
      userName,
      hotelId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    });
    
    return { success: true, reviewId: reviewRef.id };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error: error.message };
  }
};

export const getHotelReviews = async (hotelId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('hotelId', '==', hotelId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, reviews };
  } catch (error) {
    console.error('Error getting reviews:', error);
    return { success: false, error: error.message, reviews: [] };
  }
};
