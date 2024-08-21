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
import { TOptions, TResponseOptions } from "./types/options";
import { TVideo } from "./types/video-details";
import ErrorModule from "./core/error";
import MyTor from "./core/tor";

class YoutubeDlp {
    async getVideoById(
        id: string,
        options: TOptions = defautlOptions,
        try_count: number = 0
    ): Promise<{ video: TVideo; responseOptions: TResponseOptions }> {
        try {
            try_count++;
            if (!checkVideoId(id)) throw new Error("Invalid video id");
            const webData = await fetchHtml(youtubeUrls.main + id, options);
            const video = exctractVideoInfo(webData.htmlContent);
            options.cookies = options.cookies
                ? options.cookies
                : webData.cookies;
            const androidData = await fetchAndroidJsonPlayer(id, options);
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

            const validatedVideo = await validateByOptions(video, options);

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
            if (
                (e as ErrorModule).stack === "LOGIN_REQUIRED" &&
                options.torRequest &&
                try_count <= ALLOWED_TRY_COUNT
            ) {
                await new MyTor().newNym();
                return this.getVideoById(id, options);
            }
            throw e;
        }
    }

    async getVideoByHtml(
        htmlContent: string,
        options: TOptions = defautlOptions,
        try_count: number = 5
    ): Promise<TVideo> {
        try {
            const video = exctractVideoInfo(htmlContent);
            const scripts = await extractFunctions(htmlContent);
            const androidData = await fetchAndroidJsonPlayer(
                video.videoDetails.videoId,
                options
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

            const validatedVideo = validateByOptions(video, options);

            return validatedVideo;
        } catch (e) {
            if (
                (e as ErrorModule).stack === "LOGIN_REQUIRED" &&
                options.torRequest &&
                try_count <= ALLOWED_TRY_COUNT
            ) {
                await new MyTor().newNym();
                return this.getVideoByHtml(htmlContent, options);
            }
            throw e;
        }
    }

    async newTorNym() {
        return await new MyTor().newNym();
    }
}

export default YoutubeDlp;

new YoutubeDlp()
    .getVideoById("IhDk7W7Sj40", {
        format: "all",
        torRequest: false,
    })
    .then((res) => console.log(res.video));
