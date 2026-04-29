import ora from 'ora';

export function createSpinner(text: string) {
	return ora({
		text,
		spinner: 'dots',
		color: 'cyan'
	});
}

export async function withSpinner<T>(
	spinner: any,
	action: () => Promise<T>
): Promise<T> {
	spinner.start();
	return action().finally(() => {
		spinner.stop();
	});
}
