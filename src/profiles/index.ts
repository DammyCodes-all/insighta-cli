import { createSpinner, withSpinner } from '../spinner.js';
import { api } from '../api.js';
import { printTable } from '../table.js';
import * as fs from 'fs';
import chalk from 'chalk';

const tableColumns = [
	{ title: 'ID', key: 'id' },
	{ title: 'Name', key: 'name' },
	{ title: 'Gender', key: 'gender' },
	{ title: 'Age', key: 'age' },
	{ title: 'Age Group', key: 'age_group' },
	{ title: 'Country', key: 'country_id' }
];

export async function listProfiles(options: any) {
	const spinner = createSpinner('Fetching profiles...');

	try {
		const params: any = {};

		// Map options to query parameters
		if (options.gender) params.gender = options.gender;
		if (options.country) params.country_id = options.country;
		if (options['age-group']) params.age_group = options['age-group'];
		if (options['min-age']) params.min_age = options['min-age'];
		if (options['max-age']) params.max_age = options['max-age'];
		if (options['sort-by']) params.sort_by = options['sort-by'];
		if (options.order) params.order = options.order;
		if (options.page) params.page = options.page;
		if (options.limit) params.limit = options.limit;

		const response = await withSpinner(spinner, () =>
			api.get('/api/profiles', { params })
		);

		if (response.data && response.data.data) {
			printTable(response.data.data, tableColumns);

			if (response.data.total_pages) {
				console.log(
					chalk.gray(
						`\nPage ${response.data.page}/${
							response.data.total_pages
						} - total results: ${response.data.total}`
					)
				);
			}
		} else {
			console.log('No profiles found.');
		}
	} catch (error) {
		handleProfileError(error, 'Failed to list profiles');
	}
}

export async function getProfile(id: string) {
	const spinner = createSpinner('Fetching profile...');

	try {
		const response = await withSpinner(spinner, () =>
			api.get(`/api/profiles/${id}`)
		);

		if (response.data) {
			console.log(JSON.stringify(response.data, null, 2));
		}
	} catch (error) {
		handleProfileError(error, 'Failed to get profile');
	}
}

export async function searchProfiles(query: string, options: any) {
	const spinner = createSpinner('Searching profiles...');

	try {
		const params = { q: query };

		const response = await withSpinner(spinner, () =>
			api.get('/api/profiles/search', { params })
		);

		if (response.data && response.data.data) {
			printTable(response.data.data, tableColumns);
		} else {
			console.log('No profiles found.');
		}
	} catch (error) {
		handleProfileError(error, 'Failed to search profiles');
	}
}

export async function createProfile(name: string) {
	if (!name) {
		console.log('Error: Name is required');
		return;
	}

	const spinner = createSpinner('Creating profile...');

	try {
		const response = await withSpinner(spinner, () =>
			api.post('/api/profiles', { name })
		);

		if (response.data) {
			console.log(JSON.stringify(response.data, null, 2));
		}
	} catch (error) {
		handleProfileError(error, 'Failed to create profile');
	}
}

export async function exportProfiles(options: any) {
	const format = options.format || 'csv';
	const spinner = createSpinner('Exporting profiles...');

	try {
		const params: any = { format };

		const response = await withSpinner(spinner, () =>
			api.get('/api/profiles/export', {
				params,
				responseType: 'arraybuffer'
			})
		);

		console.log(chalk.green(`Saved to profiles_${Date.now()}.csv`));
	} catch (error) {
		handleProfileError(error, 'Failed to export profiles');
	}
}

function handleProfileError(error: any, defaultMessage: string) {
	if (error.response?.status === 401) {
		console.log(chalk.red('Error: Session expired. Run: insighta login'));
		process.exit(1);
	} else if (error.response?.status === 403) {
		console.log(
			chalk.red("You don't have permission to perform this action")
		);
		process.exit(1);
	} else if (error.response?.status === 404) {
		console.log(chalk.red('Error: Profile not found'));
		process.exit(1);
	} else if (error.code === 'ECONNREFUSED') {
		console.log(
			chalk.red(
				'Error: Could not reach the server. Is the backend running?'
			)
		);
		process.exit(1);
	} else if (error.response?.status === 429) {
		console.log(
			chalk.red('Error: Rate limit exceeded. Try again in a moment.')
		);
		process.exit(1);
	} else {
		console.log(chalk.red('Error: ' + (error.message || defaultMessage)));
		process.exit(1);
	}
}
