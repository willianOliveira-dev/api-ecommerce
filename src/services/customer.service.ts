import CustomerRepository from 'repositories/CustomerRepository';
import orderValuesArray from '@utils/orderValuesArray';
import updateData from '@utils/udpateData';
import bcrypt from 'bcrypt';

const customer = new CustomerRepository();

export default class CustomerService {
    async getAllCustomer() {
        return await customer.getAll();
    }

    async getByIdCustomer(id: string) {
        return await customer.getById(id);
    }

    async createCustomer(body: any) {
        // Nivel de complexidade ao criptografar a senha - tambem chamado de Custo computacional;
        const saltRounds: number = 10;
        const hashedPassword = await bcrypt.hash(
            body.password_hash as string,
            saltRounds
        );
        body.password_hash = hashedPassword;
        return await customer.createCustomer<unknown>(
            orderValuesArray(body, [
                'first_name',
                'last_name',
                'email',
                'password_hash',
            ])
        );
    }

    async updateCustomer(body: any, id: string) {
        const selectUser = await customer.getById(id);
        const updatedUser = updateData(selectUser, body);
        return await customer.updateCustomer<unknown>(
            orderValuesArray(updatedUser, [
                'first_name',
                'last_name',
                'email',
                'password_hash',
            ]),
            id
        );
    }

    async deleteCustomer(id: string) {
        return await customer.deleteCustomer(id);
    }
}
