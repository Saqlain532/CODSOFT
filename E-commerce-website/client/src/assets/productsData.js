import { electronicsData } from './productsData/electronicsData';
import { fashionData } from './productsData/fashionData';
import { homeFurnitureData } from './productsData/homeFurnitureData';
import { sportsData } from './productsData/sportsData';
import { beautyData } from './productsData/beautyData';
import { toysData } from './productsData/toysData';
import { booksData } from './productsData/booksData';
import { automotiveData } from './productsData/automotiveData';
import { groceriesData } from './productsData/groceriesData';
import { petsData } from './productsData/petsData';

// Map the category IDs directly to their respective hardcoded data arrays
export const categoryProductMap = {
  1: electronicsData,
  2: fashionData,
  3: homeFurnitureData,
  4: sportsData,
  5: beautyData,
  6: toysData,
  7: booksData,
  8: automotiveData,
  9: groceriesData,
  10: petsData
};
