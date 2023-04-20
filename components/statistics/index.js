import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import useTableData from './useTableData';
import PeriodButton from './PeriodButton';
import Table from './Table';
import DatePicker from './DatePicker';
import PieChartScreen from './PieChart';
import useAsyncStorage from '../../hooks/useAsyncStorage';

function getTabType(key) {
  switch (key) {
    case 'first':
      return 'expense';
    case 'second':
      return 'income';
    default:
      return null;
  }
}

function StatisticsContent({ route }) {
  const tabType = getTabType(route.key);
  const [dateFilter, setDateFilter] = useState(null);
  const tableData = useTableData({ tabType, dateFilter });
  const [buttonClicked, setButtonClicked] = useState(1);

  const [, storagedData] = useAsyncStorage('userCurrency');
  if (storagedData?.currency === undefined) return null;

  return (
    <View>
      <View
        style={{
          paddingTop: 30,
          paddingBottom: buttonClicked === 1 ? 30 : 20,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <PeriodButton
          label="Mensual"
          buttonNumber={1}
          buttonClicked={buttonClicked}
          setButtonClicked={setButtonClicked}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
        <PeriodButton
          label="Periodo"
          buttonNumber={2}
          buttonClicked={buttonClicked}
          setButtonClicked={setButtonClicked}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      </View>

      {buttonClicked === 2 && <DatePicker setDateFilter={setDateFilter} dateFilter={dateFilter} />}
      <PieChartScreen tableData={tableData} />
      <Table tableData={tableData} currency={storagedData?.currency} />
    </View>
  );
}

StatisticsContent.propTypes = {
  route: PropTypes.object.isRequired,
};

export default StatisticsContent;
