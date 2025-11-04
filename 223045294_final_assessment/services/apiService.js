export const getRecommendedHotels = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=5');
    const data = await response.json();
    
    const hotels = data.map((product) => ({
      id: `api-${product.id}`,
      name: product.title,
      location: product.category.toUpperCase(),
      rating: product.rating.rate,
      price: Math.round(product.price * 10),
      image: product.image,
      description: product.description,
      isRecommended: true
    }));
    
    return { success: true, hotels };
  } catch (error) {
    console.error('Error fetching recommended hotels:', error);
    return { success: false, error: error.message, hotels: [] };
  }
};
