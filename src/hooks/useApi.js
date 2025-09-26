import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { limit, category, autoFetch = true } = options;

  const fetchProducts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let result;
      if (category) {
        result = await apiService.getProductsByCategory(category);
      } else if (limit) {
        result = await apiService.getLimitedProducts(limit);
      } else {
        result = await apiService.getProducts();
      }

      if (result.error) {
        setError(result.error);
        setProducts([]);
      } else {
        const transformedProducts = apiService.transformProducts(result.data);
        setProducts(transformedProducts);
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    fetchProducts(true);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [category, limit]);

  return {
    products,
    loading,
    error,
    refreshing,
    fetchProducts,
    refresh,
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiService.getProduct(productId);

      if (result.error) {
        setError(result.error);
        setProduct(null);
      } else {
        const transformedProduct = apiService.transformProduct(result.data);
        setProduct(transformedProduct);
      }
    } catch (err) {
      setError(err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiService.getCategories();

      if (result.error) {
        setError(result.error);
        setCategories([]);
      } else {
        const formattedCategories = result.data.map((cat, index) => ({
          id: index + 1,
          name: apiService.formatCategory(cat),
          apiName: cat,
          icon: getCategoryIcon(cat),
        }));
        setCategories(formattedCategories);
      }
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const iconMap = {
    "men's clothing": 'shirt-outline',
    "women's clothing": 'shirt-outline',
    "jewelery": 'diamond-outline',
    "electronics": 'phone-portrait-outline'
  };
  
  return iconMap[category] || 'apps-outline';
};
