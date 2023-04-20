import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

import PlusIcon from '../../../assets/categories/icons/PlusIcon.svg';
import CategoriesExport from '../../../assets/categories/categoriesExport';

const { height } = Dimensions.get('window');
const { whiteListOfIcons } = CategoriesExport();

const styles = StyleSheet.create({
  container: {
    minHeight: height,
    flexDirection: 'column',
    paddingVertical: 20,
    gap: 10,
    backgroundColor: '#F6F6FD',
  },
  categoryContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    paddingTop: 14,
    marginBottom: `${(height / 100) * 10}%`,
    // justifyContent: 'space-evenly',
  },
  itemContainer: {
    width: '25%',
    // width: `${width < 400 ? '25%' : 0}`,
  },
  item: {
    marginBottom: 10,
    // width: `${width < 400 ? '25%' : 76}`,
    width: 76,
    height: 71,
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 10,
    gap: 4,
  },
  imageItemContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#d9d9d9',
    borderRadius: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleItems: {
    fontSize: 12,
    fontFamily: 'ubuntu-regular',
  },
  image: {
    width: 48,
    height: 48,
  },
});

export default function AddCategory({ navigation, route }) {
  const { listOfCategories, CategoryNameSelectedInStorage, nameTransaction } = route.params;
  const [itemsCategoriesCopy, setItemsCategoriesCopy] = useState(false);

  const [selecdCategorie, setSelectedCategorie] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: 'Añadir categoría',
    });
    const init = async () => {
      const previousData =
        (await AsyncStorage.getItem(CategoryNameSelectedInStorage)) ||
        JSON.stringify({ category: '' });
      const previousDataParse = JSON.parse(previousData);
      setSelectedCategorie(previousDataParse.category);
      setItemsCategoriesCopy(listOfCategories);
    };
    init();
  }, [navigation, CategoryNameSelectedInStorage, listOfCategories]);

  const changeSelectedCategorie = async (value) => {
    if (selecdCategorie.id !== value.id) {
      setSelectedCategorie(value);
      await AsyncStorage.setItem(
        CategoryNameSelectedInStorage,
        JSON.stringify({ type: 'Selected category', category: value })
      );
    } else {
      await AsyncStorage.setItem(
        CategoryNameSelectedInStorage,
        JSON.stringify({ category: {}, type: 'empty category selection' })
      );
      setSelectedCategorie({});
    }
    navigation.goBack();
  };

  const renderImage = (param) => {
    const ImageItem = whiteListOfIcons[param.imageIndex];
    return <ImageItem width={40} height={40} fill="red" />;
  };

  const renderCategoriesItems = () => {
    const items = itemsCategoriesCopy.map((item) => (
      <View style={styles.itemContainer} key={item.id}>
        <TouchableOpacity
          onPress={() => changeSelectedCategorie(item)}
          style={{
            ...styles.item,
            backgroundColor: item.backgroundColor,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              ...styles.item,
              backgroundColor: `${
                item.id === selecdCategorie.id ? item.backgroundColor : '#F6F6FD'
              }`,
            }}
          >
            {/* <Image source={item.image} style={styles.image} /> */}
            <View style={{ ...styles.imageItemContainer, backgroundColor: item.backgroundColor }}>
              {renderImage({ imageIndex: item.image })}
            </View>
            <Text style={styles.titleItems}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
    return items;
  };

  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const founSearchQuery = [];
    for (let item = 0; item < listOfCategories.length; item += 1) {
      const titleItems = listOfCategories[item].title;
      if (titleItems.toUpperCase().includes(searchQuery.toUpperCase()) && searchQuery !== '') {
        founSearchQuery.push(listOfCategories[item]);
      }
    }
    if (searchQuery !== '') {
      setItemsCategoriesCopy(founSearchQuery);
    } else {
      setItemsCategoriesCopy(listOfCategories);
    }
  }, [searchQuery, listOfCategories]);

  return (
    <View style={styles.container}>
      <Searchbar
        onChangeText={onChangeSearch}
        placeholder="Encuentra una categoría"
        placeholderTextColor="#9BA5B3"
        iconColor="#FA6C17"
        style={{
          paddingHorizontal: 10,
          marginHorizontal: 10,
          borderRadius: 10,
          backgroundColor: '#FEFFFF',
          borderWidth: 1,
          borderColor: '#a9aaaa',
        }}
        fontSize={16}
        fontFamily="ubuntu-regular"
      />
      <ScrollView>
        <View style={styles.categoryContainer}>
          {itemsCategoriesCopy && renderCategoriesItems()}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ ...styles.item, backgroundColor: '#FA6C17' }}
            onPress={() => navigation.navigate('CreateCategory', { nameTransaction })}
          >
            <View style={{ ...styles.item, backgroundColor: '#F6F6FD' }}>
              <View style={{ ...styles.imageItemContainer, backgroundColor: '#FA6C17' }}>
                <PlusIcon />
              </View>
              <Text style={styles.titleItems}>Crear</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

AddCategory.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      listOfCategories: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          image: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              uri: PropTypes.string.isRequired,
              width: PropTypes.number.isRequired,
              height: PropTypes.number.isRequired,
              scale: PropTypes.number,
              resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat', 'center']),
            }),
            PropTypes.any,
            PropTypes.func,
          ]),
        })
      ),
      CategoryNameSelectedInStorage: PropTypes.string,
      nameTransaction: PropTypes.string,
    }),
  }).isRequired,
};
