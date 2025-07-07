import { ask } from "../../utils/helpers";
import { IArticle, INotificationSetting } from "../../utils/interfaces";
import { IUser } from "../../utils/types";
import { UserService } from "../services/userService";
import { UserDashboardView } from "../views/userDashboardView";
import { UserReactionService } from '../services/userReactionService';
import { UserReportService } from '../services/userReportService';
import { UserNotificationView } from "../views/userNotificationView";
import { ClientNotificationService } from "../services/clientNotificationService";

export class UserDashboardController {
    private view = new UserDashboardView();
    private service = new UserService();
    private reactionService = new UserReactionService();
    private reportService = new UserReportService();

    async start(user: IUser): Promise<void> {
        let exit = false;

        while (!exit) {
            this.view.showWelcome(user);
            const choice = await this.view.promptMainMenu();

            switch (choice) {
                case '1':
                    await this.handleHeadlines(user);
                    break;
                case '2':
                    await this.handleSavedArticles(user);
                    break;
                case '3':
                    await this.handleSearch(user);
                    break;
                case '4':
                    await this.handleNotifications(user);
                    break;
                case '5':
                    this.view.showMessage("Logged out successfully.");
                    exit = true;
                    break;
                default:
                    this.view.showMessage("Invalid option. Try again.");
            }
        }
    }

    private async handleHeadlines(user: IUser) {
        let back = false;

        while (!back) {
            const mainChoice = await this.view.promptHeadlinesMainMenu();

            switch (mainChoice) {
                case '1':
                    await this.showArticles(await this.service.getTodayHeadlines(user.userId), user);
                    break;

                case '2':
                    await this.handleDateRangeHeadlines(user);
                    break;

                case '3':
                    back = true;
                    break;

                case '4':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                    break;

                default:
                    this.view.showMessage("Invalid choice. Try again.");
            }
        }
    }
    
    private async handleDateRangeHeadlines(user: IUser) {
        const { start, end } = await this.view.promptDateRange();

        let back = false;
        while (!back) {
            const categoryChoice = await this.view.promptCategoryMenu();

            switch (categoryChoice) {
                case '1':
                    await this.showArticles(await this.service.getHeadlinesByRange(user.userId,start, end), user);
                    break;
                case '2':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId,start, end, 'business'), user);
                    break;
                case '3':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId,start, end, 'entertainment'), user);
                    break;
                case '4':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId,start, end, 'sports'), user);
                    break;
                case '5':
                    await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId,start, end, 'technology'), user);
                    break;
                case '6':
                    back = true;
                    break;
                case '7':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                    break;
                default:
                    this.view.showMessage("Invalid choice. Try again.");
            }
        }
    }    

    private async showArticles(articles: IArticle[],user:IUser) {
        this.view.showArticles(articles);

        if (!articles.length) return;

        let back = false;
        while (!back) {
            const choice = await this.view.promptArticleAction();

            switch (choice) {
                case '1':
                    back = true;
                    break;
                case '2':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                    break;
                case '3': {
                    const articleId = await this.view.promptArticleId();
                    await this.service.saveArticle(articleId, user.userId);
                    this.view.showMessage("Article saved.");
                    break;
                }
                case '4': {
                    const articleId = await this.view.promptArticleId();
                    const reason = await this.view.promptReportReason();
                    const success = await this.reportService.reportArticle(user.userId, articleId, reason);
                    this.view.showMessage(success ? "Article reported." : "Failed to report article.");
                    break;
                }
                case '5': {
                    const articleId = await this.view.promptArticleId();
                    const success = await this.reactionService.reactToArticle(user.userId, articleId, 'like');
                    this.view.showMessage(success ? "Reacted with like." : "Failed to react.");
                    break;
                }
                case '6': {
                    const articleId = await this.view.promptArticleId();
                    const success = await this.reactionService.reactToArticle(user.userId, articleId, 'dislike');
                    this.view.showMessage(success ? "Reacted with dislike." : "Failed to react.");
                    break;
                }
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }

    }

    private async handleSavedArticles(user: IUser) {
        let back = false;

        while (!back) {
            const saved = await this.service.getSavedArticles(user);
            this.view.showSavedArticles(saved);

            const choice = await this.view.promptSavedMenu();

            switch (choice) {
                case '1':
                    back = true;
                    break;
                case '2':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                case '3':
                    const articleId = ask('Article ID to delete: ');
                    await this.service.deleteSavedArticle(parseInt(articleId),user.userId);
                    this.view.showMessage("Deleted.");
                    break;
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }
    }

    private async handleSearch(user: IUser) {
        const query = ask('Enter search query: ');
        const fromDate = ask('From date (YYYY-MM-DD) or blank: ');
        const toDate = ask('To date (YYYY-MM-DD) or blank: ');
        const sortBy = ask('Sort by (likes/dislikes/none): ');

        const articles = await this.service.searchArticles(user.userId,query, fromDate, toDate, sortBy);
        await this.showArticles(articles,user);
    }

    private async handleNotifications(user: IUser) {
        let back = false;

        while (!back) {
            const choice = await this.view.promptNotificationsMenu();

            switch (choice) {
                case '1':
                    const notifications = await this.service.getNotifications(user);
                    this.view.showNotifications(notifications);
                    break;
                case '2':
                    await this.handleConfigureNotifications(user);
                    break;
                case '3':
                    back = true;
                    break;
                case '4':
                    this.view.showMessage("Logged out.");
                    process.exit(0);
                default:
                    this.view.showMessage("Invalid choice.");
            }
        }
    }

    private async handleConfigureNotifications(user: IUser) {
        let back = false;
        const notificationView = new UserNotificationView();
        const notificationService = new ClientNotificationService();

        while (!back) {
            const categories = await notificationService.getAllCategories();
            const categoryMap = categories.reduce((map, c) => {
                map[c.category_id] = c.category_name;
                return map;
            }, {} as Record<number, string>);

            const settings = await notificationService.getUserSettings(user.userId);

            notificationView.showConfigMenu(categories, settings);
            const choice = await notificationView.getUserChoice();
            const choiceNum = parseInt(choice);

            if (choiceNum === settings.length + 1) {
                back = true;
                continue;
            }

            if (choiceNum === settings.length + 2) {
                this.view.showMessage("Logged out.");
                process.exit(0);
            }

            if (choiceNum >= 1 && choiceNum <= settings.length) {
                const selectedCategory = categories[choiceNum - 1];
                const existingSetting = settings.find((s:INotificationSetting) => s.category_id === selectedCategory.category_id);

                let selectedSetting: INotificationSetting;
                if (existingSetting) {
                    selectedSetting = existingSetting;
                } else {
                    selectedSetting = {
                        id: 0,
                        user_id: user.userId,
                        category_id: selectedCategory.category_id,
                        enabled: false,
                        keywords: []
                    };
                }
                await this.handleConfigureCategory(user, selectedSetting, selectedCategory.category_name);
            }
        }
    }

    private async handleConfigureCategory(user: IUser, setting: INotificationSetting, categoryName: string) {
        let back = false;
        const notificationView = new UserNotificationView();
        const notificationService = new ClientNotificationService();

        while (!back) {
            notificationView.showCategoryDetail(setting, categoryName);
            const choice = await notificationView.getUserChoice();
            const choiceNum = parseInt(choice);

            if (choiceNum === setting.keywords.length + 4) {
                back = true;
                continue;
            }

            if (choiceNum === setting.keywords.length + 5) {
                this.view.showMessage("Logged out.");
                process.exit(0);
            }

            if (choiceNum === setting.keywords.length + 1) {
                const newStatus = !setting.enabled;
                await notificationService.configureSetting(user.userId, setting.category_id, newStatus);
                setting.enabled = newStatus;
                this.view.showMessage(`Notifications for ${categoryName} ${newStatus ? 'enabled' : 'disabled'}.`);
            }

            if (choiceNum === setting.keywords.length + 2) {
                const newKeyword = await notificationView.promptAddKeyword();
                setting.keywords.push(newKeyword);
                await notificationService.configureSetting(user.userId,setting.category_id,setting.enabled, setting.keywords);
                this.view.showMessage("Keyword added.");
            }

            if (choiceNum === setting.keywords.length + 3) {
                const removeKeyword = await notificationView.promptRemoveKeyword();
                setting.keywords = setting.keywords.filter(k => k !== removeKeyword);
                await notificationService.configureSetting(user.userId, setting.category_id, setting.enabled, setting.keywords);
                this.view.showMessage("Keyword removed.");
            }
        }
    }
    
}
