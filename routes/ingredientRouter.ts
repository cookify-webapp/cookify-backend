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
import { ingredientValidator, tokenValidator } from '@middleware/requestValidator';
import bodyParser from '../middleware/bodyParser';

const ingredientRouter = express.Router();

ingredientRouter.get('/list', getIngredientList);

ingredientRouter.get('/types', getIngredientTypes);

ingredientRouter.get('/units', getUnits);

ingredientRouter.get('/:ingredientId', getIngredientDetail);

ingredientRouter.get('/:ingredientId/sample', sampleByType);

ingredientRouter.post(
  '/create',
  tokenValidator,
  adminAuth,
  imageUtil.single('ingredientImage'),
  bodyParser,
  ingredientValidator,
  createIngredient
);

ingredientRouter.put(
  '/:ingredientId/edit',
  tokenValidator,
  adminAuth,
  imageUtil.single('ingredientImage'),
  bodyParser,
  ingredientValidator,
  editIngredient
);

ingredientRouter.delete('/:ingredientId/delete', tokenValidator, adminAuth, deleteIngredient);

export default ingredientRouter;
