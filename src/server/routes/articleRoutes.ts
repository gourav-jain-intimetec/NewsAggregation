import express from 'express';
import { ArticleRepository } from '../repositories/articleRepository';
import { ArticleService, IArticleService } from '../services/articleService';
import { ArticleController } from '../controllers/articleController';
import { IRouteModule } from './IRouteModule';
import { PersonalizedArticleRepository } from '../repositories/personalizedArticleRepository';
import { PersonalizedArticleService } from '../services/personalizedArticleService';

export class ArticleRoutes implements IRouteModule {
    private router = express.Router();

    constructor() {
        const articleRepository = new ArticleRepository();
        const personalizedRepository = new PersonalizedArticleRepository(articleRepository);

        const articleService = new ArticleService(articleRepository);
        const personalizedArticleService = new PersonalizedArticleService(personalizedRepository);
        const controller = new ArticleController(personalizedArticleService);
        this.router.use('/news', controller.router);
    }

    getRouter() {
        return this.router;
    }
}
