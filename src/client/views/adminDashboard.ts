import { IUser } from "../../utils/types";
import { ask } from "../../utils/helpers";

export class AdminDashboard {
    async show(user: IUser): Promise<void> {
        let exit = false;
        while (!exit) {
            console.log(`\n=== Admin Dashboard ===`);
            console.log("1. View External Server Status");
            console.log("2. View External Server Details");
            console.log("3. Update/Edit External Server");
            console.log("4. Add News Category");
            console.log("5. Logout");

            const choice = await ask("Choose an option: ");

            switch (choice) {
                case "1":
                    console.log("→ [TODO] Display server status...");
                    break;
                case "2":
                    console.log("→ [TODO] Display server details...");
                    break;
                case "3":
                    console.log("→ [TODO] Update server config...");
                    break;
                case "4":
                    console.log("→ [TODO] Add new news category...");
                    break;
                case "5":
                    console.log("Logged out.");
                    exit = true;
                    break;
                default:
                    console.log("Invalid choice. Try again.");
            }
        }
    }
}
