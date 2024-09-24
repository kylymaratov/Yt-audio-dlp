import axios from "axios";
import { youtubeUrls } from "@/constants/constants";
import { HTML5_PLAYER_REGEX } from "@/regexp";
import { getRandomUserAgent } from "@/utils/get-user-agent";
import { TFetchHTMLResponse } from "@/types/player-response-types";
import { logger } from "@/utils/logger";
import { SocksProxyAgent } from "socks-proxy-agent";
import { TOptions } from "@/types/options-types";

export const fetchHtmlPage = async (
    id: string,
    options: TOptions
): Promise<TFetchHTMLResponse> => {
    let socksProxy;

    const url = youtubeUrls.video + id + "&sttick=0";

    if (options.socks) {
        logger(`Fetching html page: ${url} with socks ${options.socks} ...`);
        socksProxy = new SocksProxyAgent(options.socks);
        options.proxy = undefined;
    } else if (options.proxy) {
        options.socks = undefined;
        logger(
            `Fetching html page: ${url} with proxy ${options.proxy.host} ...`
        );
    } else {
        logger(`Fetching html page: ${url}...`);
    }

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
    const response = await axios.get(url, {
        headers,
        proxy: options.proxy,
        httpAgent: socksProxy,
        httpsAgent: socksProxy,
    });

    headers["Cookie"] = response.headers["set-cookie"]?.toString() || "";

    return {
        htmlContent: response.data,
        headers,
        socksProxy,
        proxy: options.proxy,
    };
};

export const fetchtHTML5Player = async (webData: TFetchHTMLResponse) => {
    const html5PlayerRes = HTML5_PLAYER_REGEX.exec(webData.htmlContent);
    const html5PlayerUrl = html5PlayerRes
        ? html5PlayerRes[1] || html5PlayerRes[2]
        : "";
    const requestUrl = youtubeUrls.main + html5PlayerUrl;

    logger(`Fetching player js: ${requestUrl} ...`);

    const response = await axios.get(requestUrl, {
        headers: webData.headers,
        proxy: webData.proxy,
        httpAgent: webData.socksProxy,
        httpsAgent: webData.socksProxy,
    });

    return response.data;
};
