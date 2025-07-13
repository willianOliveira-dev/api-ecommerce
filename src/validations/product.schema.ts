import Joi from 'joi';
import validationHelper from '@validations/validationHelper';

const product: Joi.Schema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'The name must be at least 3 characters long.',
        'any.required': 'Name is required.',
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description is required.',
    }),
    price_cents: Joi.number().min(0).required().messages({
        'number.min': 'The price cannot be negative.',
        'number.base': 'Price must be a number.',
        'any.required': 'The price is mandatory.',
    }),
    gender: Joi.string().valid('M', 'F').required().messages({
        'any.only': 'Gender must be M or F.',
        'any.required': 'Gender is required.',
    }),
    category: Joi.string().required().messages({
        'any.required': 'Category is required.',
    }),
});

export default validationHelper(product);
