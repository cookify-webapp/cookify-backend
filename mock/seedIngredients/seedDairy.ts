import { Types } from 'mongoose';

export default [
  {
    _id: new Types.ObjectId('6274025c19cfa624be5dfb36'),
    name: 'ไข่ไก่',
    queryKey: 'egg',
    type: new Types.ObjectId('62642648a293bd52a72832e0'),
    unit: new Types.ObjectId('626d47bf130242373ba8d680'),
    image: 'e7a477885742d8ff.jpg',
    shopUrl: '',
    nutritionalDetail: {
      calories: 61,
      totalWeight: 43,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 61.49, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 4.0893, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 1.34418, unit: 'g' },
        FATRN: { label: 'Fatty acids, total trans', quantity: 0.01634, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 1.57294, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 0.82173, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 0.3096, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 0, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 0.1591, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 5.4008, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 159.96, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 61.06, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 3.0745, unit: '%' },
        FAT: { label: 'Fat', quantity: 6.2912307692307685, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 6.7209, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 0.10319999999999999, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 0, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 10.8016, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 53.32, unit: '%' },
        NA: { label: 'Sodium', quantity: 2.5441666666666665, unit: '%' },
        CA: { label: 'Calcium', quantity: 2.408, unit: '%' },
        MG: { label: 'Magnesium', quantity: 1.2285714285714286, unit: '%' },
        K: { label: 'Potassium', quantity: 1.2625531914893617, unit: '%' },
        FE: { label: 'Iron', quantity: 4.180555555555555, unit: '%' },
        ZN: { label: 'Zinc', quantity: 5.042727272727273, unit: '%' },
        P: { label: 'Phosphorus', quantity: 12.162857142857144, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 7.644444444444445, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 1.4333333333333333, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 15.116153846153848, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 0.2015625, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 5.623076923076923, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 5.0525, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 15.945833333333333, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 5.733333333333333, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 3.01, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 0.1075, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 61, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 22, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 38, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 1, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('6274026112f173bfee43bcca'),
    name: 'นม',
    queryKey: 'whole milk',
    type: new Types.ObjectId('62642648a293bd52a72832e0'),
    unit: new Types.ObjectId('626d47a2d94a44efb5ab6ab6'),
    image: '66878f069c6d21e4.jpg',
    shopUrl: '',
    nutritionalDetail: {
      calories: 6,
      totalWeight: 10.313276924062114,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 6.29109892367789, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 0.33518150003201874, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 0.19234261463375843, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 0.08374380862338437, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 0.020110890001921126, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 0.4950372923549815, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 0, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 0.5208204846651368, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 0.3248682231079566, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 1.0313276924062116, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 4.434709077346709, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 0.31455494618389446, unit: '%' },
        FAT: { label: 'Fat', quantity: 0.5156638462031058, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 0.9617130731687922, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 0.16501243078499384, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 0, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 0.6497364462159132, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 0.3437758974687372, unit: '%' },
        NA: { label: 'Sodium', quantity: 0.1847795448894462, unit: '%' },
        CA: { label: 'Calcium', quantity: 1.165400292419019, unit: '%' },
        MG: { label: 'Magnesium', quantity: 0.24555421247766943, unit: '%' },
        K: { label: 'Potassium', quantity: 0.28964947956940407, unit: '%' },
        FE: { label: 'Iron', quantity: 0.017188794873436858, unit: '%' },
        ZN: { label: 'Zinc', quantity: 0.34690113290027114, unit: '%' },
        P: { label: 'Phosphorus', quantity: 1.2375932308874538, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 0.527123042785397, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 0.39534228208904776, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 1.340726000128075, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 0.057367602890095515, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 0.28559843789710465, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 0.12891596155077645, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 1.9337394232616465, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0.8938173334187166, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 0.04812862564562321, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 0.025783192310155287, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 6, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 1, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 3, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 2, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('627402644a09d9ec3c7daf25'),
    name: 'นมข้นหวาน',
    queryKey: 'sweetened condensed milk',
    type: new Types.ObjectId('62642648a293bd52a72832e0'),
    unit: new Types.ObjectId('626d47a5f4bb34e56d6b05d6'),
    image: '65be11a1e59f7f90.jpg',
    shopUrl: '',
    nutritionalDetail: {
      calories: 61,
      totalWeight: 19.09999999967708,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 61.31099999896343, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 1.661699999971906, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 1.0478259999822845, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 0.46355699999216277, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 0.06436699999891177, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 10.390399999824332, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 0, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 10.390399999824332, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 1.510809999974457, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 6.493999999890208, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 24.256999999589894, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 3.0655499999481717, unit: '%' },
        FAT: { label: 'Fat', quantity: 2.5564615384183167, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 5.239129999911422, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 3.463466666608111, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 0, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 3.021619999948914, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 2.1646666666300693, unit: '%' },
        NA: { label: 'Sodium', quantity: 1.0107083333162457, unit: '%' },
        CA: { label: 'Calcium', quantity: 5.424399999908291, unit: '%' },
        MG: { label: 'Magnesium', quantity: 1.182380952360962, unit: '%' },
        K: { label: 'Potassium', quantity: 1.50768085103834, unit: '%' },
        FE: { label: 'Iron', quantity: 0.2016111111077025, unit: '%' },
        ZN: { label: 'Zinc', quantity: 1.632181818154223, unit: '%' },
        P: { label: 'Phosphorus', quantity: 6.903285714169002, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 1.5704444444178933, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0.551777777768449, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 1.432499999975781, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 6.111999999896666, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 0.2506874999957617, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 0.7493076922950238, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 0.5252499999911198, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 3.5016666666074654, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 0.2546666666623611, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 0.20373333332988885, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 0.09549999999838539, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 62, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 6, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 15, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 41, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('62740267364504c0f3e077f7'),
    name: 'เนยเค็ม',
    queryKey: 'salted butter',
    type: new Types.ObjectId('62642648a293bd52a72832e0'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: '3db1eb4d2426196d.jpg',
    shopUrl: '',
    nutritionalDetail: {
      calories: 717,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 717, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 81.11, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 51.368, unit: 'g' },
        FATRN: { label: 'Fatty acids, total trans', quantity: 3.278, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 21.021, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 3.043, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 0.06, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 0, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 0.06, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 0.85, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 215, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 643, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 35.85, unit: '%' },
        FAT: { label: 'Fat', quantity: 124.78461538461538, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 256.84000000000003, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 0.02, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 0, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 1.7, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 71.66666666666667, unit: '%' },
        NA: { label: 'Sodium', quantity: 26.791666666666668, unit: '%' },
        CA: { label: 'Calcium', quantity: 2.4, unit: '%' },
        MG: { label: 'Magnesium', quantity: 0.47619047619047616, unit: '%' },
        K: { label: 'Potassium', quantity: 0.5106382978723404, unit: '%' },
        FE: { label: 'Iron', quantity: 0.1111111111111111, unit: '%' },
        ZN: { label: 'Zinc', quantity: 0.8181818181818182, unit: '%' },
        P: { label: 'Phosphorus', quantity: 3.4285714285714284, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 76, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 0.4166666666666667, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 2.6153846153846154, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 0.2625, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 0.23076923076923075, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 0.75, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 7.083333333333334, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 10, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 15.466666666666665, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 5.833333333333333, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 716, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 3, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 713, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 0, unit: 'kcal' },
      },
    },
  },
  {
    _id: new Types.ObjectId('6274026b4ad4fb701d8c7481'),
    name: 'เนยแข็ง',
    queryKey: 'cheese',
    type: new Types.ObjectId('62642648a293bd52a72832e0'),
    unit: new Types.ObjectId('626d479e5b4bfde4d83361b9'),
    image: 'c40bbc652436e8d4.jpg',
    shopUrl: '',
    nutritionalDetail: {
      calories: 406,
      totalWeight: 100,
      totalNutrients: {
        ENERC_KCAL: { label: 'Energy', quantity: 406, unit: 'kcal' },
        FAT: { label: 'Total lipid (fat)', quantity: 33.82, unit: 'g' },
        FASAT: { label: 'Fatty acids, total saturated', quantity: 19.368, unit: 'g' },
        FATRN: { label: 'Fatty acids, total trans', quantity: 1.179, unit: 'g' },
        FAMS: { label: 'Fatty acids, total monounsaturated', quantity: 8.428, unit: 'g' },
        FAPU: { label: 'Fatty acids, total polyunsaturated', quantity: 1.433, unit: 'g' },
        CHOCDF: { label: 'Carbohydrate, by difference', quantity: 1.33, unit: 'g' },
        FIBTG: { label: 'Fiber, total dietary', quantity: 0, unit: 'g' },
        SUGAR: { label: 'Sugars, total', quantity: 0.28, unit: 'g' },
        PROCNT: { label: 'Protein', quantity: 24.04, unit: 'g' },
        CHOLE: { label: 'Cholesterol', quantity: 102, unit: 'mg' },
        NA: { label: 'Sodium, Na', quantity: 644, unit: 'mg' },
      },
      totalDaily: {
        ENERC_KCAL: { label: 'Energy', quantity: 20.3, unit: '%' },
        FAT: { label: 'Fat', quantity: 52.03076923076923, unit: '%' },
        FASAT: { label: 'Saturated', quantity: 96.84, unit: '%' },
        CHOCDF: { label: 'Carbs', quantity: 0.44333333333333336, unit: '%' },
        FIBTG: { label: 'Fiber', quantity: 0, unit: '%' },
        PROCNT: { label: 'Protein', quantity: 48.08, unit: '%' },
        CHOLE: { label: 'Cholesterol', quantity: 34, unit: '%' },
        NA: { label: 'Sodium', quantity: 26.833333333333332, unit: '%' },
        CA: { label: 'Calcium', quantity: 67.5, unit: '%' },
        MG: { label: 'Magnesium', quantity: 6.428571428571429, unit: '%' },
        K: { label: 'Potassium', quantity: 1.6170212765957446, unit: '%' },
        FE: { label: 'Iron', quantity: 0.8888888888888888, unit: '%' },
        ZN: { label: 'Zinc', quantity: 31.181818181818183, unit: '%' },
        P: { label: 'Phosphorus', quantity: 67.57142857142857, unit: '%' },
        VITA_RAE: { label: 'Vitamin A', quantity: 29.22222222222222, unit: '%' },
        VITC: { label: 'Vitamin C', quantity: 0, unit: '%' },
        THIA: { label: 'Thiamin (B1)', quantity: 2.2500000000000004, unit: '%' },
        RIBF: { label: 'Riboflavin (B2)', quantity: 33.38461538461538, unit: '%' },
        NIA: { label: 'Niacin (B3)', quantity: 0.24375, unit: '%' },
        VITB6A: { label: 'Vitamin B6', quantity: 3.769230769230769, unit: '%' },
        FOLDFE: { label: 'Folate equivalent (total)', quantity: 6.5, unit: '%' },
        VITB12: { label: 'Vitamin B12', quantity: 36.66666666666667, unit: '%' },
        VITD: { label: 'Vitamin D', quantity: 4, unit: '%' },
        TOCPHA: { label: 'Vitamin E', quantity: 5.2, unit: '%' },
        VITK1: { label: 'Vitamin K', quantity: 2.4166666666666665, unit: '%' },
      },
      totalNutrientsKCal: {
        ENERC_KCAL: { label: 'Energy', quantity: 405, unit: 'kcal' },
        PROCNT_KCAL: { label: 'Calories from protein', quantity: 96, unit: 'kcal' },
        FAT_KCAL: { label: 'Calories from fat', quantity: 304, unit: 'kcal' },
        CHOCDF_KCAL: { label: 'Calories from carbohydrates', quantity: 5, unit: 'kcal' },
      },
    },
  },
];
