import Joi from 'joi';

/**
 * Esquema de validación de variables de entorno.
 * Si falta una variable obligatoria, la aplicación no arranca.
 */
export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  FRONTEND_ORIGIN: Joi.string().uri().default('http://localhost:4200'),

  DATABASE_URL: Joi.string().required(),

  TYPESAFE_API_KEY: Joi.string().allow('').default(''),
  TYPESAFE_DEFAULT_MODEL: Joi.string().default('jev-latest'),
  TYPESAFE_BASE_URL: Joi.string().uri().default('https://api.typesafe.ai'),

  OPENROUTER_API_URL: Joi.string()
    .uri()
    .default('https://openrouter.ai/api/v1/chat/completions'),
  OPENROUTER_API_KEY: Joi.string().allow('').default(''),
  OPENROUTER_MODEL: Joi.string().default('provider/model-id'),

  SIMULATOR_ENABLED: Joi.boolean().default(true),
  SIMULATOR_CREATE_SECONDS: Joi.number().min(5).default(45),
  SIMULATOR_ADVANCE_SECONDS: Joi.number().min(1).default(1),
  SIMULATOR_SEED: Joi.string().allow('').default(''),
});
