import { ErrorReason } from "@/types/error";
declare class ErrorModule extends Error {
    constructor(message: string, reason?: ErrorReason);
}
export default ErrorModule;
