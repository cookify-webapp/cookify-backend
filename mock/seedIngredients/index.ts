import seedDairy from '@mock/seedIngredients/seedDairy';
import seedSeasonings from '@mock/seedIngredients/seedSeasonings';
import seedSeafood from '@mock/seedIngredients/seedSeafood';
import seedLegumes from '@mock/seedIngredients/seedLegumes';
import seedMeat from '@mock/seedIngredients/seedMeat';
import seedFlour from '@mock/seedIngredients/seedFlour';
import seedManufactured from '@mock/seedIngredients/seedManufactured';
import seedVegetables from '@mock/seedIngredients/seedVegetables';

export default [
  ...seedSeasonings,
  ...seedDairy,
  ...seedSeafood,
  ...seedLegumes,
  ...seedMeat,
  ...seedFlour,
  ...seedManufactured,
  ...seedVegetables,
];
