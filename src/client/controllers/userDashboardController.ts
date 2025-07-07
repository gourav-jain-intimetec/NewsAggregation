import { IArticle, INotificationSetting } from "../../utils/interfaces";
import { IUser } from "../../utils/types";
import { UserService } from "../services/userService";
import { UserDashboardView } from "../views/userDashboardView";
import { UserReactionService } from '../services/userReactionService';
import { UserReportService } from '../services/userReportService';
import { UserNotificationView } from "../views/userNotificationView";
import { ClientNotificationService } from "../services/clientNotificationService";

export class UserDashboardController {
    constructor(
        private view: UserDashboardView = new UserDashboardView(),
        private service: UserService = new UserService(),
        private reactionService: UserReactionService = new UserReactionService(),
        private reportService: UserReportService = new UserReportService(),
        private notificationView: UserNotificationView = new UserNotificationView(),
        private notificationService: ClientNotificationService = new ClientNotificationService()
    ) {}

    async start(user: IUser): Promise<void> {
        let exit = false;
        while (!exit) {
            try {
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
            } catch (error) {
                this.view.showMessage('Dashboard error: ' + (error instanceof Error ? error.message : ''));
            }
        }
    }

    private async handleHeadlines(user: IUser): Promise<void> {
        let back = false;
        while (!back) {
            try {
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
                        back = true;
                        break;
                    default:
                        this.view.showMessage("Invalid choice. Try again.");
                }
            } catch (error) {
                this.view.showMessage('Headlines error: ' + (error instanceof Error ? error.message : ''));
            }
        }
    }

    private async handleDateRangeHeadlines(user: IUser): Promise<void> {
        try {
            const { start, end } = await this.view.promptDateRange();
            let back = false;
            while (!back) {
                const categoryChoice = await this.view.promptCategoryMenu();
                switch (categoryChoice) {
                    case '1':
                        await this.showArticles(await this.service.getHeadlinesByRange(user.userId, start, end), user);
                        break;
                    case '2':
                        await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId, start, end, 'business'), user);
                        break;
                    case '3':
                        await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId, start, end, 'entertainment'), user);
                        break;
                    case '4':
                        await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId, start, end, 'sports'), user);
                        break;
                    case '5':
                        await this.showArticles(await this.service.getHeadlinesByRangeAndCategory(user.userId, start, end, 'technology'), user);
                        break;
                    case '6':
                        back = true;
                        break;
                    case '7':
                        this.view.showMessage("Logged out.");
                        back = true;
                        break;
                    default:
                        this.view.showMessage("Invalid choice. Try again.");
                }
            }
        } catch (error) {
            this.view.showMessage('Date range headlines error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async showArticles(articles: IArticle[], user: IUser): Promise<void> {
        try {
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
                        back = true;
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
        } catch (error) {
            this.view.showMessage('Show articles error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleSavedArticles(user: IUser): Promise<void> {
        let back = false;
        while (!back) {
            try {
                const saved = await this.service.getSavedArticles(user);
                this.view.showSavedArticles(saved);
                const choice = await this.view.promptSavedMenu();
                switch (choice) {
                    case '1':
                        back = true;
                        break;
                    case '2':
                        this.view.showMessage("Logged out.");
                        back = true;
                        break;
                    case '3': {
                        const articleId = await this.view.promptArticleId();
                        await this.service.deleteSavedArticle(articleId, user.userId);
                        this.view.showMessage("Deleted.");
                        break;
                    }
                    default:
                        this.view.showMessage("Invalid choice.");
                }
            } catch (error) {
                this.view.showMessage('Saved articles error: ' + (error instanceof Error ? error.message : ''));
            }
        }
    }

    private async handleSearch(user: IUser): Promise<void> {
        try {
            const { query, fromDate, toDate, sortBy } = await this.view.promptSearchParams();
            const articles = await this.service.searchArticles(user.userId, query, fromDate, toDate, sortBy);
            await this.showArticles(articles, user);
        } catch (error) {
            this.view.showMessage('Search error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleNotifications(user: IUser): Promise<void> {
        let back = false;
        while (!back) {
            try {
                const choice = await this.view.promptNotificationsMenu();
                switch (choice) {
                    case '1': {
                        const notifications = await this.service.getNotifications(user);
                        this.view.showNotifications(notifications);
                        break;
                    }
                    case '2':
                        await this.handleConfigureNotifications(user);
                        break;
                    case '3':
                        back = true;
                        break;
                    case '4':
                        this.view.showMessage("Logged out.");
                        back = true;
                        break;
                    default:
                        this.view.showMessage("Invalid choice.");
                }
            } catch (error) {
                this.view.showMessage('Notifications error: ' + (error instanceof Error ? error.message : ''));
            }
        }
    }

    private async handleConfigureNotifications(user: IUser): Promise<void> {
        let back = false;
        while (!back) {
            try {
                const categories = await this.notificationService.getAllCategories();
                const settings = await this.notificationService.getUserSettings(user.userId);
                this.notificationView.showConfigMenu(categories, settings);
                const choice = await this.notificationView.getUserChoice();
                const choiceNum = parseInt(choice);
                if (choiceNum === settings.length + 1) {
                    back = true;
                    continue;
                }
                if (choiceNum === settings.length + 2) {
                    this.view.showMessage("Logged out.");
                    back = true;
                    continue;
                }
                if (choiceNum >= 1 && choiceNum <= settings.length) {
                    const selectedCategory = categories[choiceNum - 1];
                    const existingSetting = settings.find((s: INotificationSetting) => s.category_id === selectedCategory.category_id);
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
            } catch (error) {
                this.view.showMessage('Configure notifications error: ' + (error instanceof Error ? error.message : ''));
            }
        }
    }

    private async handleConfigureCategory(user: IUser, setting: INotificationSetting, categoryName: string): Promise<void> {
        let back = false;
        while (!back) {
            try {
                this.notificationView.showCategoryDetail(setting, categoryName);
                const choice = await this.notificationView.getUserChoice();
                const choiceNum = parseInt(choice);
                if (choiceNum === setting.keywords.length + 4) {
                    back = true;
                    continue;
                }
                if (choiceNum === setting.keywords.length + 5) {
                    this.view.showMessage("Logged out.");
                    back = true;
                    continue;
                }
                if (choiceNum === setting.keywords.length + 1) {
                    const newStatus = !setting.enabled;
                    await this.notificationService.configureSetting(user.userId, setting.category_id, newStatus);
                    setting.enabled = newStatus;
                    this.view.showMessage(`Notifications for ${categoryName} ${newStatus ? 'enabled' : 'disabled'}.`);
                }
                if (choiceNum === setting.keywords.length + 2) {
                    const newKeyword = await this.notificationView.promptAddKeyword();
                    setting.keywords.push(newKeyword);
                    await this.notificationService.configureSetting(user.userId, setting.category_id, setting.enabled, setting.keywords);
                    this.view.showMessage("Keyword added.");
                }
                if (choiceNum === setting.keywords.length + 3) {
                    const removeKeyword = await this.notificationView.promptRemoveKeyword();
                    setting.keywords = setting.keywords.filter(k => k !== removeKeyword);
                    await this.notificationService.configureSetting(user.userId, setting.category_id, setting.enabled, setting.keywords);
                    this.view.showMessage("Keyword removed.");
                }
            } catch (error) {
                this.view.showMessage('Configure category error: ' + (error instanceof Error ? error.message : ''));
            }
        }
    }
}
