import express, { Express } from 'express';
import http from 'http';
import { IAuthService, AuthService } from '../services/authService';
import { AuthController } from '../controllers/authController';
import { IUserRepository, UserRepository } from '../repositories/userRepository';
import { getDbPool, closeDbPool } from '../config/database';
import { runArticleFetchNow, scheduleArticleFetchJob } from '../jobs/articleFetchJob';
import { ExternalNewsServerRepository, IExternalServerRepository } from '../repositories/externalNewsServerRepository';
import { ExternalNewsServerService, IExternalNewsServerService } from '../services/externalNewsServerService';
import { ExternalServerController } from './externalNewsServerController';
import categoryRoutes from '../routes/categoryRoutes';
import { ArticleController } from './articleController';
import { ArticleService } from '../services/articleService';
export default class ServerController {
    private app: Express;
    private port: number;
    private server: http.Server | null = null;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    private async runChroneJobs(): Promise<void>{
        runArticleFetchNow();
        scheduleArticleFetchJob();
    }

    public async initializeServer(): Promise<void> {
        try {
            const pool = getDbPool();
            await pool.query('SELECT 1');
            console.log('Database connected');
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }

        this.app.use(express.json());

        const userRepository: IUserRepository = new UserRepository();
        const authService: IAuthService = new AuthService(userRepository);
        const authController = new AuthController(authService);
        const externalNewsServerRepository: IExternalServerRepository = new ExternalNewsServerRepository();
        const externalNewsServerService: IExternalNewsServerService = new ExternalNewsServerService(externalNewsServerRepository);
        const externalServerController = new ExternalServerController(externalNewsServerService);
        const articleService = new ArticleService();
        const articleController = new ArticleController(articleService);

        this.app.use('/api', authController.getRouter(), externalServerController.getRouter(), categoryRoutes);
        this.app.use('/api/news', articleController.router);
        this.app.use((request, response) => {
            response.status(404).json({ success: false, error: 'Route not found' });
        });

        this.app.use((err: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            response.status(500).json({ success: false, error: 'Internal server error' });
        });
        this.runChroneJobs();
        this.server = this.app.listen(this.port, () => console.log(`Server running on port ${this.port}`));
    }

    public async close(): Promise<void> {
        if (this.server) {
            this.server.close();
        }
        await closeDbPool();
    }
}
