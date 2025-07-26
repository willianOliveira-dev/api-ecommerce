import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import AuthRepository from '@repository/AuthRepository';

export default class AuthService {
    public async loginService(
        email: string,
        password_hash: string
    ): Promise<string> {
        const auth: AuthRepository = new AuthRepository();
        const customer =
            (await auth.findByEmail(email)) ?? new Error('User not found!');
        if (customer instanceof Error) throw customer;
        const passwordValid = await bycrypt.compare(
            password_hash,
            customer.password_hash
        );
        if (!passwordValid) throw new Error('Invalid password');
        const token = jwt.sign(
            { id: customer.customer_id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );
        return token;
    }
}
