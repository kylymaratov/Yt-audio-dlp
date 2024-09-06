import { ErrorReason } from "@/types/error";

class ErrorModule extends Error {
    constructor(message: string, reason?: ErrorReason) {
        super(message);

        this.message = message;
        this.name = ErrorModule.name;
        this.stack = reason;

        Error.captureStackTrace(this, ErrorModule);
    }
}

export default ErrorModule;
