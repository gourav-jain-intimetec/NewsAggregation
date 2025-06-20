import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IArticle } from '../../utils/interfaces';

export class ArticleRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async articleExists(articleId: number): Promise<boolean> {
        const query = 'SELECT 1 FROM articles WHERE article_id = ?';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query, [articleId]);
        return rows.length > 0;
    }

    async saveArticle(article: IArticle): Promise<number> {
        const query = `
            INSERT INTO articles (title, description, url, image_url, source, language, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            article.title,
            article.description,
            article.url,
            article.image_url,
            article.source,
            article.language,
            article.published_at
        ];
        const [result] = await this.pool.execute<ResultSetHeader>(query, values);
        return result.insertId;
    }

    async saveArticleKeywords(articleId: number, keywords: string[]): Promise<void> {
        const query = 'INSERT INTO article_keywords (article_id, keyword) VALUES (?, ?)';
        const promises = keywords.map(keyword => this.pool.execute(query, [articleId, keyword]));
        await Promise.all(promises);
    }

    async saveArticleCategory(articleId: number, categoryId: number): Promise<void> {
        const query = 'INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)';
        await this.pool.execute(query, [articleId, categoryId]);
    }
}
