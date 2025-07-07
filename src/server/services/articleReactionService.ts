import { IArticleReactionRepository } from '../interfaces/IArticleReactionRepository';
import { IArticleRepository } from '../interfaces/IArticleRepository';
import { IUserPreferenceRepository } from '../interfaces/IUserPreferenceRepository';

export interface IArticleReactionService {
    reactToArticle(userId: number, articleId: number, reaction: 'like' | 'dislike'): Promise<void>;
}

export class ArticleReactionService implements IArticleReactionService {
    constructor(
        private reactionRepo: IArticleReactionRepository,
        private articleRepo: IArticleRepository,
        private userPrefRepo: IUserPreferenceRepository
    ) { }

    async reactToArticle(userId: number, articleId: number, newReaction: 'like' | 'dislike'): Promise<void> {
        const existingReaction = await this.reactionRepo.getUserReaction(userId, articleId);

        if (existingReaction === newReaction) {
            await this.reactionRepo.removeReaction(userId, articleId);
            await this.reactionRepo.updateArticleReactionCount(articleId, newReaction === 'like' ? 'likes' : 'dislikes', -1);
            return;
        }

        if (existingReaction) {
            await this.reactionRepo.updateArticleReactionCount(articleId, existingReaction === 'like' ? 'likes' : 'dislikes', -1);
        }

        await this.reactionRepo.addOrUpdateReaction(userId, articleId, newReaction);
        await this.reactionRepo.updateArticleReactionCount(articleId, newReaction === 'like' ? 'likes' : 'dislikes', 1);

        if (newReaction === 'like') {
            const keywords = await this.articleRepo.getArticleKeywords(articleId);
            const categories = await this.articleRepo.getArticleCategories(articleId);
            await this.userPrefRepo.addPreferenceKeywords(userId, keywords);
            await this.userPrefRepo.addPreferenceCategories(userId, categories);
          }
    }
}
