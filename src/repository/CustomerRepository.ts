import BaseRepository from '@repository/BaseRepository';

export default class CustomerRepository extends BaseRepository {
    public override async getAll(): Promise<any> {
        return await super.getAll('customers', [
            'customer_id',
            'first_name',
            'last_name',
            'email',
        ]);
    }

    public override async getById(id: string): Promise<any> {
        return await super.getById(
            'customers',
            ['customer_id', 'first_name', 'last_name', 'email'],
            id
        );
    }

    public async createCustomer(valuesArray: any[]): Promise<void> {
        await super.create(
            'customers',
            ['first_name', 'last_name', 'email', "password_hash"],
            valuesArray
        );
        return;
    }
}
