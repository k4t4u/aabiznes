import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type InfoBoxProps = {
  text: string;
};

const InfoBox: React.FC<InfoBoxProps> = ({ text }) => {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#EAF2FF',
    borderRadius: 16,
    padding: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1E3A5F',
    fontWeight: '500',
  },
});

export default InfoBox;
