import { MainMenuView } from "../views/mainMenuView";
import { AuthController } from "./authController";
import { DashboardController } from "./dashboardController";
import { UserSession } from "../userSession";

export class AppController {
    constructor(
        private mainMenuView: MainMenuView = new MainMenuView(),
        private authController: AuthController = new AuthController(),
        private dashboardController: DashboardController = new DashboardController()
    ) {}

    async run(): Promise<void> {
        while (true) {
            try {
                const choice = await this.mainMenuView.display();
                switch (choice) {
                    case "1":
                        await this.authController.login();
                        break;
                    case "2":
                        await this.authController.signup();
                        break;
                    case "0":
                        console.log("Exiting application...");
                        process.exit(0);
                    default:
                        console.log("Invalid option.");
                }
                const user = UserSession.getUser();
                if (user) {
                    await this.dashboardController.routeToDashboard(user);
                    UserSession.clear();
                }
            } catch (error) {
                console.log("Application error: " + (error instanceof Error ? error.message : ''));
            }
        }
    }
}
