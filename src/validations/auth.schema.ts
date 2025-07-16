import Joi from 'joi';

const authSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'The email field is required.',
    }),
    password_hash: Joi.string().required().messages({
        'any.required': 'The password field is required.',
    }),
});

export default authSchema;
