import { TStreamingData } from "./streaming-data";
import { TVideoDetails } from "./video-details";
export interface TPlayerResponse {
    videoDetails: TVideoDetails;
    streamingData: TStreamingData;
    playabilityStatus: {
        status: "LOGIN_REQUIRED" | "OK";
        reason: string;
        contextParams: string;
    };
}
