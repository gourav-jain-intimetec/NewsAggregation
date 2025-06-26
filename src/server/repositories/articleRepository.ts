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

    async findByDate(date: string): Promise<IArticle[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT * FROM articles WHERE DATE(published_at) = ? ORDER BY published_at DESC',
            [date]
        );
        return rows as IArticle[];
    }

    async findByRange(start: string, end: string): Promise<IArticle[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT * FROM articles WHERE DATE(published_at) BETWEEN ? AND ? ORDER BY published_at DESC',
            [start, end]
        );
        return rows as IArticle[];
    }

    async findByDateAndCategory(date: string, categoryName: string): Promise<IArticle[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT a.* FROM articles a
           JOIN article_categories ac ON a.article_id = ac.article_id
           JOIN categories c ON ac.category_id = c.category_id
           WHERE DATE(a.published_at) = ? AND c.category_name = ?
           ORDER BY a.published_at DESC`,
            [date, categoryName]
        );
        return rows as IArticle[];
      }
}
