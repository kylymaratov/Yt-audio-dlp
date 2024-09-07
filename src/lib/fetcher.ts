import axios from "axios";
import { youtubeUrls } from "@/helpers/constants";
import { HTML5_PLAYER_REGEX } from "@/regexp/regexp";
import { getRandomUserAgent } from "@/helpers/user-agent";
import { TFetchHTMLResponse } from "@/types/player-response";
import { TFormat } from "@/types/format";
import { Readable } from "stream";
import { customLog } from "./logs";

export const fetchHtml = async (id: string): Promise<TFetchHTMLResponse> => {
    const url = youtubeUrls.main + id + "&sttick=0";

    const userAgent = getRandomUserAgent();

    const headers: any = {
        "User-Agent": userAgent,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache, max-age=0",
        Origin: youtubeUrls.main,
        Referer: url,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: "",
    };

    const response = await axios.get(url, { headers });

    headers["Cookie"] = response.headers["set-cookie"]?.toString() || "";
    headers["Referer"] = url;

    customLog(`Fetching html page: ${url} success!`);

    return {
        htmlContent: response.data,
        headers,
    };
};

export const fetchtHTML5Player = async (webData: TFetchHTMLResponse) => {
    const html5PlayerRes = HTML5_PLAYER_REGEX.exec(webData.htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = youtubeUrls.base + html5PlayerUrl;

    const response = await axios.get(requestUrl, {
        headers: webData.headers,
    });

    customLog(`Fetching player js: ${requestUrl} success!`);

    return response.data;
};

export const fetchVideo = async (
    format: TFormat,
    headers: any
): Promise<Readable> => {
    const response = await axios.get(format.url, {
        headers,
        responseType: "arraybuffer",
        timeout: 60000,
    });
    customLog(`Fetching video ${format.mimeType} success!`);

    return Readable.from(response.data);
};
