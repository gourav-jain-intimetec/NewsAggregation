import { IncomingMessage } from 'http';
import readlineSync from 'readline-sync';

export const parseJsonBody = async (request: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => (body += chunk));
        request.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('Invalid JSON body'));
            }
        });
        request.on('error', reject);
    });
}

export const ask = (question: string): string => {
    return readlineSync.question(question);
};

export const askMasked = (question: string): string => {
    return readlineSync.question(question, {
        hideEchoBack: true,
        mask:'*'
    });
};

export function getRandomInt(min: number, max: number): number {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
