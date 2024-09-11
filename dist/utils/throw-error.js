"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorModule = void 0;
class ErrorModule extends Error {
    constructor(message, reason) {
        super(message);
        this.message = message;
        this.name = ErrorModule.name;
        this.stack = reason;
        Error.captureStackTrace(this, ErrorModule);
    }
}
exports.ErrorModule = ErrorModule;
