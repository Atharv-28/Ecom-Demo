const BASE_URL = 'https://fakestoreapi.com';

// API service class
class ApiService {
  async get(endpoint, retries = 2) {
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`Attempting API call: ${BASE_URL}${endpoint} (attempt ${attempt + 1})`);
        
        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 100000); // 10 second timeout

        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`API call successful: ${BASE_URL}${endpoint}`);
        return { data, error: null };
      } catch (error) {
        lastError = error;
        console.error(`API Error for ${endpoint} (attempt ${attempt + 1}):`, error);
        
        // If it's the last attempt or a non-network error, don't retry
        if (attempt === retries || (error.name !== 'TypeError' && error.name !== 'AbortError')) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    return { data: null, error: lastError.message };
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
      isFeatured: Math.random() > 0.4, // 60% chance of being featured
      isNew: Math.random() > 0.6, // 40% chance of being new
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
