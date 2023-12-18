import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

const FilterComponent = ({ filters, activeFilter, onSelectFilter }) => {
  return (
    <View style={styles.container}>
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.filterButton,
            activeFilter === filter ? styles.activeFilterButton : null,
          ]}
          onPress={() => onSelectFilter(filter)}
        >
          <Text style={styles.filterText}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#2196f3',
  },
  filterText: {
    color: 'black',
    fontSize: 16,
  },
});

export default FilterComponent;