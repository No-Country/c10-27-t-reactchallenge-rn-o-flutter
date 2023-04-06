import { Image, Text, View, StyleSheet } from 'react-native';
import icon from '../../assets/snack-icon.png';

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 40,
  },
  paragraph: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 64,
    width: 64,
    marginBottom: 20,
  },
});

export default function SettingUpHeaderScreen() {
  return (
    <View style={styles.headerContainer}>
      <Image style={styles.logo} source={icon} />
      <Text style={styles.paragraph}>Organicemos tus finanzas juntos</Text>
      <Text style={styles.paragraph}>¡Empecemos!</Text>
    </View>
  );
}

SettingUpHeaderScreen.propTypes = {};