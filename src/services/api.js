const BASE_URL = 'https://fakestoreapi.com';

// API service class
class ApiService {
  async get(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return { data: null, error: error.message };
    }
  }

  // Fetch all products
  async getProducts() {
    return this.get('/products');
  }

  // Fetch products by category
  async getProductsByCategory(category) {
    return this.get(`/products/category/${category}`);
  }

  // Fetch single product
  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  // Fetch all categories
  async getCategories() {
    return this.get('/products/categories');
  }

  // Fetch products with limit
  async getLimitedProducts(limit = 10) {
    return this.get(`/products?limit=${limit}`);
  }

  // Transform API product data to our app format
  transformProduct(apiProduct) {
    return {
      id: apiProduct.id,
      name: apiProduct.title,
      description: apiProduct.description,
      price: parseFloat(apiProduct.price),
      rating: apiProduct.rating?.rate || 4.0,
      reviews: apiProduct.rating?.count || 0,
      category: this.formatCategory(apiProduct.category),
      image: apiProduct.image,
      images: [apiProduct.image], // API only provides one image
      inStock: true,
      stockCount: Math.floor(Math.random() * 50) + 10, // Random stock since API doesn't provide
      isFeatured: Math.random() > 0.7, // Random featured status
      isNew: Math.random() > 0.8, // Random new status
    };
  }

  // Format category names to match our app
  formatCategory(category) {
    const categoryMap = {
      "men's clothing": "Fashion",
      "women's clothing": "Fashion",
      "jewelery": "Jewelry",
      "electronics": "Electronics"
    };
    
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  // Transform products array
  transformProducts(apiProducts) {
    return apiProducts.map(product => this.transformProduct(product));
  }
}

export const apiService = new ApiService();
export default apiService;
