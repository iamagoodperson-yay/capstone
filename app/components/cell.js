import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

const Cell = ({
  content,
  buttonlayout,
  onPress,
  onLongPress,
  height = 0.115,
}) => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const renderContent = () => {
    switch (buttonlayout) {
      case 1:
        return <Image source={content.image} style={styles.image} />;
      case 2:
        return (
          <View style={styles.horizontalContainer}>
            {content.image && (
              <Image
                source={content.image}
                style={[styles.image, { width: '20%' }]}
              />
            )}
            <View style={styles.textContainer}>
              <Text style={[styles.text, { fontSize: 28 }]}>
                {content.text}
              </Text>
              {content.subtitle && (
                <Text style={styles.subtitle}>{content.subtitle}</Text>
              )}
            </View>
          </View>
        );
      case 3:
        return (
          <Text style={[styles.text, styles.next_text]}>{content.text}</Text>
        ); // <-- 3: Next button style
      case 4:
        return (
          <View style={styles.horizontalContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.text, { fontSize: 28 }]}>
                {content.text}
              </Text>
            </View>
            {content.image && (
              <Image
                source={content.image}
                style={[styles.image, { width: '20%' }]}
              />
            )}
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.normal_button,
        { height: screenHeight * height, width: screenWidth * 0.8 },
        content.type === 'selected'
          ? styles.selected_button
          : content.type === 'next'
          ? styles.next_button
          : null,
        content.bookmarked ? { backgroundColor: '#6cc1ddff' } : null, // <-- 4: light blue tint for bookmarked
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  normal_button: {
    fontSize: 24,
    backgroundColor: '#d9d9d9',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: 'transparent',
    borderWidth: 5,
    borderRadius: 15,
  },
  selected_button: {
    borderColor: '#4CAF50',
  },
  next_button: {
    backgroundColor: '#4CAF50', // <-- 3: Next button green
  },
  next_text: {
    color: '#FFFFFF', // <-- 3: text color for Next
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    marginHorizontal: 10,
    width: '25%',
    aspectRatio: 1,
  },
  text: {
    fontSize: 32,
  },
  subtitle: {
    // <-- 4: smaller text for full path
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Cell;
