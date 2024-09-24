"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
exports.clearLogger = clearLogger;
let logMessages = [];
function logger(message) {
    logMessages.push(message);
    process.stdout.write(message + "\n");
}
function clearLogger() {
    for (let i = 0; i < logMessages.length; i++) {
        process.stdout.write("\x1b[2J\x1b[0f");
    }
    logMessages = [];
}
