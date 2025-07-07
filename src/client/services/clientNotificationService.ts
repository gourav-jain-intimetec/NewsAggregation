import * as dotenv from 'dotenv';
import { INotification, IUserNotification } from '../../utils/interfaces';

dotenv.config();

export class ClientNotificationService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async getNotifications(userId: number): Promise<IUserNotification[]> {
        const res = await fetch(`${this.baseUrl}/notifications/${userId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IUserNotification[];
    }

    async getUserSettings(userId: number): Promise<any> {
        const res = await fetch(`${this.baseUrl}/notificationsettings/${userId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data;
    }

    async configureSetting(userId: number, categoryId: number, enabled: boolean, keywords?: string[]): Promise<void> {
        keywords = keywords ? keywords : [];
        const res = await fetch(`${this.baseUrl}/notificationsettings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, categoryId, enabled, keywords })
        });
        const json = await res.json();
    }

    async removeSetting(userId: number, categoryId: number): Promise<void> {
        const res = await fetch(`${this.baseUrl}/notificationsettings`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, categoryId })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
    }

    async getAllCategories(): Promise<{ category_id: number, category_name: string }[]> {
        const res = await fetch(`${this.baseUrl}/category`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data;
    }
}
