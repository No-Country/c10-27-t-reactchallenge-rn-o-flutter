import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoriesExport from '../../../assets/categories/categoriesExport';

const { height } = Dimensions.get('window');

const {
  checkListOfExpenditureCategoriesInStorage,
  AddCategoryExpenditureInStorage,
  checkListOfRevenueCategoriesInStorage,
  AddCategoryRevenueInStorage,
  blackListOfIcons,
  CreateCategoryList,
} = CategoriesExport();

const CreateCategoryStyles = StyleSheet.create({
  parentContainer: {
    // paddingHorizontal: '5%',
    minHeight: height,
    flexDirection: 'column',
    gap: 40,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6FD',
  },
  containerCategoryName: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputCategoryName: {
    width: '100%',
    height: 60,
    borderColor: '#334050',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#FEFFFF',
    fontFamily: 'ubuntu-regular',
  },
  containerSelectAnIcon: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  imageItemContainer: {
    width: 76,
    height: 76,
    borderRadius: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  button: {
    marginHorizontal: '15%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default function CreateCategory({ navigation, route }) {
  const { nameTransaction } = route.params;
  const isExpense = nameTransaction === 'Expenses';

  const ListColor = ['#01B496', '#EFB841', '#03B263'];

  useEffect(() => {
    navigation.setOptions({
      title: 'Crear categoría',
    });
  }, [navigation]);

  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('gray');
  const isAllFull = categoryName !== '' && selectedIcon !== '' && selectedColor !== 'gray';

  const changeCategoryName = (value) => {
    setCategoryName(value);
  };

  const renderIcons = (image) => {
    const Icon = blackListOfIcons[image];
    return <Icon />;
  };

  const crateCategory = async () => {
    if (isExpense) {
      const ListCategories = await checkListOfExpenditureCategoriesInStorage();
      const sizeList = ListCategories.length;
      const newId = ListCategories[sizeList - 1].id + 1;
      const category = {
        title: categoryName,
        id: newId,
        image: selectedIcon,
        backgroundColor: selectedColor,
      };
      const categories = await AddCategoryExpenditureInStorage(category);

      await AsyncStorage.setItem(
        `categorySelect${nameTransaction}`,
        JSON.stringify({ type: 'A category is added to the list', category, categories })
      );
    } else {
      const ListCategories = await checkListOfRevenueCategoriesInStorage();
      const sizeList = ListCategories.length;
      const newId = ListCategories[sizeList - 1].id + 1;
      const category = {
        title: categoryName,
        id: newId,
        image: selectedIcon,
        backgroundColor: selectedColor,
      };
      const categories = await AddCategoryRevenueInStorage(category);
      await AsyncStorage.setItem(
        `categorySelect${nameTransaction}`,
        JSON.stringify({ type: 'A category is added to the list', category, categories })
      );
    }

    navigation.pop(2);
  };

  return (
    <ScrollView>
      <View style={CreateCategoryStyles.parentContainer}>
        <View style={CreateCategoryStyles.containerCategoryName}>
          <Text style={{ fontSize: 18, fontFamily: 'ubuntu-regular' }}>Nombre de categoría</Text>
          <TextInput
            placeholder=""
            style={CreateCategoryStyles.inputCategoryName}
            value={categoryName}
            onChangeText={changeCategoryName}
            maxLength={10}
          />
        </View>

        <View style={{ width: '100%', flexDirection: 'column', gap: 10 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', fontFamily: 'ubuntu-regular' }}>
            Selecciona un icono
          </Text>
          <View style={CreateCategoryStyles.containerSelectAnIcon}>
            {CreateCategoryList.map((item) => (
              <View
                key={item.image}
                style={{
                  width: '25%',
                  position: 'relative',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    ...CreateCategoryStyles.imageItemContainer,
                    backgroundColor: selectedColor,
                  }}
                  onPress={() => setSelectedIcon(item.image)}
                >
                  <View
                    style={{
                      ...CreateCategoryStyles.imageItemContainer,
                      backgroundColor: `${item.image === selectedIcon ? selectedColor : '#FEF0E8'}`,
                    }}
                  >
                    {renderIcons(item.image)}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={{ width: '100%', flexDirection: 'column', gap: 10 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', fontFamily: 'ubuntu-regular' }}>
            Selecciona un color
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            {ListColor.map((item) => (
              <TouchableOpacity
                key={item}
                // activeOpacity={0.8}
                onPress={() => setSelectedColor(item)}
              >
                <Text
                  style={{
                    height: 32,
                    width: 32,
                    position: 'relative',
                    backgroundColor: item,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderBottomColor: `${selectedColor === item ? '#334050' : 'transparent'}`,
                    fontFamily: 'ubuntu-regular',
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={crateCategory}
          style={{
            ...CreateCategoryStyles.button,
            backgroundColor: `${isAllFull ? '#FA6C17' : '#FEEBE0'}`,
          }}
          disabled={!isAllFull}
          labelStyle={{
            width: '100%',
            height: 40,
            flexDirection: 'column',
            textAlignVertical: 'center',
            fontFamily: 'ubuntu-bold',
            fontSize: 16,
          }}
        >
          Añadir Categoría
        </Button>
      </View>
    </ScrollView>
  );
}

CreateCategory.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func,
    pop: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      nameTransaction: PropTypes.string,
    }),
  }).isRequired,
};
