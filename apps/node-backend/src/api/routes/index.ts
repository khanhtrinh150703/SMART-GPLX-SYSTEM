import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes'; 
import licenseRoutes from './license-category.routes'; 

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/license-categories', licenseRoutes);

export default rootRouter;