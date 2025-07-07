import { ask } from '../../utils/helpers';
import { INotificationSetting } from '../../utils/interfaces';

export class UserNotificationView {
    showNotifications(notifications: any[]): void {
        console.log("\nYour Notifications:");
        if (!notifications.length) {
            console.log("No notifications.");
        } else {
            notifications.forEach((n, i) => {
                console.log(`${i + 1}. ${n.message}`);
            });
        }
    }

    showConfigMenu(
        allCategories: { category_id: number; category_name: string }[],
        userSettings: INotificationSetting[]
    ): void {
        console.log(`\nC O N F I G U R E - N O T I F I C A T I O N S`);

        allCategories.forEach((category, index) => {
            const setting = userSettings.find(s => s.category_id === category.category_id);
            const status = setting && setting.enabled ? 'Enabled' : 'Disabled';
            console.log(`${index + 1}. ${category.category_name} - ${status}`);
        });

        console.log(`${allCategories.length + 1}. Back`);
        console.log(`${allCategories.length + 2}. Logout`);
    }
    
    showCategoryDetail(setting: INotificationSetting, categoryName: string): void {
        console.log(`\nC A T E G O R Y - ${categoryName}`);
        console.log(`Status: ${setting.enabled ? 'Enabled' : 'Disabled'}`);
        console.log(`\nKEYWORDS`);
        if (!setting.keywords.length) {
            console.log("No keywords configured.");
        } else {
            setting.keywords.forEach((k, idx) => {
                console.log(`${idx + 1}. ${k}`);
            });
        }
        console.log(`${setting.keywords.length + 1}. Toggle Notifications (Enable/Disable)`);
        console.log(`${setting.keywords.length + 2}. Add Keyword`);
        console.log(`${setting.keywords.length + 3}. Remove Keyword`);
        console.log(`${setting.keywords.length + 4}. Back`);
        console.log(`${setting.keywords.length + 5}. Logout`);
    }

    async getUserChoice(): Promise<string> {
        return ask('Enter your option: ');
    }

    async promptAddKeyword(): Promise<string> {
        return ask('Enter keyword to add: ');
    }

    async promptRemoveKeyword(): Promise<string> {
        return ask('Enter keyword to remove: ');
    }
}
