import { IArticle } from '../../utils/interfaces';
import { IArticleRepository } from '../interfaces/IArticleRepository';
import { ISavedArticleRepository } from '../interfaces/ISavedArticleRepository';
import { IUserPreferenceRepository } from '../interfaces/IUserPreferenceRepository';

export interface ISavedArticleService {
    saveArticleForUser(userId: number, articleId: number): Promise<number>;
    removeSavedArticle(userId: number, articleId: number): Promise<void>;
    getSavedArticles(userId: number): Promise<IArticle[]>;
}

export class SavedArticleService implements ISavedArticleService {
    constructor(
        private savedArticleRepository: ISavedArticleRepository,
        private articleRepository: IArticleRepository,
        private userPrefRepository: IUserPreferenceRepository
    ) { }

    async saveArticleForUser(userId: number, articleId: number): Promise<number> {
        const savedArticleId = this.savedArticleRepository.save(userId, articleId);
        const keywords = await this.articleRepository.getArticleKeywords(articleId);
        const categories = await this.articleRepository.getArticleCategories(articleId);
        await this.userPrefRepository.addPreferenceKeywords(userId, keywords);
        await this.userPrefRepository.addPreferenceCategories(userId, categories);
        return savedArticleId;
    }

    async removeSavedArticle(userId: number, articleId: number): Promise<void> {
        return this.savedArticleRepository.delete(userId, articleId);
    }

    async getSavedArticles(userId: number): Promise<IArticle[]> {
        const savedItems = await this.savedArticleRepository.getSavedArticlesIds(userId);
        const ids = savedItems.map(s => s.article_id);
        return this.articleRepository.findArticlesByIds(ids);
    }
}
