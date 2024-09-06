import { TFormat } from "./format";
import vm from "vm";
export interface TThumbail {
    url: string;
    width: number;
    height: number;
}
export interface TDetails {
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
}
export interface TAudio {
    details: TDetails;
    formats: TFormat[];
}
export interface TScripts {
    decipher: vm.Script | null;
    nTransform: vm.Script | null;
}
