import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const createBooking = async (userId, bookingData) => {
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      userId,
      hotelId: bookingData.hotelId,
      hotelName: bookingData.hotel,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      rooms: bookingData.rooms,
      totalCost: bookingData.totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    });
    
    return { success: true, bookingId: bookingRef.id };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message };
  }
};

export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, bookings };
  } catch (error) {
    console.error('Error getting bookings:', error);
    return { success: false, error: error.message, bookings: [] };
  }
};
