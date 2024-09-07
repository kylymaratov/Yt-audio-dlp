import { TStreamingData } from "./streaming-data";
import { TDetails } from "./audio";

export interface TPlayerResponse {
    videoDetails: TDetails;
    streamingData: TStreamingData;
    playabilityStatus: {
        status: "LOGIN_REQUIRED" | "OK";
        reason: string;
        contextParams: string;
    };
}
export interface TFetchHTMLResponse {
    htmlContent: any;
    headers: any;
}
