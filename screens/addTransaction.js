// import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Transactions from '../components/AddTransaction/Tables/Transactions';

import categoriesExport from '../assets/categories/categoriesExport';

const Tab = createMaterialTopTabNavigator();

export default function AddTransaction({ navigation }) {
  const [listOfExpenditureCategories, setListOfExpenditureCategories] = useState(false);
  const [listOfRevenueCategories, setListOfRevenueCategories] = useState(false);

  const {
    checkListOfExpenditureCategoriesInStorage,
    checkListOfRevenueCategoriesInStorage,
    resetListOfRevenueCategoriesInStorage,
  } = categoriesExport();

  useEffect(() => {
    navigation.setOptions({
      title: 'Añadir transacciones',
    });
    const init = async () => {
      if (!listOfExpenditureCategories) {
        await AsyncStorage.setItem('categorySelectExpense', JSON.stringify({ category: '' }));
        await AsyncStorage.setItem('categorySelectRevenue', JSON.stringify({ category: '' }));
        setListOfRevenueCategories(await resetListOfRevenueCategoriesInStorage());
        setListOfExpenditureCategories(await checkListOfExpenditureCategoriesInStorage());
      }
    };

    init();
  }, [
    navigation,
    checkListOfExpenditureCategoriesInStorage,
    checkListOfRevenueCategoriesInStorage,
    listOfExpenditureCategories,
  ]);

  const listOfAccounts = [
    { id: 1, title: 'Principal' },
    { id: 2, title: 'Opción 2' },
    { id: 3, title: 'Opción 3' },
    { id: 4, title: 'Opción 4' },
    { id: 5, title: 'Opción 5' },
    { id: 6, title: 'Opción 6' },
  ];

  const changeListOfExpenditureCategories = (value) => {
    setListOfExpenditureCategories(value);
  };
  const changeListOfRevenueCategories = (value) => {
    setListOfRevenueCategories(value);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 20, textTransform: 'capitalize' },
        tabBarIndicatorStyle: {
          backgroundColor: '#FA6C17',
          paddingHorizontal: 20,
        },
      }}
    >
      <Tab.Screen name="Gastos">
        {() => (
          <Transactions
            navigation={navigation}
            params={{
              listOfAccounts,
              listOfCategories: listOfExpenditureCategories,
              changeListOfCategories: changeListOfExpenditureCategories,
              information: {
                name: 'Expenses',
                buttonSubmitText: 'Añadir gasto',
                alertText: '¡Gasto añadido con éxito!',
              },
            }}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Ingresos">
        {() => (
          <Transactions
            navigation={navigation}
            params={{
              listOfAccounts,
              listOfCategories: listOfRevenueCategories,
              changeListOfCategories: changeListOfRevenueCategories,
              information: {
                name: 'Revenues',
                buttonSubmitText: 'Añadir Ingreso',
                alertText: '¡Ingreso añadido con éxito!',
              },
            }}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

AddTransaction.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func,
  }).isRequired,
};
