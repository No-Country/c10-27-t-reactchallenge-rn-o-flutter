/* eslint-disable no-plusplus */
import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import getAsyncStorageData from '../utils/get-storage-data';
import CategoriesExport from '../assets/categories/categoriesExport';

const { ListOfExpenditureCategories } = CategoriesExport();

const generateRandomTableData = (currency) => {
  const generateRandomDate = () => {
    const startDate = new Date('2022-12-01').getTime();
    const endDate = new Date().getTime();
    const randomTimestamp = Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;
    const randomDate = new Date(randomTimestamp);
    return randomDate;
  };

  const generateRandomAmount = () => {
    const randomAmount = Math.random() * 50;
    return `${randomAmount.toFixed(2)} ${currency}`;
  };

  const categories = ListOfExpenditureCategories;

  const tableData = [];
  const usedKeys = new Set();

  for (let i = 0; i < 40; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = generateRandomDate();
    const amount = generateRandomAmount(currency);
    let key = category;
    let j = 1;
    while (usedKeys.has(key)) {
      key = `${category}-${j}`;
      j++;
    }
    usedKeys.add(key);
    tableData.push({ key, category, date, amount, concept: 'Mock Data' });
  }
  return tableData.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Create a context
const MockedDataContext = createContext();

// Create a provider component
function MockedDataProvider(props) {
  const [tablesMockData, setTablesMockData] = useState({});
  const { children } = props;

  useEffect(() => {
    // random table data initial generation
    const getRandomTableData = async () => {
      const storagedCurrencyData = await getAsyncStorageData('userCurrency');
      const { currency } = storagedCurrencyData;
      const newRandomExpensesTableData = generateRandomTableData(currency);
      const newRandomIncomesTableData = generateRandomTableData(currency);
      const generatedTablesMockData = {
        expense: newRandomExpensesTableData,
        income: newRandomIncomesTableData,
      };
      setTablesMockData(generatedTablesMockData);
    };
    if (!Object.entries(tablesMockData).length && process.env.MOCK_DATA !== 'disabled')
      getRandomTableData();
  }, [tablesMockData]);

  return <MockedDataContext.Provider value={tablesMockData}>{children}</MockedDataContext.Provider>;
}

MockedDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MockedDataProvider, MockedDataContext };
