import BaseRepository from '@repository/BaseRepository';
export interface Customer {
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
}

export default class CustomerRepository extends BaseRepository {
    private customerEntity: string = 'customers';

    public override async getAll<T = Customer>(): Promise<T[]> {
        return await super.getAll(this.customerEntity, [
            'customer_id',
            'first_name',
            'last_name',
            'email',
            'password_hash',
        ]);
    }

    public override async getById<T = Customer>(id: string): Promise<T> {
        return await super.getById(
            this.customerEntity,
            [
                'customer_id',
                'first_name',
                'last_name',
                'email',
                'password_hash',
            ],
            id
        );
    }

    public async createCustomer<V, T = Customer>(valuesArray: V[]): Promise<T> {
        return await super.create(
            this.customerEntity,
            ['first_name', 'last_name', 'email', 'password_hash'],
            valuesArray
        );
    }

    public async updateCustomer<V, T = Customer>(
        valuesArray: V[],
        id: string
    ): Promise<T> {
        return await super.update(
            this.customerEntity,
            ['first_name', 'last_name', 'email', 'password_hash'],
            valuesArray,
            id
        );
    }

    public async deleteCustomer<T = Customer>(id: string): Promise<T> {
        return await super.delete(this.customerEntity, id);
    }
}
