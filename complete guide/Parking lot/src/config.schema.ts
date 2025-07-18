import * as joi from 'joi';
export const configValidationSchema = joi.object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().default(5432),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    JWT_SECRET: joi.string().required(),
});