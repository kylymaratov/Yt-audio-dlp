import { ErrorReason } from "@/youtube/types/error-reason";
declare class ErrorModule extends Error {
    constructor(message: string, reason?: ErrorReason);
}
export default ErrorModule;
