import * as http from 'http';
import * as url from 'url';
import axios from 'axios';
import chalk from 'chalk';
import open from 'open';
import { readCredentials, saveCredentials, clearCredentials } from './credentials.js';
import api from './api.js';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
export async function login() {
    console.log(chalk.cyan('🚀 Starting login process...'));
    try {
        const initResponse = await axios.get(`${BACKEND_URL}/auth/github?mode=cli`);
        const { authUrl, state } = initResponse.data;
        const authPromise = new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                const parsedUrl = url.parse(req.url ?? '', true);
                const queryObject = parsedUrl.query;
                const code = queryObject.code;
                const receivedState = queryObject.state;
                if (code && receivedState === state) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h1>Success!</h1><p>You can close this window.</p>');
                    axios
                        .post(`${BACKEND_URL}/auth/github/cli-exchange`, {
                        code,
                        state
                    })
                        .then(response => {
                        saveCredentials(response.data.data);
                        resolve('✅ Logged in successfully!');
                        server.close();
                    })
                        .catch(reject);
                }
                else {
                    res.writeHead(400);
                    res.end('Invalid state or missing code.');
                }
            });
            server.on('error', e => {
                reject(new Error(`Local server error: ${e.message}`));
            });
            server.listen(9876, async () => {
                console.log(chalk.yellow('Opening your browser for authentication...'));
                console.log(chalk.dim(`If the browser doesn't open, visit: ${authUrl}`));
                await open(authUrl);
            });
        });
        const result = await authPromise;
        console.log(chalk.green(result));
    }
    catch (error) {
        console.error(chalk.red('\n❌ Authentication failed:'), error?.message || error);
        process.exit(1);
    }
}
export async function logout() {
    try {
        const credentials = readCredentials();
        if (credentials && credentials.refresh_token) {
            await api.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${credentials.refresh_token}`
                }
            });
        }
        clearCredentials();
        console.log(chalk.green('✅ Logged out successfully'));
    }
    catch (error) {
        clearCredentials();
        console.log(chalk.yellow('✅ Logged out successfully (local only)'));
    }
}
export async function whoami() {
    try {
        const response = await api.get('/auth/me');
        console.log(chalk.cyan('User info:'), response.data);
    }
    catch (error) {
        const axiosError = error;
        if (axiosError.response?.status === 401) {
            console.log(chalk.red('Error: Session expired. Run: insighta login'));
        }
        else if (axiosError.response?.status === 403) {
            console.log(chalk.red("Error: You don't have permission to perform this action"));
        }
        else if (axiosError.code === 'ECONNREFUSED') {
            console.log(chalk.red('Error: Could not reach the server. Is the backend running?'));
        }
        else if (axiosError.response?.status === 429) {
            console.log(chalk.red('Error: Rate limit exceeded. Try again in a moment.'));
        }
        else {
            console.log(chalk.red(`Error: ${axiosError.message || 'Failed to get user info'}`));
        }
        process.exit(1);
    }
}
