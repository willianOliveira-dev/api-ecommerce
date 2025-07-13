import Joi from 'joi';

export default function validationHelper(schema: Joi.Schema) {
    return function validateInfo<T>(body: T): Joi.ValidationResult {
        return schema.validate(body, { abortEarly: false });
    };
}
