import { celebrate, Joi, Segments } from 'celebrate';
import oJoi from 'joi';
import mongoose from 'mongoose';

const opts: oJoi.ValidationOptions = {
  stripUnknown: true,
  abortEarly: false,
  errors: {
    label: false,
    wrap: {
      label: false,
      string: "'",
    },
  },
};

const baseBody = (body: oJoi.PartialSchemaMap<any>, extra?: oJoi.PartialSchemaMap<any>) =>
  Joi.object().keys({
    data: Joi.object().required().keys(body),
    ...extra,
  });

//---------------------
//   VALIDATORS
//---------------------
const objectIdVal: oJoi.CustomValidator<any> = (value, helper) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    return helper.message({ custom: 'must be a valid ObjectId or hex string' });
  }
  return value;
};

//---------------------
//   MIDDLEWARE
//---------------------
export const tokenValidator = celebrate({
  [Segments.HEADERS]: Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .pattern(/^Bearer [\s\S]+$/),
    })
    .unknown(true),
});

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
      username: Joi.string().required().min(6).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(32),
      allergy: Joi.array().required().items(Joi.string().custom(objectIdVal)),
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
