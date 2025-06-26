import { Router, Request, Response, NextFunction } from 'express';
import { ArticleService, IArticleService } from '../services/articleService';

export class ArticleController {
    router: Router;
    private articleService: IArticleService;

    constructor(service: IArticleService) {
        this.router = Router();
        this.articleService = service;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/headlines/today', this.handleToday.bind(this));
        this.router.get('/headlines/range', this.handleRange.bind(this));
        this.router.get('/headlines', this.handleCategory.bind(this));
    }

    private async handleToday(req: Request, res: Response, next: NextFunction) {
        try {
            const articles = await this.articleService.getTodayHeadlines();
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    private async handleRange(req: Request, res: Response, next: NextFunction) {
        try {
            const { start, end } = req.query as { start?: string; end?: string };
            if (!start || !end) {
                res.status(400).json({ success: false, error: 'start and end parameters are required' });
                return;
            }
            const articles = await this.articleService.getRangeHeadlines(start, end);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    private async handleCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.query.category as string;
            const date = (req.query.date as string) || "";
            if (!category) {
                res.status(400).json({ success: false, error: 'category parameter is required' });
                return;
            }
            const articles = await this.articleService.getCategoryHeadlines(date, category);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }
}
