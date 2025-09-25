export const APP_CONFIG = {
  APP_NAME: 'EcomDemo',
  VERSION: '1.0.0',
  API_URL: 'https://api.ecomdemo.com', // Replace with actual API URL
};

export const STORAGE_KEYS = {
  USER_DATA: '@ecomdemo_user_data',
  CART_DATA: '@ecomdemo_cart_data',
  WISHLIST_DATA: '@ecomdemo_wishlist_data',
  THEME_MODE: '@ecomdemo_theme_mode',
};

export const CATEGORIES = [
  { id: 1, name: 'Electronics', icon: 'devices' },
  { id: 2, name: 'Fashion', icon: 'checkroom' },
  { id: 3, name: 'Home & Garden', icon: 'home' },
  { id: 4, name: 'Sports', icon: 'sports-soccer' },
  { id: 5, name: 'Beauty', icon: 'face' },
  { id: 6, name: 'Books', icon: 'menu-book' },
];

export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Best Rating', value: 'rating' },
];

export const FILTER_OPTIONS = {
  PRICE_RANGES: [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: null },
  ],
  RATINGS: [5, 4, 3, 2, 1],
};

export const SCREEN_NAMES = {
  // Bottom Tabs
  HOME: 'Home',
  CATEGORIES: 'Categories',
  CART: 'Cart',
  PROFILE: 'Profile',
  
  // Stack Screens
  PRODUCT_DETAIL: 'ProductDetail',
  PRODUCT_LIST: 'ProductList',
  SEARCH: 'Search',
  WISHLIST: 'Wishlist',
  LOGIN: 'Login',
  REGISTER: 'Register',
  CHECKOUT: 'Checkout',
  ORDER_HISTORY: 'OrderHistory',
  ORDER_DETAIL: 'OrderDetail',
  SETTINGS: 'Settings',
};

export const IMAGES = {
  PLACEHOLDER: 'https://via.placeholder.com/300x300/cccccc/999999?text=Product',
  BANNER_PLACEHOLDER: 'https://via.placeholder.com/350x200/ff6b6b/ffffff?text=Banner',
  AVATAR_PLACEHOLDER: 'https://via.placeholder.com/100x100/4ecdc4/ffffff?text=User',
};
