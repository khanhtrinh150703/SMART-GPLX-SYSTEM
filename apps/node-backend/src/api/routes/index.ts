import { Router } from 'express';
import authRoutes from './auth.routes';
// import userRoutes from './user.routes'; // Giả sử bạn có module user

const rootRouter = Router();

rootRouter.use('/auth', authRoutes);
// rootRouter.use('/users', userRoutes);

export default rootRouter;