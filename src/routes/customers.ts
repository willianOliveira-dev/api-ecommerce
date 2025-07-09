import { Router, Request, Response } from 'express';
import BaseRepository from '@repository/BaseRepository';
const router: Router = Router();

router.route('/').get(async (req: Request, res: Response) =>  {
    const result = (await new BaseRepository().getAll('customers'));
    res.status(200).send(result) 
});

export default router;
