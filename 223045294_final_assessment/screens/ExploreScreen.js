import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { getRecommendedHotels } from '../services/apiService';

const sampleHotels = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    location: 'New York, USA',
    rating: 4.8,
    price: 250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  },
  {
    id: '2',
    name: 'Ocean View Resort',
    location: 'Miami, USA',
    rating: 4.6,
    price: 180,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Aspen, USA',
    rating: 4.9,
    price: 320,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  },
];

export default function ExploreScreen({ navigation }) {
  const [allHotels, setAllHotels] = useState(sampleHotels);
  const [filteredHotels, setFilteredHotels] = useState(sampleHotels);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecommendedHotels();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, sortBy, priceFilter, ratingFilter, allHotels]);

  const loadRecommendedHotels = async () => {
    setLoading(true);
    const result = await getRecommendedHotels();
    setLoading(false);

    if (result.success && result.hotels.length > 0) {
      const combined = [...result.hotels, ...sampleHotels];
      setAllHotels(combined);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...allHotels];

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(
      hotel => hotel.price >= priceFilter.min && hotel.price <= priceFilter.max
    );

    if (ratingFilter > 0) {
      filtered = filtered.filter(hotel => hotel.rating >= ratingFilter);
    }

    if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredHotels(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('none');
    setPriceFilter({ min: 0, max: 10000 });
    setRatingFilter(0);
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      {item.isRecommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>⭐</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.hotelName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && allHotels.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* COMPACT HEADER */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Explore</Text>
          <TouchableOpacity
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.filterToggleText}>⚙️ {showFilters ? '−' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* COLLAPSIBLE FILTERS */}
        {showFilters && (
          <ScrollView style={styles.filtersPanel} scrollEnabled={false}>
            {/* Sort Options */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.minButton, sortBy === 'price' && styles.minButtonActive]}
                onPress={() => setSortBy(sortBy === 'price' ? 'none' : 'price')}
              >
                <Text style={[styles.minButtonText, sortBy === 'price' && styles.minButtonTextActive]}>Price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.minButton, sortBy === 'rating' && styles.minButtonActive]}
                onPress={() => setSortBy(sortBy === 'rating' ? 'none' : 'rating')}
              >
                <Text style={[styles.minButtonText, sortBy === 'rating' && styles.minButtonTextActive]}>Rating</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.minButton, sortBy === 'name' && styles.minButtonActive]}
                onPress={() => setSortBy(sortBy === 'name' ? 'none' : 'name')}
              >
                <Text style={[styles.minButtonText, sortBy === 'name' && styles.minButtonTextActive]}>A-Z</Text>
              </TouchableOpacity>
            </View>

            {/* Price Filter - Horizontal */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.minButton, priceFilter.max === 200 && styles.minButtonActive]}
                onPress={() => setPriceFilter({ min: 0, max: 200 })}
              >
                <Text style={[styles.minButtonText, priceFilter.max === 200 && styles.minButtonTextActive]}>-$200</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.minButton, priceFilter.max === 500 && styles.minButtonActive]}
                onPress={() => setPriceFilter({ min: 200, max: 500 })}
              >
                <Text style={[styles.minButtonText, priceFilter.max === 500 && styles.minButtonTextActive]}>$200-500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.minButton, priceFilter.max === 10000 && styles.minButtonActive]}
                onPress={() => setPriceFilter({ min: 0, max: 10000 })}
              >
                <Text style={[styles.minButtonText, priceFilter.max === 10000 && styles.minButtonTextActive]}>All</Text>
              </TouchableOpacity>
            </View>

            {/* Rating Filter - Horizontal */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.minButton, ratingFilter === 0 && styles.minButtonActive]}
                onPress={() => setRatingFilter(0)}
              >
                <Text style={[styles.minButtonText, ratingFilter === 0 && styles.minButtonTextActive]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.minButton, ratingFilter === 4 && styles.minButtonActive]}
                onPress={() => setRatingFilter(4)}
              >
                <Text style={[styles.minButtonText, ratingFilter === 4 && styles.minButtonTextActive]}>4.0+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.minButton, ratingFilter === 4.5 && styles.minButtonActive]}
                onPress={() => setRatingFilter(4.5)}
              >
                <Text style={[styles.minButtonText, ratingFilter === 4.5 && styles.minButtonTextActive]}>4.5+</Text>
              </TouchableOpacity>
            </View>

            {/* Clear Button */}
            {(searchQuery || sortBy !== 'none' || ratingFilter > 0 || priceFilter.max !== 10000) && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {/* Results Count */}
        <Text style={styles.resultsCount}>
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* HOTELS LIST */}
      {filteredHotels.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hotels found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHotels}
          renderItem={renderHotelCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  filterToggleActive: {
    backgroundColor: '#007AFF',
  },
  filterToggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  clearSearchText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  filtersPanel: {
    marginBottom: 8,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    padding: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  minButton: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  minButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  minButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  minButtonTextActive: {
    color: '#fff',
  },
  clearButton: {
    paddingVertical: 6,
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  listContainer: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 193, 7, 0.95)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedText: {
    color: '#fff',
    fontSize: 16,
  },
  cardContent: {
    padding: 10,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  location: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 14,
    marginRight: 3,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
