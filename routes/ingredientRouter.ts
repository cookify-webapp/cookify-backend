import express from 'express';

import {
  createIngredient,
  deleteIngredient,
  editIngredient,
  getIngredientDetail,
  getIngredientList,
  getIngredientTypes,
  sampleByType,
} from '@controllers/ingredientsController';
import { adminAuth } from '@middleware/auth';
import imageUtil from '@utils/imageUtil';

const ingredientRouter = express.Router();

ingredientRouter.get('/list', getIngredientList);

ingredientRouter.get('/types', getIngredientTypes);

ingredientRouter.get('/sample', sampleByType);

ingredientRouter.get('/:ingredientId', getIngredientDetail);

ingredientRouter.post('/create', adminAuth, imageUtil.single('ingredientImage'), createIngredient);

ingredientRouter.put('/:ingredientId/edit', adminAuth, imageUtil.single('ingredientImage'), editIngredient);

ingredientRouter.delete('/:ingredientId/delete', adminAuth, deleteIngredient);

export default ingredientRouter;
