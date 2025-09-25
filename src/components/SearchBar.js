import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const SearchBar = ({
  placeholder = "Search products...",
  onSearch,
  onFocus,
  onBlur,
  style,
  value,
  onChangeText,
}) => {
  const [searchText, setSearchText] = useState(value || '');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  const handleTextChange = (text) => {
    setSearchText(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={searchText}
          onChangeText={handleTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.margin / 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    paddingHorizontal: SIZES.padding,
    height: SIZES.inputHeight,
    ...SHADOWS.light,
  },
  searchIcon: {
    marginRight: SIZES.margin / 2,
  },
  input: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;
