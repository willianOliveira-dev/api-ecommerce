import { Request, Response } from 'express';
import AuthService from '@service/auth.service';

export default class AuthController {
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password_hash } = req.body;
        const authService = new AuthService();
        const token = await authService.loginService(email, password_hash);
        res.status(200).json({
            token,
        });
    }
}
