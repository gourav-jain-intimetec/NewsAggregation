import { AdminService } from '../services/adminService';
import { AdminDashboardView } from '../views/adminDashboardView';
import { AdminNotificationController } from './adminNotificationController';
import { ContentModerationController } from './contentModerationController';
import { AdminCategoryService } from '../services/adminCategoryService';

export class AdminDashboardController {
    constructor(
        private adminService: AdminService = new AdminService(),
        private adminDashboardView: AdminDashboardView = new AdminDashboardView(),
        private adminCategoryService: AdminCategoryService = new AdminCategoryService(),
        private contentModerationController: ContentModerationController = new ContentModerationController(),
        private adminNotificationController: AdminNotificationController = new AdminNotificationController()
    ) {}

    async start(): Promise<void> {
        let exit = false;
        while (!exit) {
            const choice = await this.adminDashboardView.promptOption();
            switch (choice) {
                case '1':
                    await this.handleListServers();
                    break;
                case '2':
                    await this.handleViewServer();
                    break;
                case '3':
                    await this.handleUpdateServer();
                    break;
                case '4':
                    await this.handleAddCategory();
                    break;
                case '5':
                    await this.handleContentModeration();
                    break;
                case '6':
                    await this.handleNotificationReviews();
                    break;
                case '0':
                    this.adminDashboardView.showMessage('Logged out.');
                    exit = true;
                    break;
                default:
                    this.adminDashboardView.showMessage('Invalid choice. Try again.');
            }
        }
    }

    private async handleListServers(): Promise<void> {
        try {
            const servers = await this.adminService.listServers();
            this.adminDashboardView.showServers(servers);
        } catch (error) {
            this.adminDashboardView.showMessage('Error listing servers: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleViewServer(): Promise<void> {
        try {
            const serverName = await this.adminDashboardView.promptServerName();
            const server = await this.adminService.viewServer(serverName);
            this.adminDashboardView.showServerDetails(server);
        } catch (error) {
            this.adminDashboardView.showMessage('Error viewing server: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleUpdateServer(): Promise<void> {
        try {
            const serverName = await this.adminDashboardView.promptServerName();
            const newKey = await this.adminDashboardView.promptNewApiKey();
            await this.adminService.updateServerKey(serverName, newKey);
            this.adminDashboardView.showMessage('API key updated successfully.');
        } catch (error) {
            this.adminDashboardView.showMessage('Error updating server: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleAddCategory(): Promise<void> {
        try {
            const categoryName = await this.adminDashboardView.promptCategoryName();
            await this.adminCategoryService.addCategory(categoryName);
            this.adminDashboardView.showCategoryAdded();
        } catch (error) {
            this.adminDashboardView.showMessage('Error adding category: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleContentModeration(): Promise<void> {
        await this.contentModerationController.start();
    }

    private async handleNotificationReviews(): Promise<void> {
        await this.adminNotificationController.start();
    }
}
