import { IArticle } from '../../utils/interfaces';
import { IArticleRepository } from '../interfaces/IArticleRepository';

export interface IArticleService {
    getTodayHeadlines(): Promise<IArticle[]>;
    getRangeHeadlines(start: string, end: string): Promise<IArticle[]>;
    getCategoryHeadlines(start: string, end: string, category: string): Promise<IArticle[]>;
    searchArticles(
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]>;
}

export class ArticleService implements IArticleService {
    constructor(private articleRepository: IArticleRepository) { }

    getTodayHeadlines(): Promise<IArticle[]> {
        const today = new Date().toISOString().slice(0, 10);
        return this.articleRepository.findByDate(today);
    }

    getRangeHeadlines(start: string, end: string): Promise<IArticle[]> {
        return this.articleRepository.findByRange(start, end);
    }

    getCategoryHeadlines(
        start: string = new Date().toISOString().slice(0, 10),
        end: string = new Date().toISOString().slice(0, 10),
        category: string
    ): Promise<IArticle[]> {
        return this.articleRepository.findByDateAndCategory(start,end, category);
    }

    async searchArticles(
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]> {
        return this.articleRepository.searchArticles(query, fromDate, toDate, sortBy);
    }
}
