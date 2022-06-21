import { celebrate, Joi, Segments } from 'celebrate';
import oJoi from 'joi';
import mongoose from 'mongoose';

import constraint from '@config/constraint';

const opts: oJoi.ValidationOptions = {
  stripUnknown: true,
  messages: { 'objectId.invalid': 'must be a valid ObjectId or hex string' },
  abortEarly: false,
  errors: {
    label: false,
    wrap: {
      label: false,
      string: "'",
    },
  },
};

const paginateQuery = (extra?: oJoi.PartialSchemaMap<any>) => ({
  page: Joi.number().required().integer().min(1),
  perPage: Joi.number().required().integer().min(1),
  ...extra,
});

const baseBody = (body: oJoi.PartialSchemaMap<any>) =>
  Joi.object().keys({
    data: Joi.object(body).required(),
  });

const commentBody = baseBody({
  comment: Joi.string()
    .required()
    .max(constraint.comment.max)
    .when('rating', {
      then: Joi.allow(''),
    }),
  rating: Joi.number().required().min(0).max(5),
});

//---------------------
//   VALIDATORS
//---------------------
const objectIdVal: oJoi.CustomValidator<any> = (value, helper) => {
  if (!mongoose.isObjectIdOrHexString(value)) return helper.error('objectId.invalid');
  return value;
};

//---------------------
//   BODY
//---------------------
export const loginValidator = celebrate(
  {
    [Segments.BODY]: baseBody({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  opts
);

export const registerValidator = celebrate(
  {
    [Segments.BODY]: baseBody({
      username: Joi.string().required().min(constraint.username.min).max(constraint.username.max),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(constraint.password.min).max(constraint.password.max),
      allergy: Joi.array().required().items(Joi.string().custom(objectIdVal)).unique(),
    }),
  },
  opts
);

export const ingredientValidator = celebrate(
  {
    [Segments.BODY]: baseBody({
      name: Joi.string().required(),
      queryKey: Joi.string().required(),
      unit: Joi.string().required().custom(objectIdVal),
      type: Joi.string().required().custom(objectIdVal),
      shopUrl: Joi.string().when('.', {
        then: Joi.string().required().uri(),
        otherwise: Joi.string().default(''),
      }),
    }),
  },
  opts
);

export const recipeValidator = celebrate(
  {
    [Segments.BODY]: baseBody({
      name: Joi.string().required(),
      desc: Joi.string().required().max(constraint.desc.max),
      method: Joi.string().required().custom(objectIdVal),
      serving: Joi.number().required().integer().min(1),
      ingredients: Joi.array()
        .required()
        .items(
          Joi.object({
            ingredient: Joi.string().required().custom(objectIdVal),
            quantity: Joi.number().required().positive(),
          })
        )
        .unique('ingredient')
        .min(1),
      subIngredients: Joi.array().required().items(Joi.string().custom(objectIdVal)),
      steps: Joi.array().required().items(Joi.string()).min(1),
    }),
  },
  opts
);

export const createCommentValidator = celebrate(
  {
    [Segments.PARAMS]: {
      sourceType: Joi.string().required().valid('recipe', 'snapshot'),
      sourceId: Joi.string().required().custom(objectIdVal),
    },
    [Segments.BODY]: commentBody,
  },
  opts
);

export const editCommentValidator = celebrate(
  {
    [Segments.PARAMS]: {
      commentId: Joi.string().required().custom(objectIdVal),
    },
    [Segments.BODY]: commentBody,
  },
  opts
);

//---------------------
//   QUERY
//---------------------
export const genericListValidator = celebrate(
  {
    [Segments.QUERY]: paginateQuery(),
  },
  opts
);

export const ingredientListValidator = celebrate(
  {
    [Segments.QUERY]: paginateQuery({
      searchWord: Joi.string().required().allow(''),
      typeId: Joi.string().required().allow('').custom(objectIdVal),
    }),
  },
  opts
);

export const recipeListValidator = celebrate(
  {
    [Segments.QUERY]: paginateQuery({
      searchWord: Joi.string().required().allow(''),
      ingredientId: Joi.when('.', {
        then: Joi.array().required().items(Joi.string().custom(objectIdVal)).unique().min(0),
        otherwise: Joi.string().valid(''),
      }),
      methodId: Joi.string().required().allow('').custom(objectIdVal),
    }),
  },
  opts
);
