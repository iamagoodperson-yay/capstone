import { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const Dropdown = ({ values, base, changebase, width = 0.875 }) => {
  const screenWidth = Dimensions.get('window').width;
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = item => {
    changebase(item);
    setIsOpen(false);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={styles.dropdownItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item.toString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View>

      <TouchableOpacity
        style={{
            backgroundColor: '#d9d9d9',
            color: '#000000',
            width: screenWidth * width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
        }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={{ color: '#000000', fontSize: 24 }}>
          {base ? base.toString() : 'Select an option'}
        </Text>
        <Text style={{ color: '#000000', fontSize: 18 }}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {isOpen && values && (
        <View style={[styles.dropdownList, { width: screenWidth * width }]}>
          <FlatList
            data={values}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderTopWidth: 0,
    position: 'absolute',
    top: 50,
    zIndex: 1000,
    elevation: 5,
    maxHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#000000',
  },
});

export default Dropdown;
