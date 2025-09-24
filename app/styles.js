import { StyleSheet } from 'react-native';

const universalStyles = StyleSheet.create({
  container: {
    borderColor: '#CAC3C3',
    borderWidth: 2,
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
    padding: '5%',
    paddingRight: '6%',
    paddingLeft: '6%',
    marginTop: 10,
  },
  inputSty: {
    backgroundColor: 'rgb(244,243,245)',
    height: 40,
    borderRadius: 5,
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  baseText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 400,
  },
  headerText: {
    color: 'black',
    fontWeight: 600,
    fontSize: 16,
  },
  descText: {
    color: 'rgb(140,143,153)',
    fontSize: 16,
  },
  dualInput: {
    flexDirection: 'row',
  },
});

export default universalStyles;
