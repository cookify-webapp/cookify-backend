import axios from 'axios';
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

class NutritionDetailService {
  static url = 'https://api.edamam.com/api/nutrition-data';

  static getByIngredient = async (unit: string, ingredient: string) => {
    const res = await axios.get(
      `${this.url}?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}&ingr${
        unit === 'gram' ? 100 : unit === 'milliliter' ? 10 : 1
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
}

export default NutritionDetailService;
