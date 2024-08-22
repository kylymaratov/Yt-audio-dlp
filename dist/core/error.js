"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorModule extends Error {
    constructor(message, reason) {
        super(message);
        this.message = message;
        this.name = ErrorModule.name;
        this.stack = reason;
        console.error(`Throw error: ${this.name}, message: ${this.message}, reason: ${reason}`);
        Error.captureStackTrace(this, ErrorModule);
    }
}
exports.default = ErrorModule;
