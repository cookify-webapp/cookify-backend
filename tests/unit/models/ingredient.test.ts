import { Types } from 'mongoose';
import _ from 'lodash';
import { describe, it, expect } from '@jest/globals';

import { Ingredient } from '@models/ingredient';
import { IngredientType } from '@models/type';
import '@models/unit';

const ingredientData = {
  name: 'ผักกาดขาว',
  queryKey: 'lettuce',
  unit: '626d479e5b4bfde4d83361b9',
  type: '6264263d50eda11fe1a2b8f4',
  image: 'image.jpeg',
};

describe('Ingredient model', () => {
  it('should be able to create a valid ingredient', async () => {
    const validIngredient = new Ingredient(ingredientData);
    const savedIngredient = await validIngredient.save();

    // Test insert
    expect(savedIngredient.id).toBeDefined();
    expect(savedIngredient.name).toStrictEqual(ingredientData.name);
    expect(savedIngredient.queryKey).toStrictEqual(ingredientData.queryKey);
    expect(savedIngredient.unit.toString()).toStrictEqual(ingredientData.unit);
    expect(savedIngredient.type.toString()).toStrictEqual(ingredientData.type);
    expect(savedIngredient.image).toStrictEqual(ingredientData.image);
    // Test defaults
    expect(savedIngredient.shopUrl).toStrictEqual('');
  });

  it('should not allow insertion without required fields', async () => {
    const invalidIngredient = new Ingredient({});

    await expect(invalidIngredient.save()).rejects.toThrow('is required');
  });

  it('should validate unique fields', async () => {
    const ingredient = new Ingredient(ingredientData);
    const ingredientDup = new Ingredient(ingredientData);
    await ingredient.save();

    await expect(ingredientDup.save()).rejects.toThrow(
      /(?=.*Expected name to be unique)(?=.*Expected queryKey to be unique)/
    );
  });

  it('should paginate', async () => {
    const ingredient = new Ingredient(ingredientData);
    const savedIngredient = await ingredient.save();
    const foundIngredient = await Ingredient.listAll(1, 10, '', '6264263d50eda11fe1a2b8f4');

    expect(foundIngredient.totalDocs).toStrictEqual(1);
    expect(foundIngredient.docs[0].id).toStrictEqual(savedIngredient.id);
    expect(foundIngredient.page).toStrictEqual(1);
    expect(foundIngredient.limit).toStrictEqual(10);
    expect(foundIngredient.totalPages).toStrictEqual(1);
  });

  it('should sample by type correctly', async () => {
    const ingredient1 = new Ingredient(ingredientData);
    const ingredient2 = new Ingredient({ ...ingredientData, name: 'something else', queryKey: 'something else' });
    const type = new IngredientType({ _id: ingredientData.type, name: 'some type' });

    await type.save();
    const savedIngredient1 = await ingredient1.save();
    const foundIngredient1 = await Ingredient.sampleByType(savedIngredient1.id);

    expect(_.size(foundIngredient1)).toStrictEqual(0);

    const savedIngredient2 = await ingredient2.save();
    const foundIngredient2 = await Ingredient.sampleByType(savedIngredient1.id);

    expect(_.size(foundIngredient2)).toStrictEqual(1);
    expect(foundIngredient2[0]._id.toString()).toStrictEqual(savedIngredient2.id);

    await expect(Ingredient.sampleByType(new Types.ObjectId().toString())).rejects.toThrow('No documents found');
  });
});
