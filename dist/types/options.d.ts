export interface TOptions {
    format?: "audio" | "video" | "all";
    checkWorkingLinks?: boolean;
    torRequest?: boolean;
    userAgent?: string;
    cookies?: string;
}
export interface TResponseOptions {
    web: {
        userAgent: string;
        cookies: string;
    };
    android: {
        userAgent: string;
        cookies: string;
    };
}
