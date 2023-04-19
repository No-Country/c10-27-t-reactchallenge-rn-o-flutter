import { useEffect, useState, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import getAsyncStorageData from '../../utils/get-storage-data';
import { MockedDataContext } from '../../hooks/useMockedData';

const getTransactionsData = async (tabType) => {
  const parsed = (await getAsyncStorageData('userTransactions')) || [];
  const mapped = parsed
    .map((element) => ({
      key: element.category + element.amount + element.date,
      type: element.type,
      category: element.category,
      date: new Date(element.date),
      amount: Number(element.amount),
    }))
    .filter((element) => element.type === tabType);
  return mapped;
};

function getCategoryData(arr) {
  const total = arr.reduce((acc, obj) => acc + obj.amount, 0);
  const categorySums = {};

  arr.forEach((obj) => {
    const { category, amount } = obj;
    if (category.title in categorySums) {
      categorySums[category.title].total += amount;
    } else {
      categorySums[category.title] = { total: amount, percentage: 0, category };
    }
  });

  const categoryData = Object.keys(categorySums).map((category) => {
    const { total: sum, category: categoryInObject } = categorySums[category];
    const percentage = ((sum / total) * 100).toFixed(2);
    return { category: categoryInObject, total: sum.toFixed(2), percentage };
  });

  categoryData.sort((a, b) => b.total - a.total); // sort in descending order by "total" value

  return categoryData;
}

function getRandomHexColor() {
  const hexChars = '0123456789ABCDEF';
  let color = '#';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    color += hexChars[Math.floor(Math.random() * 16)];
  }

  return color;
}

function isSameDay(date1, date2) {
  function isDate(value) {
    return value instanceof Date;
  }
  // eslint-disable-next-line no-alert
  if (!isDate(date1) || !isDate(date2)) alert('Invalid date');

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const useTableData = ({ tabType, dateFilter }) => {
  const tablesMockData = useContext(MockedDataContext);
  const isFocused = useIsFocused();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // table data generation
    async function getTableData() {
      const transactionsData = await getTransactionsData(tabType);

      const mockedData = tablesMockData[tabType].map((element) => ({
        key: element.category + element.amount + element.date,
        type: element.type,
        category: element.category,
        date: element.date,
        amount: Number(element.amount.split(' ')[0]),
      }));

      const filteredData = dateFilter
        ? [...transactionsData, ...mockedData].filter((element) =>
            isSameDay(element.date, dateFilter)
          )
        : [...transactionsData, ...mockedData];
      const categoryData = getCategoryData(filteredData).map((element, index) => ({
        ...element,
        svg: { fill: getRandomHexColor() },
        key: index,
      }));

      setTableData(categoryData);
    }
    if (isFocused && tablesMockData[tabType]) getTableData();
  }, [isFocused, tablesMockData, tabType, dateFilter]);

  return tableData;
};

export default useTableData;
