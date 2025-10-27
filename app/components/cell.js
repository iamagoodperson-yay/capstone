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
  widthFactor = 0.8,
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
                {content.transText || content.text}
              </Text>
              {content.subtitle && (
                <Text style={styles.subtitle}>{content.subtitle}</Text>
              )}
            </View>
          </View>
        );
      case 3:
        return (
          <Text
            style={[
              styles.text,
              content.type === 'next' ? styles.next_text : null,
            ]}
          >
            {content.transText || content.text}
          </Text>
        );
      case 4:
        return (
          <View style={styles.horizontalContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.text, { fontSize: 28 }]}>
                {content.transText || content.text}
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
        { height: screenHeight * height, width: screenWidth * widthFactor },
        content.type === 'selected'
          ? styles.selected_button
          : content.type === 'next'
          ? styles.next_button
          : null,
        content.bookmarked ? styles.bookmarked_button : null,
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
  bookmarked_button: {
    backgroundColor: '#FFE082',
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
