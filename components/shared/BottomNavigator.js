import React from 'react';
import { View, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import Alert from './Alert';

function NavIconButton({ routeName, iconName }) {
  const [isShowAlert, setIsShowAlert] = React.useState(false);
  const navigation = useNavigation();
  const router = useRoute();
  const currentRoute = router?.name;

  const handlePress = () => {
    if (routeName === 'Wallet' || routeName === 'Notifications') {
      return setIsShowAlert(true);
    }
    return navigation.navigate(routeName);
  };
  return (
    <View
      style={{
        borderBottomWidth: 3,
        borderBottomColor: currentRoute === routeName ? '#FA6C17' : 'transparent',
        width: 48,
      }}
    >
      <IconButton icon={iconName} color="#7B8EA5" size={20} onPress={handlePress} />
      {isShowAlert && (
        <Alert
          title="Estamos trabajando en esta opción"
          params={{
            message: '¡Pronto estará lista!',
            fontColor: '#0003',
            changeShowAlert: () => setIsShowAlert(false),
          }}
        />
      )}
    </View>
  );
}

function BottomNavigator() {
  const screenWidth = Dimensions.get('window').width;
  const marginHorizontal = (screenWidth - 328) / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: marginHorizontal,
        right: marginHorizontal,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 328,
        height: 48,
        borderRadius: 10,
        backgroundColor: '#F6F6FD',
        bottom: 30,
      }}
    >
      <NavIconButton routeName="Home" iconName="home-outline" />
      <NavIconButton routeName="Wallet" iconName="wallet-outline" />
      <NavIconButton routeName="Statistics" iconName="chart-line" />
      <NavIconButton routeName="Notifications" iconName="bell-outline" />
    </View>
  );
}

NavIconButton.propTypes = {
  routeName: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
};

export default BottomNavigator;
