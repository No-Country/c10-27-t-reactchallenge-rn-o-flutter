import { View, TextInput, Text, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import LayerBackground from '../../generalComponents/layerBackground';

const EnterAmountStyles = StyleSheet.create({
  container: {
    minHeight: 200,
    paddingVertical: '8%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    position: 'relative',
    gap: 20,
    overflow: 'hidden',
  },
  container_Amount_And_Concept: {
    width: '50%',
    // position: 'relative',
    flexDirection: 'column',
    gap: 10,
  },
  enterAmount: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'ubuntu-medium',
    color: 'white',
  },
  inputConcept: {
    width: '100%',
    height: '100%',
    borderColor: '#334050',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    fontFamily: 'ubuntu-regular',
  },
  inputAmount: {
    width: '100%',
    height: '100%',
    borderColor: '#334050',
    borderWidth: 1,
    borderRadius: 10,
    paddingRight: '20%',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    fontFamily: 'ubuntu-regular',
  },
  currency: {
    position: 'absolute',
    fontSize: 16,
    paddingHorizontal: 14,
    fontFamily: 'ubuntu-regular',
  },
});

export default function EnterAmount({
  enterAmount,
  changeAmount,
  enterConcept,
  changeConcept,
  titleOfTheFirstInput,
}) {
  return (
    <LayerBackground
      params={{
        linearGradient: {
          style: { ...EnterAmountStyles.container },
          colors: ['#01B496', '#03B263'],
          start: [1, 1],
          end: [1, 0],
          locations: [0.1958, 0.9198],
        },
        mesh: {
          width: '160%',
          height: '160%',
          style: {
            position: 'absolute',
            opacity: 0.4,
          },
        },
      }}
    >
      <View style={EnterAmountStyles.container_Amount_And_Concept}>
        <Text style={EnterAmountStyles.title}>{titleOfTheFirstInput}</Text>
        <View style={EnterAmountStyles.enterAmount}>
          <TextInput
            value={enterConcept}
            onChangeText={changeConcept}
            style={EnterAmountStyles.inputConcept}
            maxLength={17}
          />
        </View>
      </View>

      <View style={EnterAmountStyles.container_Amount_And_Concept}>
        <Text style={EnterAmountStyles.title}>Ingresa el monto</Text>
        <View style={EnterAmountStyles.enterAmount}>
          <TextInput
            value={enterAmount}
            keyboardType="numeric"
            onChangeText={changeAmount}
            style={EnterAmountStyles.inputAmount}
            maxLength={17}
          />
          <Text style={EnterAmountStyles.currency}> USD </Text>
        </View>
      </View>
    </LayerBackground>
  );
}

EnterAmount.propTypes = {
  enterAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.any]).isRequired,
  changeAmount: PropTypes.func.isRequired,
  enterConcept: PropTypes.string.isRequired,
  changeConcept: PropTypes.func.isRequired,
  titleOfTheFirstInput: PropTypes.string.isRequired,
};
