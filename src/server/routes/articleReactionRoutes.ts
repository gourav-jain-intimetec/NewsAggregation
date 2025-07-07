import express from 'express';
import { ArticleReactionController } from '../controllers/articleReactionController';
import { ArticleReactionService, IArticleReactionService } from '../services/articleReactionService';
import { ArticleReactionRepository } from '../repositories/articleReactionRepository';
import { IRouteModule } from './IRouteModule';
import { IArticleReactionRepository } from '../interfaces/IArticleReactionRepository';
import { IArticleRepository } from '../interfaces/IArticleRepository';
import { ArticleRepository } from '../repositories/articleRepository';
import { IUserPreferenceRepository } from '../interfaces/IUserPreferenceRepository';
import { UserPreferenceRepository } from '../repositories/userPreferenceRepository';

export class ArticleReactionRoutes implements IRouteModule{
    private router = express.Router();

    constructor() {
        const articleReactionRepository: IArticleReactionRepository = new ArticleReactionRepository();
        const articleRepository: IArticleRepository = new ArticleRepository();
        const userPreferenceRepository: IUserPreferenceRepository = new UserPreferenceRepository();
        const service : IArticleReactionService = new ArticleReactionService(articleReactionRepository,articleRepository,userPreferenceRepository);
        const controller = new ArticleReactionController(service);
        this.router.use( controller.getRouter());
    }
        
    getRouter() {
        return this.router;
    }
}