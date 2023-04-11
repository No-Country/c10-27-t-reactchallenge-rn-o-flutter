import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Modal, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import Aviso from '../../../assets/addTransactionIcons/Aviso.svg';
import ConstructionIcon from '../../../assets/addTransactionIcons/ConstructionIcon.svg';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: '70%',
    maxWidth: 300,
    minHeight: 200,
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  titleItems: {
    fontSize: 25,
    textAlign: 'center',
  },
  messageItems: {
    fontSize: 17,
  },
});

export default function Alert({ title, params }) {
  const { changeShowAlert, fontColor, message, typeIcon } = params;
  const opacityItemAnimation = useRef(new Animated.Value(0)).current;
  const opacityContainerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityItemAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityContainerAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacityItemAnimation, opacityContainerAnimation]);

  const changeShowAlert2 = () => {
    if (changeShowAlert) {
      changeShowAlert();
    }
  };

  const isTranspatent = true;

  return (
    <Modal transparent={isTranspatent}>
      <Animated.View style={[styles.container, { opacity: opacityContainerAnimation }]}>
        <View style={{ ...styles.container, backgroundColor: fontColor }}>
          <Animated.View style={[styles.item, { opacity: opacityItemAnimation }]}>
            <View style={styles.item}>
              {typeIcon === 'success' ? <Aviso /> : <ConstructionIcon />}
              <Text style={styles.titleItems}>{title}</Text>
            </View>
            {message && <Text style={styles.messageItems}>{message}</Text>}
          </Animated.View>
        </View>

        <Button
          mode="contained"
          title="Learn More"
          labelStyle={{ width, height, backgroundColor: 'transparent' }}
          style={{ backgroundColor: 'transparent' }}
          onPress={changeShowAlert2}
        />
      </Animated.View>
    </Modal>
  );
}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  params: PropTypes.shape({
    changeShowAlert: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.array,
      PropTypes.func,
      PropTypes.any,
    ]),
    fontColor: PropTypes.string.isRequired,
    message: PropTypes.string,
    typeIcon: PropTypes.string,
  }).isRequired,
};
