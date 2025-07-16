import Joi from 'joi';

const customerSchema: Joi.ObjectSchema = Joi.object({
    first_name: Joi.string().min(3).max(100).required().messages({
        'string.min': 'The name must have at least 3 characters',
        'string.max': 'The name must have a maximum of 100 characters',
        'any.required': 'Name is required.',
    }),
    last_name: Joi.string().min(3).max(100).required().messages({
        'string.min': 'The name must have at least 3 characters',
        'string.max': 'The name must have a maximum of 100 characters',
        'any.required': 'Surname is required.',
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'The email field is required.',
        }),
    password_hash: Joi.string()
        .pattern(
            new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$')
        )
        .required()
        .messages({
            'string.pattern.base':
                'The password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters.',
            'any.required': 'The password field is required.',
        }),
});

export default customerSchema;
