import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,Pressable } from 'react-native';
import { getUserInfo } from './apiHandler';
import Icon, { Icons } from '../components/Icons';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

// Function to get the current date in the format you need (e.g., "16 Jan 2025")
const getCurrentDate = () => {
  const today = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return today.toLocaleDateString('en-GB', options); // Format the date as "16 Jan 2025"
};

const BoardingPass = ({ route }) => {
  const { userEmail } = route.params || {}; // Ensure params exist
  const navigation = useNavigation(); // Get navigation object
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pointsBalance, setPointsBalance] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [topRowData, setTopRowData] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  console.log(userEmail);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo(userEmail);
        setPassengerName(userInfo.name); // Corrected from passengerName to name
        setEmail(userInfo.email);
        setPassword(userInfo.password);
        setPointsBalance(userInfo.pointBalance); // Corrected from pointsBalance to pointBalance
        setRowData([
          userInfo.topicMap.currentTopic,
          userInfo.topicMap.lastTopic
        ]);
        setTopRowData([
          { title: 'School', subText: userInfo.school },
          { title: 'Rank', subText: userInfo.rank }, // Fixed case issue
          { title: '', subText: getCurrentDate() },
        ]);
        setImageUrl({ uri: userInfo.avatarBlob }); // Fixed key name from avatarBLOB to avatarBlob
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
  
    fetchData();
  }, [userEmail]);
  
  return (
    <View style={styles.container}>
      <View style={styles.backbBoardingPassContainer}>
        <Image
          source={require('../images/rsaf.png')} // Replace with your actual path
          style={styles.logoImage}
        />
        <View style={styles.userBoardingPass}>
          {/* First Row */}
          <View style={styles.shortRow}>
            <View style={styles.horizontalRow}>
              {topRowData.map((item, index) => (
                <View
                  style={[styles.rowItem, index === 1 && styles.rankCenter]}
                  key={index}
                >
                  {item.title && (
                    <Text style={styles.boldTextSmall}>{item.title}</Text>
                  )}
                  {item.subText && (
                    <Text
                      style={[
                        styles.subText,
                        item.title === '' ? styles.boldTextSmall : null,
                      ]}
                    >
                      {item.subText}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.equalRow}>
            <View style={styles.splitRow}>
              {/* Left Section */}
              <View style={styles.dataSection}>
                {rowData.slice(0, 1).map((data, index) => (
                  <View key={index}>
                    <Text style={styles.boldText}>{data.topicId}</Text>
                    <Text style={styles.topicNameText}>{data.topic}</Text>
                  </View>
                ))}
              </View>

              {/* Center Section */}
              <View style={styles.planeLogoSection}>
                <Text style={styles.planeLogo}>✈️</Text>
              </View>

              {/* Right Section */}
              <View style={styles.dataSection}>
                {rowData.slice(1, 2).map((data, index) => (
                  <View key={index}>
                    <Text style={styles.boldText}>{data.topicId}</Text>
                    <Text style={styles.topicNameText}>{data.topic}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Third Row */}
          <View style={styles.equalRow}>
            <View style={styles.splitRow}>
              {/* Left Section */}
              <View style={[styles.dataSection, styles.leftSection]}>
                {rowData.slice(0, 1).map((data, index) => (
                  <View key={index}>
                    <Text style={styles.boldTextLabel}>Passenger Name</Text>
                    <Text style={styles.boldText}>{passengerName}</Text>
                  </View>
                ))}
              </View>

              {/* Image Placeholder Section */}
              <View style={[styles.dataSection, styles.imagePlaceholder]}>
                {imageUrl ? (
                  <Image
                    source={imageUrl} // Use the local image URL
                    style={styles.placeholderImage}
                  />
                ) : (
                  <Text>Loading image...</Text>  // Show loading text if the image is not yet available
                )}
              </View>
            </View>
          </View>

          {/* Fourth Row */}
          <View style={styles.equalRow}>
          <View style={styles.horizontalRow}>
            {/* Left Side (Email, Password, and Reset Icon) */}
            <View style={styles.leftSide}>
              <Text style={styles.boldTextLabel}>Email</Text>
              <Text style={[styles.subText, styles.emailValue]}>{email}</Text>

              <Text style={styles.boldTextLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <Text style={styles.subText}>{password}</Text>
                <Pressable
                  onPress={() => {
                    navigation.navigate('resetPassword');
                  }}
                  style={[styles.iconButton]}>
                  <Icons.MaterialCommunityIcons name="lock-reset" size={30} color="#e0a100" />
                </Pressable>
              </View>
            </View>

            {/* Right Side (Points Balance) */}
            <View style={styles.rightSide}>
              <Text style={styles.boldTextLabel}>Points Balance</Text>
              <Text style={styles.subText}>{pointsBalance}</Text>
            </View>
          </View>
        </View>


          {/* Fifth Row */}
          <View style={styles.fifthRow}>
            <Image
              source={require('../images/barcode.png')} // Replace with your actual path
              style={styles.barcodeImage}
            />
            <View style={styles.semiCircleLeft}></View>
            <View style={styles.semiCircleRight}></View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24496b',
  },
  backbBoardingPassContainer: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#446d92',
    width: '90%',
    margin: 100,
    borderRadius: 50,
  },
  userBoardingPass: {
    backgroundColor: '#fff',
    width: '100%',
    height: '85%',
    borderRadius: 50,
    top: 10,
  },
  shortRow: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equalRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#ccc',
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  dataSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planeLogoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowItem: {
    alignItems: 'center',
    flex: 1,
  },
  rankCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boldText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  boldTextSmall: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  topicNameText: {
    fontSize: 20,
    color: '#666',
  },
  planeLogo: {
    fontSize: 60,
  },
  boldTextDisplayContainer: {
    width: '90%',
    padding: 5,
    alignItems: 'flex-start',
  },
  boldTextLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A1A2A4',
  },
  subText: {
    fontSize: 18,
    color: '#444',
  },
  fifthRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#ccc',
    marginTop: 20,
    position: 'relative',
  },
  semiCircleLeft: {
    position: 'absolute',
    top: -30,
    left: -35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#24496b',
  },
  semiCircleRight: {
    position: 'absolute',
    top: -30,
    right: -35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#24496b',
  },
  barcodeImage: {
    width: 300,
    height: 200,
  },
  logoImage: {
    width: 120,
    height: 100,
  },
  emailValue: {
    marginBottom: 15,
  },
  leftSection: {
    flex: 0.55, // 55% width for the left section
  },
  imagePlaceholder: {
    flex: 0.45, // 45% width for the image placeholder
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    width: 100, // Adjust width of the placeholder image
    height: 100, // Adjust height of the placeholder image
    resizeMode: 'contain',
    borderRadius: 10, // Optional: Add rounded corners to the placeholder image
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensure text and icon are in a row
    gap: 10, // Add space between text and icon
  },
  
  iconButton: {
    paddingLeft: 20, // Small spacing for better alignment
  },
  
});

export default BoardingPass;
