#!/usr/bin/env node

/**
 * insighta-cli
 * This CLI helps that log in, log out, and identify the current user on the insighta backend
 *
 * @author Aluminate <x.com/dev_aluminate>
 */

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

(async () => {
	await init({ clear });
	debug && log(flags);
	input.includes(`help`) && showHelp(0);
})();
