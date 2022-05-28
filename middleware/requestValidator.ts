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

const paginateQuery = (extra: oJoi.PartialSchemaMap<any>) => ({
  page: Joi.number().required().min(1),
  perPage: Joi.number().required().min(1),
  ...extra,
});

const baseBody = (body: oJoi.PartialSchemaMap<any>) =>
  Joi.object().keys({
    data: Joi.object(body).required(),
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

//---------------------
//   QUERY
//---------------------
export const ingredientListValidator = celebrate(
  {
    [Segments.QUERY]: paginateQuery({
      searchWord: Joi.string().required().allow(''),
      type: Joi.string().required().custom(objectIdVal),
    }),
  },
  opts
);
