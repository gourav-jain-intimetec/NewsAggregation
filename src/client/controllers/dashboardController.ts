import { IUser } from "../../utils/types";
import { AdminDashboard } from "../views/adminDashboard";
import { UserDashboard } from "../views/userDashboard";

export class DashboardController {
    private adminDashboard = new AdminDashboard();
    private userDashboard = new UserDashboard();

    async route(user: IUser): Promise<void> {
        switch (user.role_id) {
            case 1:
                await this.userDashboard.show(user);
                break;
            case 2:
                await this.adminDashboard.show(user);
                break;
            default:
                console.log("Unknown role. Access denied.");
        }
    }
}
