import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { renderImage, useDetailsNavigation, creatingKey } from './utils';

// /////////////////////////// day
const getDayLabel = (rowDate) => {
  const date = new Date(rowDate);
  const dayLabel = `${date.toLocaleDateString('es-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })} ${date.getFullYear()}`;
  return dayLabel;
};

const groupByDay = (data) => {
  const groupedData = {};
  data.forEach((rowData) => {
    const day = getDayLabel(rowData.date);
    if (!groupedData[day]) {
      groupedData[day] = [];
    }
    groupedData[day].push(rowData);
  });
  return groupedData;
};

// ////////////////////////// week
const getWeekLabel = (rowDate) => {
  const date = new Date(rowDate);
  const startOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay() + 1
  );
  const endOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay() + 7
  );
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  let weekLabel = '';

  if (startOfWeek.getMonth() !== date.getMonth()) {
    weekLabel = `${startOfMonth.getDate()} ${startOfMonth.toLocaleString('es-ES', {
      month: 'short',
    })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('es-ES', { month: 'short' })}`;
  } else if (endOfWeek > endOfMonth) {
    weekLabel = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('es-ES', {
      month: 'short',
    })} - ${endOfMonth.getDate()} ${endOfMonth.toLocaleString('es-ES', { month: 'short' })}`;
  } else {
    weekLabel = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('es-ES', {
      month: 'short',
    })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('es-ES', { month: 'short' })}`;
  }

  return weekLabel;
};

const groupByWeek = (data) => {
  const groupedData = {};
  data.forEach((rowData) => {
    const week = getWeekLabel(rowData.date);
    if (!groupedData[week]) {
      groupedData[week] = [];
    }
    groupedData[week].push(rowData);
  });
  return groupedData;
};

// //////////////////////////// month
const getMonthLabel = (rowDate) => {
  const date = new Date(rowDate);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthLabel = `${startOfMonth.toLocaleString('es-ES', {
    month: 'short',
  })} ${startOfMonth.getFullYear()}`;
  return monthLabel;
};

const groupByMonth = (data) => {
  const groupedData = {};
  data.forEach((rowData) => {
    const month = getMonthLabel(rowData.date);
    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    groupedData[month].push(rowData);
  });
  return groupedData;
};

// / Group
const group = (type, table) => {
  let result;
  if (type === 'day' || type === 1) {
    result = groupByDay(table);
  } else if (type === 'week' || type === 2) {
    result = groupByWeek(table);
  } else {
    result = groupByMonth(table);
  }

  return result;
};

export default function Table({ tableData, typeTable }) {
  const navigateToDetails = useDetailsNavigation();

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell]}>Categoria</Text>
      <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Cantidad</Text>
    </View>
  );

  const renderTableRow = () => {
    // const groupedData = typeTable === 'day' ? groupByDay(tableData) : typeTable === 'week' ? groupByWeek(tableData) : groupByMonth(tableData);
    const groupedData = group(typeTable, tableData);

    // Sort the keys in reverse order
    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    return sortedKeys.flatMap((date, i) => {
      const dayData = groupedData[date];
      const rows = dayData.map((rowData, j) => (
        <View key={creatingKey()} style={j === 0 ? styles.startingTableRow : styles.tableRow}>
          {j === 0 && (
            <View style={styles.label}>
              <Text style={styles.labelText}>{date}</Text>
            </View>
          )}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            onPress={() =>
              navigateToDetails(
                tableData,
                rowData.category,
                rowData.type,
                rowData.amount.split(' ')[1]
              )
            }
          >
            <View style={[styles.tableCell, styles.categoryCell]}>
              {renderImage(rowData.category)}
              <Text>{rowData.category.title}</Text>
            </View>
            <Text style={[styles.tableCell, styles.amountCell]}>{rowData.amount}</Text>
          </TouchableOpacity>
        </View>
      ));

      return [
        ...rows,
        i < sortedKeys.length - 1 && <View style={styles.separator} key={`separator-${i}`} />,
      ];
    });
  };

  return (
    <View style={styles.container}>
      {renderTableHeader()}
      <ScrollView contentContainerStyle={{ minHeight: 500 }}>
        <View style={styles.tableRowContainer}>{renderTableRow()}</View>
      </ScrollView>
    </View>
  );
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  // listOfCategories: PropTypes.objectOf(PropTypes.object).isRequired,
  typeTable: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
