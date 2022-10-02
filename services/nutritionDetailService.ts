import axios from 'axios';
import _ from 'lodash';
import process from 'process';

type ingredientNutritionList = {
  ENERC_KCAL: any;
  FAT: any;
  FASAT: any;
  FAMS: any;
  FAPU: any;
  CHOCDF: any;
  FIBTG: any;
  SUGAR: any;
  PROCNT: any;
  CHOLE: any;
  NA: any;
};

const url = 'https://api.edamam.com/api';

const getByIngredient = async (unit: string, ingredient: string) => {
  const res = await axios.get(
    `${url}/nutrition-data?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&ingr=${
      unit === 'gram' || unit === 'milliliter' ? 100 : 1
    } ${unit} ${ingredient}`
  );
  if (res.status === 200) {
    const data = res.data;

    data.totalNutrients = ((props: ingredientNutritionList) => ({ ...props }))(data.totalNutrients);

    delete data.uri;
    delete data.yield;
    delete data.dietLabels;
    delete data.healthLabels;
    delete data.cautions;

    return data;
  }
};

const getByRecipe = async (ingredients: { name: string; quantity: number; unit: string }[]) => {
  const res = await axios.post(
    `${url}/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`,
    { ingr: _.map(ingredients, (item) => `${item.quantity} ${item.unit} ${item.name}`) }
  );
  if (res.status === 200) {
    const data = res.data;

    data.totalNutrients = ((props: ingredientNutritionList) => ({ ...props }))(data.totalNutrients);

    delete data.uri;
    delete data.yield;
    delete data.dietLabels;
    delete data.healthLabels;
    delete data.cautions;

    return data;
  }
};

export default Object.freeze({ getByIngredient, getByRecipe });
