import { TFormat } from "./format";
export interface TThumbail {
    url: string;
    width: number;
    height: number;
}
export interface TVideoDetails {
    videoId: string;
    title: string;
    lengthSeconds: string;
    keywords: string[];
    channelId: string;
    isOwnerViewing: boolean;
    shortDescription: string;
    isCrawlable: boolean;
    thumbnail: {
        thumbnails: TThumbail[];
    };
    allowRatings: boolean;
    viewCount: string;
    author: string;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    isLiveContent: boolean;
    urlsExpire?: number;
}
export interface TVideo {
    videoDetails: TVideoDetails;
    formats: TFormat[];
    adaptiveFormats: TFormat[];
}
