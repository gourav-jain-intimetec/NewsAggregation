import { IPersonalizedArticleRepository } from "../interfaces/IPersonalizedArticleRepository";
import { IArticle } from "../../utils/interfaces";

export interface IPersonalizedArticleService {
    getTodayHeadlines(userId: number): Promise<IArticle[]>;
    getRangeHeadlines(userId: number, start: string, end: string): Promise<IArticle[]>;
    getCategoryHeadlines(userId: number, start: string, end:string, category: string): Promise<IArticle[]>;
    searchArticles(
        userId: number,
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]>;
}

export class PersonalizedArticleService implements IPersonalizedArticleService {
    constructor(private repo: IPersonalizedArticleRepository) { }

    getTodayHeadlines(userId: number): Promise<IArticle[]> {
        const today = new Date().toISOString().slice(0, 10);
        return this.repo.findByDate(userId, today);
    }

    getRangeHeadlines(userId: number, start: string, end: string): Promise<IArticle[]> {
        return this.repo.findByRange(userId, start, end);
    }

    getCategoryHeadlines(userId: number, start: string,end:string, category: string): Promise<IArticle[]> {
        return this.repo.findByDateAndCategory(userId, start,end, category);
    }

    searchArticles(
        userId: number,
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]> {
        return this.repo.searchArticles(userId, query, fromDate, toDate, sortBy);
    }
}
