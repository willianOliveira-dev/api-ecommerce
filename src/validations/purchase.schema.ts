import Joi from 'joi';

const purchaseSchema: Joi.ObjectSchema = Joi.object({
    purchase_date: Joi.date().iso().messages({
        'date.base': 'Purchase date must be a valid date.',
        'date.format': 'Purchase date must be in ISO format (YYYY-MM-DD).',
    }),
    
    products: Joi.array().items(
        Joi.object({
            product_id: Joi.string().uuid().required().messages({
                'string.base': 'Product ID must be a text.',
                'string.guid': 'Product ID must be a valid UUID.',
                'any.required': 'Product ID is required.',
            }),
            product_amount: Joi.number().integer().min(1).required().messages({
                'number.base': 'Quantity must be a number.',
                'number.integer': 'Quantity must be an integer.',
                'number.min': 'Minimum quantity is 1.',
                'any.required': 'Quantity is required.',
            }),
            price_cents: Joi.number().min(0).required().messages({
                'number.min': 'The price cannot be negative.',
                'number.base': 'Price must be a number.',
                'any.required': 'The price is mandatory.',
            }),
        })
            .min(1)
            .messages({
                'array.base': 'Products must be an array.',
                'array.min': 'You must purchase at least one product.',
                'any.required': 'Products list is required.',
            })
    ),
    delivery_address: Joi.string().min(5).required().messages({
        'string.base': 'Delivery address must be a text.',
        'string.empty': 'Delivery address cannot be empty.',
        'string.min': 'Delivery address must be at least 5 characters long.',
        'any.required': 'Delivery address is required.',
    }),

    status: Joi.string()
        .valid('confirmed', 'cancelled')
        .default('confirmed')
        .messages({
            'string.base': 'Status must be a text.',
            'any.only': 'Status must be either "confirmed" or "cancelled".',
        }),
});

export default purchaseSchema;
