import cron from 'node-cron';
import { ArticleFetchController } from '../controllers/articleFetchController';

export const runArticleFetchNow = async (): Promise<void> => {
    console.log(`[${new Date().toISOString()}] Initial fetch triggered at startup`);
    const controller = new ArticleFetchController();
    try {
        await controller.fetchAndSaveFromAllSources();
        console.log(`[${new Date().toISOString()}] Initial fetch & save completed`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Initial fetch failed:`, error);
    }
}

export const scheduleArticleFetchJob = (): void => {
    // Runs at minute 0 of every 3rd hour (e.g., 00:00, 03:00, 06:00, …)
    cron.schedule('0 */3 * * *', async () => {
        console.log(`[${new Date().toISOString()}] Running scheduled article fetch job`);

        const controller = new ArticleFetchController();
        try {
            await controller.fetchAndSaveFromAllSources();
            console.log(`[${new Date().toISOString()}] Fetch & save completed`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Fetch job failed:`, error);
        }
    });
}
