import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { creatingKey, renderImage } from '../home/expenses-and-incomes-lists/Tables/utils';

const { height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#EFEEEE',
    paddingTop: 10,
    marginBottom: `${(height / 100) * 14}%`,
  },
  scrollView: {
    flexDirection: 'column',
    marginTop: 30,
    backgroundColor: '#EFEEEE',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomColor: '#99A3A4',
    borderBottomWidth: 1,
  },
  leftCol: {
    flexDirection: 'row',
    flex: 0.7,
  },
  percentage: {
    width: 70,
    fontFamily: 'ubuntu-bold',
    fontSize: 14,
    color: '#334050',
    letterSpacing: -0.3,
  },
  dot: {
    width: 18,
    height: 18,
    marginRight: 10,
    borderRadius: 50,
  },
  category: {
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: -0.3,
    color: '#334050',
    fontFamily: 'ubuntu-regular',
  },
  total: {
    flex: 0.3,
    textAlign: 'right',
    fontFamily: 'ubuntu-bold',
    fontSize: 14,
    color: '#334050',
    letterSpacing: -0.3,
  },
});

function Table({ tableData, currency }) {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {tableData.map((rowData, index) => {
          const isLastItem = index === tableData.length - 1;
          return (
            <View
              key={creatingKey()}
              style={[
                styles.row,
                {
                  borderBottomWidth: isLastItem ? 0 : 1,
                },
              ]}
            >
              <View style={styles.leftCol}>
                <Text style={styles.percentage}>{rowData.percentage}%</Text>
                {/* <View style={[styles.dot, { backgroundColor: rowData.svg.fill }]} /> */}
                {renderImage({ ...rowData.category, ...rowData.svg })}
                <Text style={styles.category}>{rowData.category.title}</Text>
              </View>

              <Text style={styles.total}>
                {rowData.total} {currency}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  currency: PropTypes.string.isRequired,
};

export default Table;
