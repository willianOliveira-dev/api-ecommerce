import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de E-commerce',
        version: '1.0.0',
        description: 'Documentação da API do sistema de e-commerce',
    },
    servers: [
        {
            url: 'http://localhost:8080',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
