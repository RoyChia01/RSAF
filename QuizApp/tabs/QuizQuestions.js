import React, { useState, useEffect, useCallback,useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert,Dimensions,Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { fetchQuestions, getUserInfo, postQuizResults } from './apiHandler';
import { useUser } from './userInfo';  // Import the hook

// Get the device screen width and height
const { width, height } = Dimensions.get('window');
const getFontSize = (size) => {
  const baseScale = 375;  // base screen width
  return size * (width / baseScale);
};

// Adjust font sizes and layout based on screen size
const scale = width / 375; // 375 is the base width for standard screen size (like iPhone 6)
// Custom Hook for Fetching Quiz Questions with Error Handling
const useQuizQuestions = (topicId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetchQuestions(topicId);
        console.log("Fetched Questions:", response);
        if (!response || !response.questionsData || response.questionsData.length === 0) {
          throw new Error('No questions found.');
        }
        setQuestions(response.questionsData);  // Set the correct questionsData
      } catch (err) {
        setError(err.message || 'An error occurred while fetching questions.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [topicId]);

  return { questions, loading, error };
};


// Main Component for Quiz Questions
const QuizQuestions = ({ navigation, route }) => {
  const { id } = route.params; // Destructure 'id' from route.params
  console.log("Received ID:", id); // Log to check if it comes through correctly
  const { questions, loading, error } = useQuizQuestions(id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerLocked, setAnswerLocked] = useState(false);

  // Handle TabBar Visibility
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    }, [navigation])
  );

  // Handle Answer Selection
  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion]?.answer) setScore(prev => prev + 1);
    setSelectedAnswer(answer);
    setAnswerLocked(true);
  };

  // Move to the Next Question
  const moveNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerLocked(false);
    } else {
      setShowScore(true);
    }
  };

  // Restart Quiz and Go Back
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setAnswerLocked(false);
    setSelectedAnswer(null);
    navigation.goBack();
  };

  // Auto-advance after Answer Selection
  useEffect(() => {
    if (answerLocked) {
      const timeout = setTimeout(moveNextQuestion, 1000);
      return () => clearTimeout(timeout);
    }
  }, [answerLocked, currentQuestion]);

  // Loading, Error Handling, and displaying messages
  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      {!showScore && <ProgressBar currentQuestion={currentQuestion} totalQuestions={questions.length} />}

      {showScore ? (
        <Score score={score} totalQuestions={questions.length} onRestart={handleRestart} topicId={id} />
      ) : (
        <QuestionCard
          question={questions[currentQuestion]}
          selectedAnswer={selectedAnswer}
          answerLocked={answerLocked}
          onAnswer={handleAnswer}
        />
      )}
    </View>
  );
};

// Progress Bar for Tracking Quiz Progress
const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  const numOfDashes = 15;
  const dashes = Array.from({ length: numOfDashes }, (_, i) => {
    const opacity = i / numOfDashes <= progress / 100 ? 1 : 0.3;
    return <View key={i} style={[styles.dash, { left: `${(i / numOfDashes) * 100}%`, opacity }]} />;
  });

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBar}>
        {dashes}
        <Icon name="plane" size={60} style={[styles.planeIcon, { left: `${progress}%` }]} />
      </View>
    </View>
  );
};

// Display Question Card with Options
const QuestionCard = ({ question, selectedAnswer, answerLocked, onAnswer }) => {

  const [shuffledOptions, setShuffledOptions] = useState([]);
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  useEffect(() => {
    if (question?.options) {
      setShuffledOptions(shuffleArray(question.options));
    }
  }, [question]);
  
  if (!question) return <Text style={styles.loadingText}>Loading question...</Text>;
  return (
    <>
      <Text style={[styles.questionText, { fontSize: 24 }]}>{question?.question || 'Loading question...'}</Text>

      <View style={styles.optionsContainer}>
        {shuffledOptions.length > 0 ? (
          shuffledOptions.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              selectedAnswer={selectedAnswer}
              isCorrect={option === question.answer}
              onAnswer={onAnswer}
              answerLocked={answerLocked}
            />
          ))
        ) : (
          <Text style={styles.loadingText}>No options available</Text>
        )}
      </View>
    </>
  );
};

// Option Button Component with Answer Feedback
const OptionButton = ({ option, selectedAnswer, isCorrect, onAnswer, answerLocked }) => (
  <TouchableOpacity
    onPress={() => onAnswer(option)}
    style={[
      styles.optionButton,
      selectedAnswer === option && (isCorrect ? styles.correctOption : styles.incorrectOption)
    ]}
    disabled={answerLocked}
  >
    <Text
      style={[
        styles.optionsBox,
        selectedAnswer === option && { marginRight: 35, fontSize: 14 }
      ]}
    >
      {option}
    </Text>
    {selectedAnswer === option && (
      <Icon
        name={isCorrect ? 'check-circle' : 'times-circle'}
        size={30}
        color={isCorrect ? '#90EE90' : '#FF6F6F'}
        style={styles.icon}
      />
    )}
  </TouchableOpacity>
);

// Score Component with Ranking and Restart Option
const Score = ({ score, totalQuestions, onRestart, topicId }) => {
  const { userEmail } = useUser();
  const [userDocumentID, setUserDocumentID] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo(userEmail);
        console.log('User Info:', userInfo.id);
        if (userInfo) setUserDocumentID(userInfo.id);
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch user info. Please try again later.');
      }
    };

    fetchUserInfo();
  }, [userEmail]);

  useEffect(() => {
    if (userDocumentID && topicId !== undefined && score !== undefined) {
      try {
        console.log('Submitting quiz results...', userDocumentID, topicId, score);
        postQuizResults(userDocumentID, topicId, score);
      } catch (error) {
        Alert.alert('Error', 'Unable to submit your results. Please try again later.');
      }
    }
  }, [userDocumentID, topicId, score]); // Dependency array ensures postQuizResults is called only when userDocumentID is set

  if (!userDocumentID) return <Text style={styles.loadingText}>Loading user info...</Text>;

  return (
    <View style={styles.scoreContainer}>
      <Image source={require('../images/soldier.png')} style={styles.avatar} />
      <Text style={styles.scoreText}>Score: {score} / {totalQuestions}</Text>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          try {
            onRestart(score);
          } catch (error) {
            Alert.alert('Error', 'Unable to restart. Please try again later.');
          }
        }}
      >
        <Text style={styles.resetButtonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the Components
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#2F4F6D', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: height * 0.1, // 10% of screen height
    width: '100%' 
  },
  questionText: { 
    fontSize: getFontSize(36), // Scale font size dynamically
    textAlign: 'center', 
    color: 'white', 
    fontWeight: 'bold', 
    fontFamily: 'Roboto', 
    marginBottom: 20
  },
  optionsContainer: { 
    marginVertical: 20, 
    width: '100%', 
    alignItems: 'center' 
  },
  optionButton: { 
    backgroundColor: '#5b7c99', 
    borderRadius: 20, 
    padding: 10, 
    marginVertical: 10, 
    width: '80%',  // Adjust width relative to screen size
    maxWidth: 300, 
    alignItems: 'center', 
    position: 'relative' 
  },
  optionsBox: { 
    color: 'white', 
    padding: 5, 
    marginVertical: 10, 
    textAlign: 'center', 
    fontSize: getFontSize(18),  // Scale the font size dynamically
    borderRadius: 20, 
    width: '100%' 
  },
  correctOption: { 
    borderWidth: 3, 
    borderColor: '#90EE90', 
    backgroundColor: '#5b7c99', 
    borderRadius: 20, 
    padding: 5 
  },
  incorrectOption: { 
    borderWidth: 3, 
    borderColor: '#FF6F6F', 
    backgroundColor: '#5b7c99', 
    borderRadius: 20, 
    padding: 5 
  },
  icon: { 
    position: 'absolute', 
    bottom: 10, 
    right: 10 
  },
  loadingText: { 
    color: 'white', 
    fontSize: getFontSize(20), // Scale font size dynamically
    fontWeight: 'bold' 
  },
  errorText: { 
    color: 'red', 
    fontSize: getFontSize(20), 
    fontWeight: 'bold' 
  },
  resetButton: { 
    backgroundColor: '#e0a100', 
    padding: 15, 
    borderRadius: 10, 
    width: '90%',  // Make button width relative
    alignItems: 'center', 
    marginVertical: '5%' 
  },
  resetButtonText: { 
    color: '#fff', 
    fontSize: getFontSize(20),  // Scale button text dynamically
    fontWeight: 'bold' 
  },
  scoreContainer: { 
    backgroundColor: '#2F4F6D', 
    padding: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    width: '90%' 
  },
  rankText: { 
    color: '#FFD700', 
    fontSize: getFontSize(24),  // Scale rank text dynamically
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  avatar: { 
    width: getFontSize(120), 
    height: getFontSize(120), 
    borderRadius: getFontSize(60), 
    backgroundColor: '#ccc', 
    marginBottom: 20 
  },
  scoreText: { 
    fontSize: getFontSize(28), 
    color: 'white', 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  progressBarContainer: { 
    position: 'absolute', 
    top: 30, 
    width: '90%', 
    height: getFontSize(60), 
    backgroundColor: '#071f35', 
    borderRadius: 10, 
    overflow: 'hidden' 
  },
  progressBar: { 
    position: 'relative', 
    width: '100%', 
    height: '100%' 
  },
  dash: { 
    position: 'absolute', 
    top: getFontSize(28), 
    width: 10, 
    height: 2, 
    backgroundColor: '#ffffff' 
  },
  planeIcon: { 
    position: 'absolute', 
    zIndex: 1 , 
    color: '#FFD700' 
  },
});

export default QuizQuestions;
