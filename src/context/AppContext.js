import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  cart: [],
  wishlist: [],
  user: null,
  isLoggedIn: false,
  totalItems: 0,
  totalPrice: 0,
};

// Action types
export const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  LOAD_PERSISTED_DATA: 'LOAD_PERSISTED_DATA',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        cart: updatedCart,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
      };
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const updatedCart = state.cart.filter(item => item.id !== action.payload);
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        cart: updatedCart,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        cart: updatedCart,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case CART_ACTIONS.ADD_TO_WISHLIST: {
      const isAlreadyInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      if (isAlreadyInWishlist) return state;
      
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    }
    
    case CART_ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };
    
    case CART_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    
    case CART_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        cart: [],
        wishlist: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case CART_ACTIONS.LOAD_PERSISTED_DATA:
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Persist data when state changes
  useEffect(() => {
    persistData();
  }, [state.cart, state.wishlist, state.user]);

  const loadPersistedData = async () => {
    try {
      const [cartData, wishlistData, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CART_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.WISHLIST_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      const cart = cartData ? JSON.parse(cartData) : [];
      const wishlist = wishlistData ? JSON.parse(wishlistData) : [];
      const user = userData ? JSON.parse(userData) : null;

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      dispatch({
        type: CART_ACTIONS.LOAD_PERSISTED_DATA,
        payload: {
          cart,
          wishlist,
          user,
          isLoggedIn: !!user,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
        },
      });
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const persistData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(state.cart)),
        AsyncStorage.setItem(STORAGE_KEYS.WISHLIST_DATA, JSON.stringify(state.wishlist)),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user)),
      ]);
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  };

  // Action creators
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const addToWishlist = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_WISHLIST, payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
  };

  const login = (userData) => {
    dispatch({ type: CART_ACTIONS.SET_USER, payload: userData });
  };

  const logout = () => {
    dispatch({ type: CART_ACTIONS.LOGOUT });
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item.id === productId);
  };

  const getCartItemCount = (productId) => {
    const item = state.cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    login,
    logout,
    isInWishlist,
    getCartItemCount,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
