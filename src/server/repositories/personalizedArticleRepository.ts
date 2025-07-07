import { IPersonalizedArticleRepository } from "../interfaces/IPersonalizedArticleRepository";
import { IArticle } from "../../utils/interfaces";
import { ArticleRepository } from "./articleRepository";
import { getUserPreferences, getArticleScore } from "../utils/scoringUtils";

export class PersonalizedArticleRepository implements IPersonalizedArticleRepository {
    constructor(
        private baseRepo: ArticleRepository,
    ) { }

    private async scoreAndSort(userId: number, articles: IArticle[]): Promise<IArticle[]> {
        const userPreferences = await getUserPreferences(userId);
        const scored = await Promise.all(
            articles.map(async (article) => {
                const articleKeywords = await this.baseRepo.getArticleKeywords(article.article_id);
                const articleCategories = await this.baseRepo.getArticleCategories(article.article_id);
                const score = getArticleScore(userPreferences, articleKeywords, articleCategories);
                return { ...article, score };
            })
        );

        return scored
            .sort((a, b) => b.score - a.score)
            .map(({ score, ...article }) => article);
    }

    async findByDate(userId: number, date: string): Promise<IArticle[]> {
        const articles = await this.baseRepo.findByDate(date);
        return this.scoreAndSort(userId, articles);
    }

    async findByRange(userId: number, start: string, end: string): Promise<IArticle[]> {
        const articles = await this.baseRepo.findByRange(start, end);
        return this.scoreAndSort(userId, articles);
    }

    async findByDateAndCategory(userId: number, start: string, end:string, category: string): Promise<IArticle[]> {
        const articles = await this.baseRepo.findByDateAndCategory(start,end, category);
        return this.scoreAndSort(userId, articles);
    }

    async searchArticles(
        userId: number,
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]> {
        const articles = await this.baseRepo.searchArticles(query, fromDate, toDate, sortBy);
        return this.scoreAndSort(userId, articles);
    }
}
