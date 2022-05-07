import { Types } from 'mongoose';

const seedLegumes = [
  {
    _id: new Types.ObjectId('62740c111904d21ae9bd58fe'),
    name: 'ข้าว',
    queryKey: 'rice',
    type: new Types.ObjectId('6264265286380372ce46e81b'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: '',
    shopUrl: '',
    nutritionalDetail: {
      calories: 360,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 360, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 0.58, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 0.158, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 0.181, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 0.155, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 79.34, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 6.61, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 1, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 18, unit: '%' },
        FAT: { label: 'Fat', quantity: 0.8923076923076922, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 0.79, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 26.446666666666665, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 13.22, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: '%' },
        NA: { label: 'Sodium', quantity: 0.041666666666666664, unit: '%' },
        CA: { label: 'Calcium', quantity: 0.9, unit: '%' },
        MG: { label: 'Magnesium', quantity: 8.333333333333334, unit: '%' },
        K: { label: 'Potassium', quantity: 1.8297872340425532, unit: '%' },
        FE: { label: 'Iron', quantity: 4.444444444444445, unit: '%' },
        ZN: { label: 'Zinc', quantity: 10.545454545454545, unit: '%' },
        P: { label: 'Phosphorus', quantity: 15.428571428571429, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 5.833333333333334, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 3.692307692307692, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 10, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 11.153846153846152, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 2.25, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 0, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 359, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 27, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 5, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 327, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('62740c24826f1e1e2e2d8a71'),
    name: 'ข้าวเหนียว',
    queryKey: 'sticky rice',
    type: new Types.ObjectId('6264265286380372ce46e81b'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: '',
    shopUrl: '',
    nutritionalDetail: {
      calories: 360,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 360, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 0.58, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 0.158, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 0.181, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 0.155, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 79.34, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 6.61, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 1, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 18, unit: '%' },
        FAT: { label: 'Fat', quantity: 0.8923076923076922, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 0.79, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 26.446666666666665, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 13.22, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: '%' },
        NA: { label: 'Sodium', quantity: 0.041666666666666664, unit: '%' },
        CA: { label: 'Calcium', quantity: 0.9, unit: '%' },
        MG: { label: 'Magnesium', quantity: 8.333333333333334, unit: '%' },
        K: { label: 'Potassium', quantity: 1.8297872340425532, unit: '%' },
        FE: { label: 'Iron', quantity: 4.444444444444445, unit: '%' },
        ZN: { label: 'Zinc', quantity: 10.545454545454545, unit: '%' },
        P: { label: 'Phosphorus', quantity: 15.428571428571429, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 5.833333333333334, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 3.692307692307692, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 10, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 11.153846153846152, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 2.25, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 0, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 359, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 27, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 5, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 327, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('62740c29168d41d9cb076279'),
    name: 'เม็ดมะม่วงหิมพานต์',
    queryKey: 'cashew nut',
    type: new Types.ObjectId('6264265286380372ce46e81b'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: '',
    shopUrl: '',
    nutritionalDetail: {
      calories: 553,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 553, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 43.85, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 7.783, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 23.797, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 7.845, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 30.19, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 3.3, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 5.91, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 18.22, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 12, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 27.65, unit: '%' },
        FAT: { label: 'Fat', quantity: 67.46153846153847, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 38.915000000000006, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 10.063333333333333, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 13.2, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 36.44, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: '%' },
        NA: { label: 'Sodium', quantity: 0.5, unit: '%' },
        CA: { label: 'Calcium', quantity: 3.7, unit: '%' },
        MG: { label: 'Magnesium', quantity: 69.52380952380952, unit: '%' },
        K: { label: 'Potassium', quantity: 14.042553191489361, unit: '%' },
        FE: { label: 'Iron', quantity: 37.111111111111114, unit: '%' },
        ZN: { label: 'Zinc', quantity: 52.54545454545455, unit: '%' },
        P: { label: 'Phosphorus', quantity: 84.71428571428571, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 0, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0.5555555555555556, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 35.25, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 4.461538461538462, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 6.6375, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 32.07692307692307, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 6.25, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 0, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 6, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 28.416666666666668, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 554, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 69, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 371, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 114, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('62740c2d92f71ef4bac9cbca'),
    name: 'งา',
    queryKey: 'sesame',
    type: new Types.ObjectId('6264265286380372ce46e81b'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: '',
    shopUrl: '',
    nutritionalDetail: {
      calories: 573,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 573, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 49.67, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 6.957, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 18.759, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 21.773, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 23.45, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 11.8, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 0.3, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 17.73, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 11, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 28.65, unit: '%' },
        FAT: { label: 'Fat', quantity: 76.41538461538461, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 34.785, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 7.816666666666666, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 47.2, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 35.46, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: '%' },
        NA: { label: 'Sodium', quantity: 0.4583333333333333, unit: '%' },
        CA: { label: 'Calcium', quantity: 97.5, unit: '%' },
        MG: { label: 'Magnesium', quantity: 83.57142857142857, unit: '%' },
        K: { label: 'Potassium', quantity: 9.957446808510639, unit: '%' },
        FE: { label: 'Iron', quantity: 80.83333333333333, unit: '%' },
        ZN: { label: 'Zinc', quantity: 70.45454545454545, unit: '%' },
        P: { label: 'Phosphorus', quantity: 89.85714285714286, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 0, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 65.91666666666667, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 19, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 28.218749999999996, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 60.76923076923077, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 24.25, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 0, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 1.6666666666666667, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 0, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 573, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 66, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 419, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 88, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('62740c3161e1c8a3d9925802'),
    name: 'อัลมอนด์',
    queryKey: 'almond',
    type: new Types.ObjectId('6264265286380372ce46e81b'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: '',
    shopUrl: '',
    nutritionalDetail: {
      calories: 579,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 579, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 49.93, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 3.802, unit: 'g' },
        FATRN: { label: 'Fatty acids, total trans', quantity: 0.015, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 31.551, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 12.329, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 21.55, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 12.5, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 4.35, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 21.15, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 1, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 28.95, unit: '%' },
        FAT: { label: 'Fat', quantity: 76.81538461538462, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 19.009999999999998, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 7.183333333333334, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 50, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 42.3, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 0, unit: '%' },
        NA: { label: 'Sodium', quantity: 0.041666666666666664, unit: '%' },
        CA: { label: 'Calcium', quantity: 26.9, unit: '%' },
        MG: { label: 'Magnesium', quantity: 64.28571428571429, unit: '%' },
        K: { label: 'Potassium', quantity: 15.595744680851064, unit: '%' },
        FE: { label: 'Iron', quantity: 20.61111111111111, unit: '%' },
        ZN: { label: 'Zinc', quantity: 28.363636363636363, unit: '%' },
        P: { label: 'Phosphorus', quantity: 68.71428571428571, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 0, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 17.083333333333336, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 87.53846153846152, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 22.6125, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 10.538461538461538, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 11, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 0, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 170.86666666666667, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 0, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 579, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 79, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 420, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 80, unit: 'kcal' },
      },
    },
  },
];

export default seedLegumes;
