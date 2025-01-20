import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

// Local image import
const placeholderImage = require('../images/soldier.png'); // Adjust the path as needed

const topics = [
  { id: 1, name: 'General Knowledge' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'Safety' },
  { id: 4, name: 'Aircraft' },
];

const StartQuiz = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Image placeholder at the top (fixed) */}
      <View style={styles.imageContainer}>
        <Image
          source={placeholderImage} // Using local image
          style={styles.image}
        />
      </View>

      <Text style={styles.title}>Select a Topic</Text>

      {/* ScrollView for selecting topics */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.windowRow}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.windowButton}
              onPress={() => navigation.navigate('Quiz', { topicId: topic.id })}
            >
              <Text style={styles.windowNumber}>{topic.id}</Text>
              <Text style={styles.windowText}>{topic.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F4F6D', // Deep blue to reflect Air Force theme
    alignItems: 'center',
    paddingTop: 40,
  },
  imageContainer: {
    width: '40%',
    height: 200,
    marginTop:50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#FFD700', // Gold border to match Air Force color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for emphasis
    marginBottom: 40,
    fontFamily: 'Arial', // Military-style font
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 20, // Space for scrolling
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  windowButton: {
    backgroundColor: '#3A5F77', // Navy blue background
    width: 140,
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border to give it a strong, military theme
    shadowColor: '#000', // Adding shadow for depth
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  windowNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
  },
  windowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Arial',
  },
});

export default StartQuiz;
