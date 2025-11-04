import React from 'react';
import { StyleSheet } from 'react-native'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

const hotels = [
  {
    id: '1',
    name: 'Sun Hotel',
    location: 'Cape Town',
    rating: 4,
    price: 1200,
    img: require('../assets/images/sunhotel.png'),
  },
  {
    id: '2',
    name: 'Coast Resort',
    location: 'Umhlanga',
    rating: 5,
    price: 1600,
    img: require('../assets/images/coastresort.png'),
  },
  {
    id: '3',
    name: 'Mountain Inn',
    location: 'Drakensberg',
    rating: 3,
    price: 950,
    img: require('../assets/images/mountaininn.png'),
  },
  {
    id: '4',
    name: 'WaterSide Hotel',
    location: 'Cape Town',
    rating: 4,
    price: 1100,
    img: require('../assets/images/waterside.png'),
  },
  {
    id: '5',
    name: 'Beach Hotel',
    location: 'Durban',
    rating: 3,
    price: 1000,
    img: require('../assets/images/beachhotel.png'),
  },
];

export default function ExploreScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Hotels</Text>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HotelDetailsScreen', { hotel: item })}
            activeOpacity={0.85}
          >
            <Image source={item.img} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.location}>{item.location} • <Text style={styles.rating}>★{item.rating}</Text></Text>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>R{item.price}/night</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fcff",
    padding: 15,
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: "#3282B8",
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    alignItems: 'center',
    padding: 11,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 10,
    marginRight: 18,
    backgroundColor: "#d6e6f2",
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: "#22223b",
    marginBottom: 3,
  },
  location: {
    fontSize: 15,
    color: "#70708a",
    marginBottom: 5,
  },
  rating: {
    color: "#fecf06",
    fontWeight: "bold",
  },
  priceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: "#3282B8",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  priceText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 14,
  }
});