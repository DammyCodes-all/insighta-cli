import ora from 'ora';
export function createSpinner(text) {
    return ora({
        text,
        spinner: 'dots',
        color: 'cyan'
    });
}
export async function withSpinner(spinner, action) {
    spinner.start();
    return action().finally(() => {
        spinner.stop();
    });
}
