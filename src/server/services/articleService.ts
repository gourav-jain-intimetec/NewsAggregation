import { ArticleRepository } from '../repositories/articleRepository';
import { IArticle } from '../../utils/interfaces';

export interface IArticleService {
    getTodayHeadlines(): Promise<IArticle[]>;
    getRangeHeadlines(start: string, end: string): Promise<IArticle[]>;
    getCategoryHeadlines(date: string, category: string): Promise<IArticle[]>;
}

export class ArticleService implements IArticleService {
    constructor(private repo: ArticleRepository = new ArticleRepository()) { }

    getTodayHeadlines(): Promise<IArticle[]> {
        const today = new Date().toISOString().slice(0, 10);
        return this.repo.findByDate(today);
    }

    getRangeHeadlines(start: string, end: string): Promise<IArticle[]> {
        return this.repo.findByRange(start, end);
    }

    getCategoryHeadlines(
        date: string = new Date().toISOString().slice(0, 10),
        category: string
    ): Promise<IArticle[]> {
        return this.repo.findByDateAndCategory(date, category);
    }
}
