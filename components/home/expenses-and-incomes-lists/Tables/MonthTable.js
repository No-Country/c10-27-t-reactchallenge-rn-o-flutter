import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { renderImage, useDetailsNavigation } from './utils';
import rowArrow from '../../../../assets/home/tablerow-action-arrow.png';

function MonthTable({ tableData, listOfCategories }) {
  const navigateToDetails = useDetailsNavigation();

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell]}>Categoria</Text>
      <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Cantidad</Text>
    </View>
  );

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

  const renderTableRow = () => {
    const groupedData = groupByMonth(tableData);

    // Sort the keys in reverse order
    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    return sortedKeys.flatMap((month, i) => {
      const monthData = groupedData[month];
      const rows = monthData.map((rowData, j) => (
        <View key={rowData.key} style={j === 0 ? styles.startingTableRow : styles.tableRow}>
          {j === 0 && (
            <View style={styles.label}>
              <Text style={styles.labelText}>{month}</Text>
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
              {renderImage(listOfCategories[rowData.category])}
              <Text>{rowData.category}</Text>
            </View>
            <Text style={[styles.tableCell, styles.amountCell]}>
              {rowData.amount}
              <View style={styles.rowArrow}>
                <Image source={rowArrow} />
              </View>
            </Text>
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
      <ScrollView contentContainerStyle={styles.container_view}>
        <View style={styles.tableRowContainer}>{renderTableRow()}</View>
      </ScrollView>
    </View>
  );
}

MonthTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  listOfCategories: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default MonthTable;
