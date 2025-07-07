import { IArticle } from "../../utils/interfaces";

export interface IPersonalizedArticleRepository {
    findByDate(userId: number, date: string): Promise<IArticle[]>;
    findByRange(userId: number, start: string, end: string): Promise<IArticle[]>;
    findByDateAndCategory(userId: number, start: string,end:string, category: string): Promise<IArticle[]>;
    searchArticles(
        userId: number,
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]>;
}
