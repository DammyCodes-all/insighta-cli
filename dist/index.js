#!/usr/bin/env node
import { Command } from 'commander';
import { login, logout, whoami } from './auth.js';
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
program.parse();
