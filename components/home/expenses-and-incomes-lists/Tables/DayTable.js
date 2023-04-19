import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { renderImage, useDetailsNavigation, creatingKey } from './utils';

function DayTable({ tableData }) {
  const navigateToDetails = useDetailsNavigation();

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell]}>Categoria</Text>
      <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Cantidad</Text>
    </View>
  );

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

  const renderTableRow = () => {
    const groupedData = groupByDay(tableData);

    // Sort the keys in reverse order
    const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    return sortedKeys.flatMap((day, i) => {
      const dayData = groupedData[day];
      const rows = dayData.map((rowData, j) => (
        <View key={creatingKey()} style={j === 0 ? styles.startingTableRow : styles.tableRow}>
          {j === 0 && (
            <View style={styles.label}>
              <Text style={styles.labelText}>{day}</Text>
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

DayTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DayTable;
