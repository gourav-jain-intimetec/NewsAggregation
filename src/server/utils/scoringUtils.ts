import { INotificationRepository } from "../interfaces/INotificationRepository";
import { IUserPreferenceRepository } from "../interfaces/IUserPreferenceRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { UserPreferenceRepository } from "../repositories/userPreferenceRepository";
import { UserPreferences } from "./interfaces";

const userPreferenceRepository: IUserPreferenceRepository = new UserPreferenceRepository();
const notificationRepository: INotificationRepository = new NotificationRepository();

export async function getUserPreferences(userId: number): Promise<UserPreferences> {
    const prefrencedKeywords = await userPreferenceRepository.getUserPrefrenceKeywords(userId);
    const prefrencedCategories = await userPreferenceRepository.getUserPrefrenceCategories(userId);
    const notificationSettings = await notificationRepository.getUserSettings(userId);
    const notificationKeywords = notificationSettings.flatMap(s => s.keywords || []);
    const userPreferences: UserPreferences = {
        keywords: prefrencedKeywords,
        categories: prefrencedCategories,
        notificationKeywords:notificationKeywords
    }
    return userPreferences;
}

export function getArticleScore(
    prefs: UserPreferences,
    articleKeywords: string[],
    articleCategories: number[]
): number {
    let score = 0;

    for (const keyword of articleKeywords) {
        if (prefs.keywords.includes(keyword)) score += 3;
        if (prefs.notificationKeywords.includes(keyword)) score += 5;
    }

    for (const cat of articleCategories) {
        if (prefs.categories.includes(cat)) score += 2;
    }

    return score;
}
