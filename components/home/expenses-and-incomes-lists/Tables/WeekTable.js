import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { renderImage, useDetailsNavigation, creatingKey } from './utils';

function WeekTable({ tableData }) {
  const navigateToDetails = useDetailsNavigation();
  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell]}>Categoria</Text>
      <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Cantidad</Text>
    </View>
  );

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

  const renderTableRow = () => {
    const groupedData = groupByWeek(tableData);

    // Sort the keys in reverse order
    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    return sortedKeys.flatMap((week, i) => {
      const weekData = groupedData[week];
      const rows = weekData.map((rowData, j) => (
        <View key={creatingKey()} style={j === 0 ? styles.startingTableRow : styles.tableRow}>
          {j === 0 && (
            <View style={styles.label}>
              <Text style={styles.labelText}>{week}</Text>
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
    <ScrollView contentContainerStyle={{ minHeight: 500 }}>
      <View style={styles.container}>
        {renderTableHeader()}
        <View style={styles.tableRowContainer}>{renderTableRow()}</View>
      </View>
    </ScrollView>
  );
}

WeekTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default WeekTable;
