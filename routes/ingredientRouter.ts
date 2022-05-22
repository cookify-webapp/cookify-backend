import express from 'express';

import {
  createIngredient,
  deleteIngredient,
  editIngredient,
  getIngredientDetail,
  getIngredientList,
  getIngredientTypes,
  getUnits,
  sampleByType,
} from '@controllers/ingredientsController';
import { adminAuth } from '@middleware/auth';
import imageUtil from '@utils/imageUtil';
import { ingredientValidator, ingredientListValidator } from '@middleware/requestValidator';
import bodyParser from '@middleware/bodyParser';

const middleware = [adminAuth, imageUtil.single('ingredientImage'), bodyParser, ingredientValidator];

const ingredientRouter = express.Router();

ingredientRouter.get('/list', ingredientListValidator, getIngredientList);

ingredientRouter.get('/types', getIngredientTypes);

ingredientRouter.get('/units', getUnits);

ingredientRouter.get('/:ingredientId', getIngredientDetail);

ingredientRouter.get('/:ingredientId/sample', sampleByType);

ingredientRouter.post('/create', middleware, createIngredient);

ingredientRouter.put('/:ingredientId/edit', middleware, editIngredient);

ingredientRouter.delete('/:ingredientId/delete', adminAuth, deleteIngredient);

export default ingredientRouter;
