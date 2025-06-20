import { IUser } from "../../utils/types";
import { ask } from "../../utils/helpers";

export class UserDashboard {
    async show(user: IUser): Promise<void> {
        let exit = false;
        while (!exit) {
            console.log(`\n=== Welcome ${user.username} ===`);
            console.log("1. Headlines");
            console.log("2. Saved Articles");
            console.log("3. Search");
            console.log("4. Notifications");
            console.log("5. Logout");

            const choice = await ask("Choose an option: ");

            switch (choice) {
                case "1":
                    console.log("→ [TODO] Show headlines...");
                    break;
                case "2":
                    console.log("→ [TODO] Show saved articles...");
                    break;
                case "3":
                    console.log("→ [TODO] Search articles...");
                    break;
                case "4":
                    console.log("→ [TODO] Configure notifications...");
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
