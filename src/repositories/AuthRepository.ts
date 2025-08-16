import CustomerController, {
    type Customer,
} from 'repositories/CustomerRepository';

type AuthCustomer = Customer;

export default class AuthRepository {
    private static async authCustomers(): Promise<AuthCustomer[]> {
        const customer: CustomerController = new CustomerController();
        const customers: AuthCustomer[] = await customer.getAll();
        return customers;
    }
    public async findByEmail(email: string): Promise<AuthCustomer | null> {
        const customers = await AuthRepository.authCustomers();
        const customer = customers.find((customer) => customer.email === email);
        return customer || null;
    }
}
