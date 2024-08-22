import "./path-register";
import {
    ALLOWED_TRY_COUNT,
    defautlOptions,
    youtubeUrls,
} from "@/helpers/constants";
import { checkVideoId } from "@/regexp/check-regexp";
import { fetchAndroidJsonPlayer, fetchHtml } from "@/core/fetcher";
import { exctractVideoInfo } from "@/core/exctractor";
import { extractFunctions, desipherDownloadURL } from "@/core/desipher";
import { validateByOptions } from "./core/options";
import { TOptions, TResponseOptions, TTorOptions } from "./types/options";
import { TVideo } from "./types/video-details";
import TorControl from "./core/tor";

class YoutubeDlp {
    private options: TOptions;
    public tor: TorControl | null;

    constructor(options?: TOptions, torOptions?: TTorOptions) {
        this.options = options || defautlOptions;
        this.tor = options?.torRequest ? new TorControl(torOptions) : null;
    }

    async getVideoById(
        id: string,
        try_count: number = 2
    ): Promise<{ video: TVideo; responseOptions: TResponseOptions }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");

            const webData = await fetchHtml(
                youtubeUrls.main + id,
                this.options
            );

            const video = exctractVideoInfo(webData.htmlContent);
            const androidData = await fetchAndroidJsonPlayer(id, this.options);
            const scripts = await extractFunctions(webData.htmlContent);

            video?.formats.map((format) =>
                desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                )
            );

            video.adaptiveFormats = androidData.androidFormats.map((format) =>
                desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                )
            );

            const params = {
                userAgent: webData.userAgent,
                cookies: webData.cookies,
            };

            const validatedVideo = await validateByOptions(
                video,
                this.options,
                params
            );

            return {
                video: validatedVideo,
                responseOptions: {
                    web: {
                        userAgent: webData.userAgent,
                        cookies: webData.cookies,
                    },
                    android: {
                        userAgent: androidData.userAgent,
                        cookies: androidData.cookies,
                    },
                },
            };
        } catch (e) {
            if (this.tor && try_count <= ALLOWED_TRY_COUNT) {
                await this.tor.updateNodes();
                return await this.getVideoById(id, try_count + 1);
            }
            throw e;
        }
    }

    async getVideoByHtml(
        htmlContent: string,
        try_count: number = 2
    ): Promise<TVideo> {
        try {
            const video = exctractVideoInfo(htmlContent);
            const scripts = await extractFunctions(htmlContent);
            const androidData = await fetchAndroidJsonPlayer(
                video.videoDetails.videoId,
                this.options
            );

            video.formats.map((format) => {
                return desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                );
            });

            video.adaptiveFormats = androidData.androidFormats.map((format) =>
                desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                )
            );

            const params = {
                userAgent: androidData.userAgent,
                cookies: androidData.cookies,
            };

            const validatedVideo = validateByOptions(
                video,
                this.options,
                params
            );

            return validatedVideo;
        } catch (e) {
            if (this.tor && try_count <= ALLOWED_TRY_COUNT) {
                await this.tor.updateNodes();
                return await this.getVideoByHtml(htmlContent, try_count + 1);
            }
            throw e;
        }
    }
}

// const callEveryInterval = (interval: number = 10000): any => {
//     const ytb = new YoutubeDlp({ torRequest: true });

//     ytb.getVideoById("0Ybo3Nr-xLk").then((res) => console.log(res.video));

//     setInterval(() => {
//         ytb.getVideoById("0Ybo3Nr-xLk").then((res) => console.log(res.video));
//     }, interval);
// };

// callEveryInterval();

export default YoutubeDlp;
