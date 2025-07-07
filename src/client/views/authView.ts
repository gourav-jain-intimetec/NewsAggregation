import { LoginRequest, SignupRequest } from '../../utils/types';
import { ask, askMasked, isValidEmail } from '../../utils/helpers';

export class AuthView {
    showWelcome(): void {
        console.log("\n=== Welcome to News Aggregation ===");
    }

    async getLoginDetails(): Promise<LoginRequest> {
        let email = "";
        while (true) {
            email = await ask("Email: ");
            if (isValidEmail(email)) break;
            console.log("Invalid email format. Please try again.");
        }

        const password = await askMasked("Password: ");
        return { email, password };
    }

    async getSignupDetails(): Promise<SignupRequest> {
        const username = await ask("Username: ");

        let email = "";
        while (true) {
            email = await ask("Email: ");
            if (isValidEmail(email)) break;
            console.log("Invalid email format. Please try again.");
        }

        const password = await askMasked("Password: ");
        return { username, email, password };
    }

    showMessage(message: string): void {
        console.log(`${message}`);
    }
}
