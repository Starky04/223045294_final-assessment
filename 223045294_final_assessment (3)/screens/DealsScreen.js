import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';

export default function DealsScreen() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products') 
      .then(res => res.json())
      .then(data => {
        setHotels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Deals</Text>
      <FlatList
        data={hotels}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 18, backgroundColor: '#ececec', borderRadius: 8 }}>
            <Image source={{ uri: item.image }} style={{ width: '100%', height: 130, borderRadius: 8 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 8 }}>{item.title}</Text>
            <Text style={{ marginLeft: 8 }}>{item.description}</Text>
            <Text style={{ margin: 8 }}>R{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}
