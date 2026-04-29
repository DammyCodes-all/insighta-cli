import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
const CREDENTIALS_FILE = path.join(os.homedir(), '.insighta', 'credentials.json');
const CONFIG_DIR = path.join(os.homedir(), '.insighta');
export const CREDENTIALS_FILE_PATH = path.join(os.homedir(), '.insighta', 'credentials.json');
export function getCredentialsFilePath() {
    return CREDENTIALS_FILE_PATH;
}
export function readCredentials() {
    try {
        if (!fs.existsSync(CREDENTIALS_FILE_PATH)) {
            return null;
        }
        const data = fs.readFileSync(CREDENTIALS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        return null;
    }
}
export function saveCredentials(credentials) {
    try {
        // Ensure the directory exists
        const dir = path.dirname(CREDENTIALS_FILE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Write credentials file
        fs.writeFileSync(CREDENTIALS_FILE_PATH, JSON.stringify(credentials, null, 2));
    }
    catch (error) {
        console.error('Failed to save credentials', error);
    }
}
export function clearCredentials() {
    try {
        // Clear the credentials file
        if (fs.existsSync(CREDENTIALS_FILE_PATH)) {
            fs.unlinkSync(CREDENTIALS_FILE_PATH);
        }
    }
    catch (error) {
        console.error('Failed to clear credentials', error);
    }
}
