import { IUser } from "../../utils/types";
import { AdminDashboardController } from "./adminDashboardController";
import { UserDashboardController } from "./userDashboardController";

export class DashboardController {
    constructor(
        private adminDashboardController: AdminDashboardController = new AdminDashboardController(),
        private userDashboardController: UserDashboardController = new UserDashboardController()
    ) {}

    async routeToDashboard(user: IUser): Promise<void> {
        try {
            switch (user.role_id) {
                case 1:
                    await this.adminDashboardController.start();
                    break;
                case 2:
                    await this.userDashboardController.start(user);
                    break;
                default:
                    console.log("Unknown role. Access denied.");
            }
        } catch (error) {
            console.log("Error routing to dashboard: " + (error instanceof Error ? error.message : ''));
        }
    }
}
