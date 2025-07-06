import { Router, Request, Response, NextFunction } from 'express';
import { IArticleService } from '../services/articleService';
import { IArticle } from '../../utils/interfaces';
import { IPersonalizedArticleService } from '../services/personalizedArticleService';

export class ArticleController {
    router: Router;
    private articleService:IPersonalizedArticleService;

    constructor(service:IPersonalizedArticleService) {
        this.router = Router();
        this.articleService = service;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/users/:userId/headlines/today', this.handleToday.bind(this));
        this.router.get('/users/:userId/headlines/range', this.handleRange.bind(this));
        this.router.get('/users/:userId/headlines', this.handleCategory.bind(this));
        this.router.get('/users/:userId/search', this.handleSearch.bind(this));
    }

    private async handleToday(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId, 10);

            if (isNaN(userId)) {
                res.status(400).json({ success: false, error: 'Invalid userId in path' });
                return;
            }
            const articles:IArticle[] = await this.articleService.getTodayHeadlines(userId);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    private async handleRange(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId, 10);

            if (isNaN(userId)) {
                res.status(400).json({ success: false, error: 'Invalid userId in path' });
                return;
            }
            const { start, end } = req.query as { start?: string; end?: string };
            if (!start || !end) {
                res.status(400).json({ success: false, error: 'start and end parameters are required' });
                return;
            }
            const articles: IArticle[] = await this.articleService.getRangeHeadlines(userId,start, end);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    private async handleCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.userId, 10);

            if (isNaN(userId)) {
                res.status(400).json({ success: false, error: 'Invalid userId in path' });
                return;
            }
            const category = req.query.category as string;
            const { start, end } = req.query as { start: string; end: string };
            if (!start || !end) {
                res.status(400).json({ success: false, error: 'start and end date parameter is required' });
                return;
            }
            if (!category) {
                res.status(400).json({ success: false, error: 'category parameter is required' });
                return;
            }
            const articles: IArticle[] = await this.articleService.getCategoryHeadlines(userId, start ,end, category);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    public async handleSearch(req: Request, res: Response, next: NextFunction) {
        const { q, fromDate, toDate, sort } = req.query;
        const userId = parseInt(req.params.userId, 10);

        if (isNaN(userId)) {
            res.status(400).json({ success: false, error: 'Invalid userId in path' });
            return;
        }

        if (!q) {
            res.status(400).json({ success: false, error: 'Search query is required' });
            return
        }

        try {
            const articles: IArticle[] = await this.articleService.searchArticles(
                userId,
                String(q),
                fromDate ? String(fromDate) : undefined,
                toDate ? String(toDate) : undefined,
                sort === 'likes' || sort === 'dislikes' ? (sort as 'likes' | 'dislikes') : undefined
            );

            res.json({ success: true, data: articles });
        } catch (err) {
            next(err);
        }
    }
}
