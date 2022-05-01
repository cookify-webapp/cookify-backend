import axios from 'axios';
import process from 'process';

class NutritionDetailService {
  static getByIngredient = async (unit: string, ingredient: string) => {
    const res = await axios.post(
      `https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`,
      {
        ingr: [`${unit === 'gram' ? 100 : unit === 'milliliter' ? 10 : 1} ${unit} ${ingredient}`],
      }
    );
    if (res.status === 200) {
      return res.data;
    }
  };
}

export default NutritionDetailService;
