import express from 'express';
import { AuthRoutes } from './authRoutes';
import { ExternalServerRoutes } from './externalServerRoutes';
import { ArticleRoutes } from './articleRoutes';
import { SavedArticleRoutes } from './savedArticleRoutes';
import categoryRoutes from './categoryRoutes';
import { NotificationRoutes } from './notificationRoutes';

const apiRouter = express.Router();

apiRouter.use(new AuthRoutes().getRouter());
apiRouter.use(new ExternalServerRoutes().getRouter());
apiRouter.use(new ArticleRoutes().getRouter());
apiRouter.use(new SavedArticleRoutes().getRouter());
apiRouter.use(new NotificationRoutes().getRouter());
apiRouter.use(categoryRoutes);

export default apiRouter;
