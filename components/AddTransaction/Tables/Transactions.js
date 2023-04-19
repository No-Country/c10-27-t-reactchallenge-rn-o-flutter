import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EnterAmount from '../components/EnterAmount';
import Data from '../components/Data';
import CategoriesList from '../components/CategoriesList';
import Annotations from '../components/Annotations';
import Alert from '../components/Alert';

const { height } = Dimensions.get('window');

// /////////// Styles
const TransactionsStyles = StyleSheet.create({
  container_view: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  container: {
    minHeight: height,
    flexDirection: 'column',
    gap: 20,
    paddingBottom: 30,
    backgroundColor: '#F6F6FD',
  },
});

const SubmitStyle = StyleSheet.create({
  button: {
    marginHorizontal: '15%',
    // backgroundColor: '#FEEBE0',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// //////////////// component Body /////////////////////

export default function Transactions({ navigation, params }) {
  const { listOfAccounts, listOfCategories, information } = params;

  const { name, titleOfTheFirstInput } = information;

  const isExpense = name === 'Expenses';

  const [enterAmount, setEnterAmount] = useState('');
  const [enterConcept, setEnterConcept] = useState('');

  const [date, setDate] = useState(new Date());

  const [selectedCategory, setSelectedCategory] = useState({});

  const [selectAccount, setSelectedAccount] = useState('Principal');

  const [annotations, setAnnotations] = useState('');

  const [showAlertAddTransaction, setShowAlertAddTransaction] = useState(false);

  const isAllFull = enterAmount && enterConcept && selectAccount && selectedCategory.id;

  // Amount Functions
  const changeAmount = (value) => {
    setEnterAmount(value.replace(',', '.'));
  };

  const changeConcept = (value) => {
    setEnterConcept(value);
  };

  // Account Features
  const changeAccount = (value) => {
    setSelectedAccount(value);
  };

  // Date features
  const changeDate = (param) => {
    setDate(param);
  };

  // Categories Features
  const changeSelectedCategorie = async (value) => {
    if (selectedCategory.id !== value.id) {
      setSelectedCategory(value);
      await AsyncStorage.setItem(
        `categorySelect${information.name}`,
        JSON.stringify({ category: value })
      );
    } else {
      setSelectedCategory({});
      await AsyncStorage.setItem(
        `categorySelect${information.name}`,
        JSON.stringify({ category: {} })
      );
    }
  };
  useEffect(() => {
    const init = async () => {
      await AsyncStorage.setItem(
        `categorySelect${information.name}`,
        JSON.stringify({ category: {} })
      );
    };
    init();
  }, [information.name]);

  // Annotations features
  const changeAnnotations = (value) => {
    setAnnotations(value);
  };

  // Submit
  const storeTransactionData = async () => {
    if (!enterAmount || !enterConcept || !selectAccount || !selectedCategory.id) {
      return;
    }
    const createUpdatedUserTransactions = (previousDataParsed) => {
      const updatedTransaction = {
        type: isExpense ? 'expense' : 'income',
        concept: enterConcept,
        amount: enterAmount,
        account: selectAccount,
        date,
        category: selectedCategory,
        annotations,
      };

      return [updatedTransaction, ...previousDataParsed];
    };

    const updateUserTransactions = async () => {
      const previousData = (await AsyncStorage.getItem('userTransactions')) || JSON.stringify([]);
      const previousDataParsed = JSON.parse(previousData);
      const updatedTransactionsData = createUpdatedUserTransactions(previousDataParsed);
      await AsyncStorage.setItem('userTransactions', JSON.stringify(updatedTransactionsData));
    };

    const updateUserCurrency = async () => {
      try {
        const previousCurrencyAmountData = await AsyncStorage.getItem('userCurrency');
        const previousCurrencyAmountParsed = JSON.parse(previousCurrencyAmountData);
        const { amount, currency } = previousCurrencyAmountParsed;
        const updatedCurrencyAmount = isExpense
          ? amount - Number(enterAmount)
          : amount + Number(enterAmount);

        const userCurrency = { currency, amount: updatedCurrencyAmount };
        await AsyncStorage.setItem('userCurrency', JSON.stringify(userCurrency));
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }
    };

    const navigateBack = () => {
      navigation.goBack();
    };

    try {
      await updateUserTransactions();
      await updateUserCurrency();
      changeSelectedCategorie({});
      setShowAlertAddTransaction(true);
      setTimeout(navigateBack, 1500);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  return (
    <ScrollView style={TransactionsStyles.container_view}>
      <View style={TransactionsStyles.container}>
        <EnterAmount
          enterAmount={enterAmount}
          changeAmount={changeAmount}
          enterConcept={enterConcept}
          changeConcept={changeConcept}
          titleOfTheFirstInput={titleOfTheFirstInput}
        />

        <Data
          params={{
            selectAccount,
            changeAccount,
            changeDate,
            date,
            listOfAccounts,
          }}
        />

        {listOfCategories && (
          <CategoriesList
            params={{
              navigation,
              selectedCategory,
              changeSelectedCategorie,
              listOfCategories,
              nameTransaction: information.name,
            }}
          />
        )}

        <Annotations annotations={annotations} changeAnnotations={changeAnnotations} />

        <Button
          mode="contained"
          textAlignVertical="center"
          style={{ ...SubmitStyle.button, backgroundColor: `${isAllFull ? '#FA6C17' : '#FEEBE0'}` }}
          onPress={() => isAllFull && storeTransactionData()}
          disabled={!isAllFull}
          labelStyle={{
            width: '100%',
            height: 24,
            flexDirection: 'column',
            textAlignVertical: 'center',
          }}
        >
          {information.buttonSubmitText}
        </Button>
      </View>

      {showAlertAddTransaction && (
        <Alert
          title={information.alertText}
          params={{
            fontColor: '#0003',
            typeIcon: 'success',
          }}
        />
      )}
    </ScrollView>
  );
}

Transactions.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  params: PropTypes.shape({
    listOfAccounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
    listOfCategories: PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            uri: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            scale: PropTypes.number,
            resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat', 'center']),
          }),
          PropTypes.any,
        ]),
      }),
      PropTypes.bool,
      PropTypes.any,
    ]).isRequired,
    changeListOfCategories: PropTypes.func,
    information: PropTypes.shape({
      name: PropTypes.string,
      buttonSubmitText: PropTypes.string,
      mathematicalSymbol: PropTypes.string,
      alertText: PropTypes.string,
      titleOfTheFirstInput: PropTypes.string,
    }),
  }).isRequired,
};
