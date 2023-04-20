import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, List } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/es';
import Alert from '../../shared/Alert';

const DataStyles = StyleSheet.create({
  parentContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  container: {
    width: '50%',
  },
  button: {
    backgroundColor: 'transparent',
    margin: 0,
  },
  buttonLabelStyle: {
    fontSize: 18,
    fontFamily: 'ubuntu-regular',
  },
  textLabelStyle: {
    fontFamily: 'ubuntu-regular',
  },
  date: {
    minHeight: 48,
    padding: 0,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FEFFFF',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'ubuntu-regular',
  },
});

export default function Data({ params }) {
  // funtios params
  const { selectAccount, changeAccount, changeDate, date, listOfAccounts } = params;

  //  Status
  const [openListAccount, setOpenListAccount] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);

  // Features
  function openList() {
    setOpenListAccount(!openListAccount);
  }

  const changeDateAndStatusDate = (selectedDate) => {
    const currentDate = selectedDate || date;
    setOpenDate(false);
    changeDate(currentDate);
  };

  const renderPickerItems = (list2) => {
    const prop = list2.map((item) => (
      <List.Item
        key={item.id}
        label={item.title}
        value={item.id}
        title={item.title}
        onPress={() => {
          openList();
          changeAccount(item.title);
        }}
        style={DataStyles.textLabelStyle}
      />
    ));

    return prop;
  };

  const changeIsShowAlert = () => {
    setIsShowAlert(false);
  };

  return (
    <View style={DataStyles.parentContainer}>
      <View style={DataStyles.container}>
        <Button
          title="Mostrar Picker"
          mode="contained"
          onPress={() => setIsShowAlert(true)}
          style={DataStyles.button}
          textColor="black"
          labelStyle={DataStyles.buttonLabelStyle}
        >
          Cuenta
        </Button>

        <List.Accordion
          title={selectAccount}
          style={DataStyles.date}
          expanded={openListAccount}
          titleStyle={DataStyles.textLabelStyle}
          onPress={() => setIsShowAlert(true)}
          theme={{ colors: { primary: 'blue', onPrimary: 'black', secondary: 'red' } }}
        >
          {renderPickerItems(listOfAccounts)}
        </List.Accordion>
      </View>

      <View style={DataStyles.container}>
        <Button
          title="Fecha"
          mode="contained"
          onPress={() => setOpenDate(true)}
          style={DataStyles.button}
          textColor="black"
          labelStyle={DataStyles.buttonLabelStyle}
        >
          Fecha
        </Button>
        <Button
          mode="contained"
          onPress={() => setOpenDate(true)}
          style={DataStyles.date}
          textColor="black"
          labelStyle={DataStyles.textLabelStyle}
        >
          {moment(date).locale('es').format('LL')}
        </Button>
        {openDate && (
          <DateTimePickerModal
            isVisible={openDate}
            mode="date"
            onConfirm={changeDateAndStatusDate}
            onCancel={() => setOpenDate(false)}
            locale="es_ES"
            maximumDate={new Date()}
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
            buttonTextColorIOS="#FA6C17"
          />
        )}
      </View>
      {isShowAlert && (
        <Alert
          title="Estamos trabajando en esta opción"
          params={{
            message: '¡Pronto estará lista!',
            fontColor: '#0003',
            changeShowAlert: changeIsShowAlert,
          }}
        />
      )}
    </View>
  );
}

Data.propTypes = {
  params: PropTypes.shape({
    selectAccount: PropTypes.string,
    changeAccount: PropTypes.func,
    changeDate: PropTypes.func,
    date: PropTypes.any,
    listOfAccounts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
};
