/**
 * Lectura del entorno.
 *
 * NO hay valores por defecto aquí: el esquema de `env.validation.ts` es la
 * única fuente de verdad y ya aplicó sus defaults antes de llegar a este
 * punto. Duplicarlos daría dos sitios donde cambiar lo mismo.
 */
export default () => ({
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV as string,
  frontendOrigin: process.env.FRONTEND_ORIGIN as string,

  database: {
    url: process.env.DATABASE_URL as string,
  },

  // El SDK @typesafe-ai/sdk lee TYPESAFE_* del entorno por su cuenta.
  jev: {
    baseUrl: process.env.TYPESAFE_BASE_URL as string,
    model: process.env.TYPESAFE_DEFAULT_MODEL as string,
  },

  llm: {
    apiUrl: process.env.OPENROUTER_API_URL as string,
    apiKey: process.env.OPENROUTER_API_KEY as string,
    model: process.env.OPENROUTER_MODEL as string,
    siteUrl: process.env.OPENROUTER_SITE_URL as string,
    siteName: process.env.OPENROUTER_SITE_NAME as string,
  },

  simulator: {
    enabled: process.env.SIMULATOR_ENABLED === 'true',
    createSeconds: Number(process.env.SIMULATOR_CREATE_SECONDS),
    advanceSeconds: Number(process.env.SIMULATOR_ADVANCE_SECONDS),
    seed: process.env.SIMULATOR_SEED || undefined,
  },
});
