import { describe, it, expect } from '@jest/globals';

import '@models/unit';
import { Recipe } from '@models/recipe';

const ingredientData = {
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

describe('Ingredient model', () => {
  it('should be able to create a valid ingredient', async () => {
    const validRecipe = new Recipe(ingredientData);
    const savedRecipe = await validRecipe.save();

    // Test insert
    expect(savedRecipe.id).toBeDefined();
    expect(savedRecipe.name).toStrictEqual(ingredientData.name);
    expect(savedRecipe.desc).toStrictEqual(ingredientData.desc);
    expect(savedRecipe.method.toString()).toStrictEqual(ingredientData.method);
    savedRecipe.ingredients.forEach((item, index) => {
      expect(item.ingredient.toString()).toStrictEqual(ingredientData.ingredients[index].ingredient);
      expect(item.quantity).toStrictEqual(ingredientData.ingredients[index].quantity);
    });
    expect(savedRecipe.subIngredients).toStrictEqual(ingredientData.subIngredients);
    expect(savedRecipe.serving).toStrictEqual(ingredientData.serving);
    expect(savedRecipe.serving).toStrictEqual(ingredientData.serving);
    expect(savedRecipe.author.toString()).toStrictEqual(ingredientData.author);
    expect(savedRecipe.image).toStrictEqual(ingredientData.image);
  });

  it('should not allow insertion without required fields', async () => {
    const invalidRecipe = new Recipe({});

    await expect(invalidRecipe.save()).rejects.toThrow('is required');
  });

  it('should paginate', async () => {
    const recipe = new Recipe(ingredientData);
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
