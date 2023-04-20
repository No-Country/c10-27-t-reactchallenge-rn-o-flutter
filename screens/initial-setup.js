import { useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import Header from '../components/initial-setup/Header';
import CurrencyDropdown from '../components/initial-setup/CurrencyDropdown';
import BalanceInput from '../components/initial-setup/BalanceInput';
import LayerBackground from '../components/generalComponents/layerBackground';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // gap: 20,
    paddingTop: Constants.statusBarHeight,
    position: 'relative',
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'center',
  },
  inputsContainer: {
    flex: 1,
    paddingTop: '15%',
    marginTop: 20,
    paddingHorizontal: '15%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6FD',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
  },
  inputWithTextContainer: {
    height: 70,
    width: '100%',
    marginBottom: 45,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center', // center the text horizontally
    alignSelf: 'center', // center the text vertically
  },
  text: {
    fontSize: 18,
    fontFamily: 'ubuntu-regular',
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  button: {
    width: 248,
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#FA6C17',
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: 'ubuntu-bold',
  },
});

const currencyOptions = ['USD', 'ARS', 'EUR', 'GBP', 'BRL', 'CLP', 'COP', 'MXN', 'PEN'];

export default function SettingUpScreen({ setInitialSettingUp }) {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedBalance, setSelectedBalance] = useState('');
  const [selectedPin, setSelectedPin] = useState('');
  const [confirmPin, setConfirmedPin] = useState('');
  const [step, setStep] = useState(1);

  const handleCurrencySelect = (value) => {
    setSelectedCurrency(value);
  };

  const handleBalanceSelect = (value) => {
    setSelectedBalance(value);
  };

  const storeData = async () => {
    try {
      if (!selectedCurrency || !selectedBalance) return;
      const userCurrency = { currency: selectedCurrency, amount: Number(selectedBalance) };
      await AsyncStorage.setItem('userCurrency', JSON.stringify(userCurrency));
      setStep(2);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  const storePin = async () => {
    try {
      if (!selectedPin || !confirmPin || selectedPin !== confirmPin) return;
      await AsyncStorage.setItem('userPin', JSON.stringify(selectedPin));
      setInitialSettingUp('success');
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  const handleSelectedPin = (val) => {
    setSelectedPin(val);
    if (confirmPin) setConfirmedPin('');
  };

  const headerText = step === 1 ? '¡Organicemos tus finanzas juntos!' : '¡Protejamos tus datos!';

  const stepOneInputs = (
    <>
      <View>
        <View style={styles.inputWithTextContainer}>
          <Text style={styles.text}>Indica el tipo de divisa</Text>
          <CurrencyDropdown
            options={currencyOptions}
            defaultValue={selectedCurrency}
            onSelect={handleCurrencySelect}
          />
        </View>

        <View style={styles.inputWithTextContainer}>
          {selectedCurrency && (
            <>
              <Text style={styles.text}>Introduce el balance de la cuenta principal</Text>
              <BalanceInput
                value={selectedBalance}
                onChange={handleBalanceSelect}
                selectedCurrency={selectedCurrency}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.inputWithTextContainer}>
        {selectedCurrency && selectedBalance && (
          <Button style={styles.button} mode="contained" onPress={storeData}>
            Continuar
          </Button>
        )}
      </View>
    </>
  );

  const stepTwoInputs = (
    <>
      <View>
        <View style={styles.inputWithTextContainer}>
          <Text style={styles.text}>Ingresa un PIN</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              backgroundColor: 'white',
              width: 232,
              fontSize: 16,
              textAlign: 'center',
              height: 50,
              fontFamily: 'ubuntu-regular',
            }}
            secureTextEntry
            keyboardType="numeric"
            value={selectedPin}
            onChangeText={(value) =>
              value.toString().length < 7 && handleSelectedPin(value.toString())
            }
            placeholder="Ej: 123456"
          />
        </View>

        <View style={styles.inputWithTextContainer}>
          {selectedPin && selectedPin.length === 6 && (
            <>
              <Text style={styles.text}>Confirmar PIN</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  backgroundColor: 'white',
                  width: 232,
                  fontSize: 16,
                  textAlign: 'center',
                  height: 50,
                }}
                secureTextEntry
                keyboardType="numeric"
                value={confirmPin}
                onChangeText={(value) =>
                  value.toString().length < 7 && setConfirmedPin(value.toString())
                }
                placeholder="Ej: 123456"
              />
            </>
          )}
        </View>
      </View>

      <View style={styles.inputWithTextContainer}>
        {selectedPin && confirmPin && selectedPin === confirmPin && (
          <Button style={styles.button} mode="contained" onPress={storePin}>
            Guardar
          </Button>
        )}
      </View>
    </>
  );

  return (
    <LayerBackground
      params={{
        linearGradient: {
          style: styles.container,
          colors: ['#03B263', '#01B496'],
          start: [1, 0],
          end: [1, 1],
          locations: [0.1, 0.5],
        },
        mesh: {
          vector: 0,
          width: '100%',
          height: '100%',
          style: {
            position: 'absolute',
            top: '-30%',
            opacity: 0.4,
          },
        },
        layer: {
          vector: step === 1 ? 1 : 2,
          style: {
            position: 'absolute',
            top: '-15%',
            opacity: 0.3,
          },
        },
      }}
    >
      <Header headerText={headerText} />
      <View style={styles.inputsContainer}>{step === 1 ? stepOneInputs : stepTwoInputs}</View>
    </LayerBackground>
  );
}

SettingUpScreen.propTypes = {
  setInitialSettingUp: PropTypes.func.isRequired,
};
