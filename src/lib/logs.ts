let logMessages: string[] = [];

export function customLog(message: string) {
    logMessages.push(message);

    process.stdout.write(message + "\n");
}

export function clearCustomLogs() {
    for (let i = 0; i < logMessages.length; i++) {
        process.stdout.write("\x1b[2J\x1b[0f");
    }

    logMessages = [];
}
