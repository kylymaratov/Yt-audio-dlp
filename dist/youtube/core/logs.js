"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customLog = customLog;
exports.clearCustomLogs = clearCustomLogs;
let logMessages = [];
function customLog(message) {
    logMessages.push(message);
    process.stdout.write(message + "\n");
}
function clearCustomLogs() {
    for (let i = 0; i < logMessages.length; i++) {
        process.stdout.write("\x1b[2J\x1b[0f");
    }
    logMessages = [];
}
