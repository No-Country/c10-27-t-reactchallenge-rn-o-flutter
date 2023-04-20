import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-paper';

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#FFF6F0',
    borderRadius: 10,
  },
  buttonText: {
    color: '#8192A6',
    fontFamily: 'ubuntu-regular',
  },
  activeButton: {
    backgroundColor: '#FA6C17',
  },
});

function PeriodButton({
  label,
  buttonNumber,
  buttonClicked,
  setButtonClicked,
  dateFilter,
  setDateFilter,
}) {
  const isActive = buttonClicked === buttonNumber;
  const buttonStyles = [styles.buttonStyle, isActive && styles.activeButton];

  const handlePress = () => {
    setButtonClicked(buttonNumber);
    if (buttonNumber === 1 && dateFilter) setDateFilter(null);
  };

  return (
    <Button mode="contained" onPress={handlePress} style={buttonStyles}>
      <Text
        style={{
          ...styles.buttonText,
          fontFamily: `${isActive ? 'ubuntu-bold' : 'ubuntu-regular'}`,
          color: `${isActive ? 'white' : '#8192A6'}`,
        }}
      >
        {label}
      </Text>
    </Button>
  );
}

PeriodButton.propTypes = {
  label: PropTypes.string.isRequired,
  buttonNumber: PropTypes.number.isRequired,
  setButtonClicked: PropTypes.func.isRequired,
  setDateFilter: PropTypes.func.isRequired,
  buttonClicked: PropTypes.number.isRequired,
  // eslint-disable-next-line react/require-default-props
  dateFilter: PropTypes.instanceOf(Date),
};

export default PeriodButton;
