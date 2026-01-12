import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  PORT_ADMIN: Joi.number().optional(),

  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_TEMP_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required()
});
