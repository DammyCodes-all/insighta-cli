#!/usr/bin/env node
import { Command } from 'commander';
import { login, logout, whoami } from './auth.js';
import { listProfiles, getProfile, searchProfiles, createProfile, exportProfiles } from './profiles/index.js';
const program = new Command();
program
    .name('insighta')
    .description('Insighta CLI - Profile management tool')
    .version('1.0.0');
program
    .command('login')
    .description('Log in to the Insighta platform')
    .action(async () => {
    await login();
});
program
    .command('logout')
    .description('Log out from the Insighta platform')
    .action(async () => {
    await logout();
});
program
    .command('whoami')
    .description('Display current user information')
    .action(async () => {
    await whoami();
});
// Add profile subcommands
const profilesCmd = program
    .command('profiles')
    .description('Manage profiles')
    .action(() => {
    console.log('Use insighta profiles --help for available commands');
});
profilesCmd
    .command('list')
    .description('List all profiles with optional filters')
    .option('-g, --gender <type>', 'filter by gender (male, female)')
    .option('-c, --country <code>', 'filter by country ISO code')
    .option('--age-group <group>', 'filter by age group (child, teenager, adult, senior)')
    .option('--min-age <age>', 'minimum age filter')
    .option('--max-age <age>', 'maximum age filter')
    .option('--sort-by <field>', 'sort by field (name, age, created_at)')
    .option('--order <order>', 'sort order (asc, desc)')
    .option('-p, --page <number>', 'page number', '1')
    .option('-l, --limit <number>', 'results per page', '10')
    .action(async (opts) => {
    await listProfiles(opts);
});
program
    .command('get')
    .description('Get a specific profile by ID')
    .argument('<id>', 'profile ID')
    .action(async (id) => {
    await getProfile(id);
});
program
    .command('search')
    .description('Search profiles with natural language query')
    .argument('<query>', 'search query (e.g., "male from nigeria above 30")')
    .action(async (query) => {
    await searchProfiles(query, {});
});
program
    .command('create')
    .description('Create a new profile')
    .argument('<name>', 'profile name')
    .action(async (name) => {
    await createProfile(name);
});
program
    .command('export')
    .description('Export profiles to CSV')
    .option('-f, --format <format>', 'export format', 'csv')
    .action(async (options) => {
    await exportProfiles(options);
});
program.parse();
