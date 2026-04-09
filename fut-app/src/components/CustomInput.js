import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

// CustomInput supports a right component via `rightComponent` prop
export default function CustomInput({ style, rightComponent, ...props }) {
  return (
    <View style={[styles.wrapper, style && { marginBottom: 14 }] }>
      <TextInput style={[styles.input, style]} {...props} />
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
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
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