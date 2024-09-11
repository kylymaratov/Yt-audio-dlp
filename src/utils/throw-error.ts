type ErrorReason =
    | "LOGIN_REQUIRED"
    | "CORE_ERROR"
    | "INCORRECT_HTML"
    | "CONTENT_NOT_AVAILABLE";

class ErrorModule extends Error {
    constructor(message: string, reason?: ErrorReason) {
        super(message);

        this.message = message;
        this.name = ErrorModule.name;
        this.stack = reason;

        Error.captureStackTrace(this, ErrorModule);
    }
}

export { ErrorModule };
