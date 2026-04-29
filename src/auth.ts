import * as http from 'http';
import * as url from 'url';
import * as crypto from 'crypto';
import {
	readCredentials,
	saveCredentials,
	clearCredentials
} from './credentials.js';
import api from './api.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function login() {
	console.log('Starting login process...');

	const state = 'cli:' + crypto.randomBytes(16).toString('hex');

	const server = http.createServer();
	server.listen(9876);

	const authUrl = `${BACKEND_URL}/auth/github?mode=cli&state=${state}`;
	console.log(`Please visit this URL to authenticate: ${authUrl}`);

	console.log('Server listening on port 9876 for callback...');

	console.log(
		'After authentication, tokens would be saved to credentials file'
	);

	server.close();
}

export async function logout() {
	try {
		const credentials = readCredentials();
		if (credentials) {
			await api.post(
				'/auth/logout',
				{},
				{
					headers: {
						Authorization: `Bearer ${credentials.refresh_token}`
					}
				}
			);
		}

		clearCredentials();
		console.log('✅ Logged out successfully');
	} catch (error) {
		clearCredentials();
		console.log('✅ Logged out successfully (local only)');
	}
}

export async function whoami() {
	try {
		const response = await api.get('/auth/me');
		console.log('User info:', response.data);
	} catch (error) {
		console.error('Failed to get user info:', error);
	}
}
