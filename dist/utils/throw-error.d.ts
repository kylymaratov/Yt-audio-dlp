type ErrorReason = "LOGIN_REQUIRED" | "CORE_ERROR" | "INCORRECT_HTML" | "CONTENT_NOT_AVAILABLE";
declare class ErrorModule extends Error {
    constructor(message: string, reason?: ErrorReason);
}
export { ErrorModule };
