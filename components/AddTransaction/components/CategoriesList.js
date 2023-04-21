import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PlusIcon from '../../../assets/categories/icons/PlusIcon.svg';
import CategoriesExport from '../../../assets/categories/categoriesExport';

const { width } = Dimensions.get('window');
const { whiteListOfIcons } = CategoriesExport();

const CategoriesListStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 10,
  },
  buttonTitle: {
    backgroundColor: 'transparent',
  },
  itemContainer: {
    width: '25%',
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
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
    borderRadius: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageItem: {
    width: 48,
    height: 48,
  },
  titleItems: {
    fontSize: 12,
    fontFamily: 'ubuntu-regular',
  },
  buttonItem: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: 10,
    // backgroundColor: 'transparent',
  },
  buttonItemLabel: {
    width: '100%',
    paddingVertical: `${width < 400 ? '20%' : '30%'}`,
  },
  buttonItemTheme: {
    primary: 'transparent',
    // onPrimary: 'black',
  },
});

export default function CategoriesList({ params }) {
  const {
    navigation,
    changeSelectedCategorie,
    listOfCategories,
    selectedCategory,
    nameTransaction,
  } = params;

  const [itemsCategoriesCopy, setItemsCategoriesCopy] = useState(false);
  // /////// Features

  useEffect(() => {
    if (listOfCategories[0] && listOfCategories !== []) {
      setItemsCategoriesCopy([listOfCategories[0], listOfCategories[1], listOfCategories[2]]);
    }
  }, [listOfCategories]);

  const renderImage = (param) => {
    const ImageItem = whiteListOfIcons[param.imageIndex];
    return <ImageItem width={40} height={40} />;
  };

  const renderCategoriesItems = () => {
    const items = itemsCategoriesCopy.map((item) => (
      <View style={CategoriesListStyles.itemContainer} key={item.id}>
        <TouchableOpacity
          onPress={() => changeSelectedCategorie(item)}
          style={{
            ...CategoriesListStyles.item,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              ...CategoriesListStyles.item,
              backgroundColor: `${
                item.id === selectedCategory.id ? item.backgroundColor : 'transparent'
              }`,
            }}
          >
            <View
              style={{
                ...CategoriesListStyles.imageItemContainer,
                backgroundColor: item.backgroundColor,
              }}
            >
              {renderImage({ imageIndex: item.image })}
            </View>
            <Text style={CategoriesListStyles.titleItems}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    ));
    return items;
  };

  //  Check if the category was changed
  // const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const previousData =
        (await AsyncStorage.getItem(`categorySelect${nameTransaction}`)) ||
        JSON.stringify({ category: '' });
      const previousDataParse = JSON.parse(previousData);
      if (
        selectedCategory.id !== previousDataParse.category.id &&
        previousDataParse.type === 'Selected category'
      ) {
        const changeListCategories = itemsCategoriesCopy.filter(
          (value) => value.id !== previousDataParse.category.id
        );

        changeSelectedCategorie(previousDataParse.category);

        if (changeListCategories.length === 3) {
          changeListCategories.pop();
        }

        const FoundCategory = listOfCategories.filter(
          (iem) => iem.id === previousDataParse.category.id
        );
        changeListCategories.unshift(...FoundCategory);
        setItemsCategoriesCopy([...changeListCategories]);
      } else if (previousDataParse.type === 'empty category selection') {
        changeSelectedCategorie({});
      } else if (
        previousDataParse.type === 'A category is added to the list' &&
        previousDataParse.category.id
      ) {
        changeSelectedCategorie(previousDataParse.category);
        const changeListCategories = itemsCategoriesCopy.filter(
          (value) => value.id !== previousDataParse.category.id
        );
        if (changeListCategories.length === 3) {
          changeListCategories.pop();
        }
        changeListCategories.unshift(previousDataParse.category);
        setItemsCategoriesCopy([...changeListCategories]);
      }
      // setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [
    // count,
    navigation,
    selectedCategory,
    nameTransaction,
    changeSelectedCategorie,
    itemsCategoriesCopy,
    listOfCategories,
  ]);

  return (
    <View style={CategoriesListStyles.container}>
      <Button
        mode="contained"
        style={CategoriesListStyles.buttonTitle}
        textColor="black"
        labelStyle={{ fontSize: 20, fontFamily: 'ubuntu-regular' }}
      >
        Categorias
      </Button>

      <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
        {itemsCategoriesCopy && renderCategoriesItems()}

        <View style={CategoriesListStyles.itemContainer}>
          <TouchableOpacity
            style={{
              ...CategoriesListStyles.item,
              backgroundColor: '#FA6C17',
            }}
            activeOpacity={0.8}
            onPress={() =>
              !selectedCategory.id &&
              navigation.navigate('AddCategory', {
                listOfCategories,
                CategoryNameSelectedInStorage: `categorySelect${nameTransaction}`,
                nameTransaction,
              })
            }
          >
            <View style={{ ...CategoriesListStyles.item, backgroundColor: '#F6F6FD' }}>
              <View
                style={{ ...CategoriesListStyles.imageItemContainer, backgroundColor: '#FA6C17' }}
              >
                <PlusIcon />
              </View>
              <Text style={CategoriesListStyles.titleItems}>Más</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

CategoriesList.propTypes = {
  params: PropTypes.shape({
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
      setOptions: PropTypes.func.isRequired,
    }).isRequired,
    changeSelectedCategorie: PropTypes.func,
    listOfCategories: PropTypes.oneOfType([
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
        ]).isRequired,
      }).isRequired,
      PropTypes.bool,
      PropTypes.any,
    ]).isRequired,
    changeListOfCategories: PropTypes.func,
    selectedCategory: PropTypes.oneOfType([PropTypes.any, PropTypes.number]),
    nameTransaction: PropTypes.string,
  }).isRequired,
};
