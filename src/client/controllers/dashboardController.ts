import { IUser } from "../../utils/types";
import { UserDashboard } from "../views/userDashboard";
import { AdminDashboardController } from "./adminDashboardController";

export class DashboardController {
    private adminDashboardController = new AdminDashboardController();
    private userDashboard = new UserDashboard();

    async route(user: IUser): Promise<void> {
        switch (user.role_id) {
            case 1:
                await this.adminDashboardController.start();
                break;
            case 2:
                await this.userDashboard.show(user);
                break;
            default:
                console.log("Unknown role. Access denied.");
        }
    }
}
