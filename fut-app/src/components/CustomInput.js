import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

// CustomInput supports a right component via `rightComponent` prop
export default function CustomInput({ style, rightComponent, placeholderTextColor = '#9B9B9B', ...props }) {
  return (
    <View style={[styles.wrapper, style && { marginBottom: 14 }] }>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
      {rightComponent ? (
        <View style={styles.right}>{rightComponent}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    color: '#222',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  right: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});