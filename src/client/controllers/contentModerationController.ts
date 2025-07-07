import { ContentModerationService } from "../services/contentModerationService";
import { AdminModerationView } from "../views/adminModerationView";

export class ContentModerationController {
    constructor(
        private view: AdminModerationView = new AdminModerationView(),
        private service: ContentModerationService = new ContentModerationService()
    ) {}

    async start(): Promise<void> {
        let back = false;
        while (!back) {
            const choice = await this.view.promptModerationMenu();
            switch (choice) {
                case '1':
                    await this.handleHideArticle();
                    break;
                case '2':
                    await this.handleHideCategory();
                    break;
                case '3':
                    await this.handleBlockedKeywords();
                    break;
                case '4':
                    back = true;
                    break;
                default:
                    this.view.showMessage('Invalid choice.');
            }
        }
    }

    private async handleHideArticle(): Promise<void> {
        try {
            const articleId = await this.view.promptArticleId();
            await this.service.hideArticle(articleId);
            this.view.showMessage('Article hidden successfully.');
        } catch (error) {
            this.view.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleHideCategory(): Promise<void> {
        try {
            const categoryId = await this.view.promptCategoryId();
            await this.service.hideCategory(categoryId);
            this.view.showMessage('Category and related articles hidden.');
        } catch (error) {
            this.view.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleBlockedKeywords(): Promise<void> {
        let back = false;
        while (!back) {
            const choice = await this.view.promptKeywordMenu();
            switch (choice) {
                case '1':
                    await this.handleAddBlockedKeyword();
                    break;
                case '2':
                    await this.handleRemoveBlockedKeyword();
                    break;
                case '3':
                    await this.handleViewBlockedKeywords();
                    break;
                case '4':
                    back = true;
                    break;
                default:
                    this.view.showMessage('Invalid choice.');
            }
        }
    }

    private async handleAddBlockedKeyword(): Promise<void> {
        try {
            const keyword = await this.view.promptKeyword();
            await this.service.addBlockedKeyword(keyword);
            this.view.showMessage('Keyword added and related articles hidden.');
        } catch (error) {
            this.view.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleRemoveBlockedKeyword(): Promise<void> {
        try {
            const delKeyword = await this.view.promptKeyword();
            await this.service.removeBlockedKeyword(delKeyword);
            this.view.showMessage('Keyword removed.');
        } catch (error) {
            this.view.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }

    private async handleViewBlockedKeywords(): Promise<void> {
        try {
            const keywords = await this.service.getBlockedKeywords();
            this.view.showKeywords(keywords);
        } catch (error) {
            this.view.showMessage('Error: ' + (error instanceof Error ? error.message : ''));
        }
    }
}
