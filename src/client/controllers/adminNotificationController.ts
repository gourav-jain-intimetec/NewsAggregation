import { AdminNotificationView } from '../views/adminNotificationView';
import { AdminNotificationService } from '../services/adminNotificationService';

export class AdminNotificationController {
    constructor(
        private adminNotificationView: AdminNotificationView = new AdminNotificationView(),
        private adminNotificationService: AdminNotificationService = new AdminNotificationService()
    ) {}

    async start(): Promise<void> {
        let back = false;
        while (!back) {
            const choice = await this.adminNotificationView.promptAdminNotificationMenu();
            switch (choice) {
                case '1':
                    await this.listNotifications();
                    break;
                case '2':
                    await this.markNotificationAsRead();
                    break;
                case '3':
                    back = true;
                    break;
                default:
                    this.adminNotificationView.showMessage('Invalid choice.');
            }
        }
    }

    private async listNotifications(): Promise<void> {
        try {
            const notifications = await this.adminNotificationService.getAdminNotifications();
            this.adminNotificationView.showNotifications(notifications);
        } catch (error) {
            this.adminNotificationView.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async markNotificationAsRead(): Promise<void> {
        try {
            const id = await this.adminNotificationView.promptNotificationId();
            await this.adminNotificationService.markNotificationRead(id);
            this.adminNotificationView.showMessage('Notification marked as read.');
        } catch (error) {
            this.adminNotificationView.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }
}
