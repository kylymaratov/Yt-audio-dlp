import axios from "axios";
import { youtubeUrls } from "@/helpers/constants";
import { HTML5_PLAYER_REGEX } from "@/regexp/regexp";
import { getRandomUserAgent } from "@/helpers/user-agent";
import { TFetchHTMLResponse } from "@/types/response";

export const fetchHtml = async (id: string): Promise<TFetchHTMLResponse> => {
    const url = youtubeUrls.main + id + "&sttick=0";

    console.info(`Fetching html page: ${url}`);

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

    console.info(`Fetching player js: ${requestUrl}`);

    const response = await axios.get(requestUrl, {
        headers: webData.headers,
    });

    return response.data;
};
