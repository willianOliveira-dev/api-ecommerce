import BaseRepository from '@repository/BaseRepository';
export interface Customer {
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
}

export default class CustomerRepository extends BaseRepository {
    private _customerEntity: string = 'customers';

    constructor() {
        super();
    }

    public override async getAll<T = Customer>(): Promise<T[]> {
        return await super.getAll(this._customerEntity, [
            'customer_id',
            'first_name',
            'last_name',
            'email',
            'password_hash',
        ]);
    }

    public override async getById<T = Customer>(id: string): Promise<T> {
        return await super.getById(
            this._customerEntity,
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
            this._customerEntity,
            ['first_name', 'last_name', 'email', 'password_hash'],
            valuesArray
        );
    }

    public async updateCustomer<V, T = Customer>(
        valuesArray: V[],
        id: string
    ): Promise<T> {
        return await super.update(
            this._customerEntity,
            ['first_name', 'last_name', 'email', 'password_hash'],
            valuesArray,
            id
        );
    }

    public async deleteCustomer<T = Customer>(id: string): Promise<T> {
        return await super.delete(this._customerEntity, id);
    }
}
