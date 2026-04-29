import { createSpinner, withSpinner } from '../spinner.js';
import { api } from '../api.js';
import { printTable } from '../table.js';
import * as fs from 'fs';

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

		if (options.gender) params.gender = options.gender;
		if (options.country) params.country_id = options.country;
		if (options['age-group']) params.age_group = options['age-group'];
		if (options['min-age']) params.min_age = options['min-age'];
		if (options['max-age']) params.max_age = options['max-age'];
		if (options['sort-by']) params.sort_by = options['sort-by'];
		if (options['order']) params.order = options.order;
		if (options.page) params.page = options.page;
		if (options.limit) params.limit = options.limit;

		const response = await withSpinner(spinner, () =>
			api.get('/api/profiles', { params })
		);

		if (response.data && response.data.data) {
			printTable(response.data.data, tableColumns);

			// Print pagination info
			if (response.data.total_pages) {
				console.log(
					`\nPage ${response.data.page}/${response.data.total_pages} - `
						.gray + `total results: ${response.data.total}`.gray
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

		// Add any additional options to query parameters
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

		// Add filter options if provided
		if (options.gender) params.gender = options.gender;
		if (options.country) params.country_id = options.country;
		if (options['age-group']) params.age_group = options['age-group'];
		if (options['min-age']) params.min_age = options['min-age'];
		if (options['max-age']) params.max_age = options['max-age'];
		if (options['min-gender-probability'])
			params.min_gender_probability = options['min-gender-probability'];
		if (options['min-country-probability'])
			params.min_country_probability = options['min-country-probability'];
		if (options['sort-by']) params.sort_by = options['sort-by'];
		if (options.order) params.order = options.order;

		const response = await withSpinner(spinner, () =>
			api.get('/api/profiles/export', {
				params,
				responseType: 'arraybuffer'
			})
		);

		// Write to file
		const filename = `profiles_${Date.now()}.csv`;
		// In a real implementation, we would save the response.data to a file
		// For now, we'll just log that we would save it
		console.log(`Would save to ${filename}`.green);
	} catch (error) {
		handleProfileError(error, 'Failed to export profiles');
	}
}

function handleProfileError(error: any, defaultMessage: string) {
	if (error.response?.status === 401) {
		console.log('Session expired. Run: insighta login');
	} else if (error.response?.status === 403) {
		console.log("You don't have permission to perform this action");
	} else if (error.response?.status === 404) {
		console.log('Profile not found');
	} else if (error.code === 'ECONNREFUSED') {
		console.log('Could not reach the server. Is the backend running?');
	} else if (error.response?.status === 429) {
		console.log('Rate limit exceeded. Try again in a moment.');
	} else {
		console.log(`Error: ${error.message || defaultMessage}`);
	}
}
