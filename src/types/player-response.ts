import { TStreamingData } from "./streaming-data";
import { TVideoDetails } from "./video-details";

export interface TPlayerResponse {
    videoDetails: TVideoDetails;
    streamingData: TStreamingData;
}
