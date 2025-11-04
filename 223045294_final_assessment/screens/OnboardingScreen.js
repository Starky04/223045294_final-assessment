import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Browse Hotels',
    description: 'Discover amazing hotels worldwide with detailed information and reviews',
  },
  {
    id: 2,
    title: 'Book Rooms',
    description: 'Easy booking process with instant confirmation and secure payment',
  },
  {
    id: 3,
    title: 'Leave Reviews',
    description: 'Share your experiences and help other travelers make informed decisions',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('SignIn');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const currentScreen = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={currentScreen.image} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{currentScreen.title}</Text>
        <Text style={styles.description}>{currentScreen.description}</Text>
      </View>

      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex < onboardingData.length - 1 ? (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  image: {
    width: width * 0.8,
    height: 300,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
    width: 30,
  },
  buttonContainer: {
    width: width * 0.8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
