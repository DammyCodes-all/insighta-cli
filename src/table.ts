import Table from 'cli-table3';
import chalk from 'chalk';

export interface TableColumn {
	title: string;
	key: string;
}

export function printTable(rows: any[], columns: TableColumn[]): void {
	const table = new Table({
		head: columns.map(col => col.title),
		style: { head: ['cyan'] }
	});

	if (Array.isArray(rows) && rows.length > 0) {
		rows.forEach(row => {
			const rowValues = columns.map(col => {
				const value = row[col.key];
				return value === null || value === undefined ? '' : value;
			});
			table.push(rowValues);
		});
	}

	console.log(table.toString());

	// Print total results in gray
	console.log(chalk.gray(`\nTotal results: ${rows.length}`));
}
