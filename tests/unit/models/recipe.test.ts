import { Recipe } from '@models/recipe';

const recipeData = {
  name: 'สเต็กริบอายซอสพริกไทยดำ',
  desc: 'สเต็กริบอายสูตรเฉพาะของไรเดน โชกุน อร่อยที่สุดในเมืองอินาซุมะ คุโจว ซาระลองชิม แล้วถึงกับต้องขอเพิ่ม...',
  method: '6264263d50eda11fe1a2b8f4',
  serving: 1,
  ingredients: [
    { ingredient: '6264263d50eda11fe1a2b8f4', quantity: 50, unit: '6264263d50eda11fe1a2b8f4' },
    { ingredient: '6264263d50eda11fe1a2b8f5', quantity: 20, unit: '6264263d50eda11fe1a2b8f4' },
  ],
  subIngredients: [],
  steps: ['Cut', 'Grill'],
  author: '6264263d50eda11fe1a2b8f6',
  image: 'image',
};

describe('Recipe model', () => {
  it('should be able to create a valid recipe', async () => {
    const validRecipe = new Recipe(recipeData);
    const savedRecipe = await validRecipe.save();

    // Test insert
    expect(savedRecipe.id).toBeDefined();
    expect(savedRecipe.name).toStrictEqual(recipeData.name);
    expect(savedRecipe.desc).toStrictEqual(recipeData.desc);
    expect(savedRecipe.method.toString()).toStrictEqual(recipeData.method);
    savedRecipe.ingredients.forEach((item, index) => {
      expect(item.ingredient.toString()).toStrictEqual(recipeData.ingredients[index].ingredient);
      expect(item.quantity).toStrictEqual(recipeData.ingredients[index].quantity);
    });
    expect(savedRecipe.subIngredients).toStrictEqual(recipeData.subIngredients);
    expect(savedRecipe.serving).toStrictEqual(recipeData.serving);
    expect(savedRecipe.serving).toStrictEqual(recipeData.serving);
    expect(savedRecipe.author.toString()).toStrictEqual(recipeData.author);
    expect(savedRecipe.image).toStrictEqual(recipeData.image);
  });

  it('should not allow insertion without required fields', async () => {
    const invalidRecipe = new Recipe({});

    await expect(invalidRecipe.save()).rejects.toThrow('is required');
  });

  it('should paginate', async () => {
    const recipe = new Recipe(recipeData);
    const savedRecipe = await recipe.save();
    const foundRecipe = await Recipe.listRecipe(
      1,
      10,
      '',
      '',
      ['6264263d50eda11fe1a2b8f4', '6264263d50eda11fe1a2b8f5'],
      []
    );

    expect(foundRecipe.totalDocs).toStrictEqual(1);
    expect(foundRecipe.docs[0]._id.toString()).toStrictEqual(savedRecipe.id);
    expect(foundRecipe.page).toStrictEqual(1);
    expect(foundRecipe.limit).toStrictEqual(10);
    expect(foundRecipe.totalPages).toStrictEqual(1);
  });
});
