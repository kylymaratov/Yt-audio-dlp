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
import { TOptions } from "./types/options";
import { TVideo } from "./types/video-details";
import ErrorModule from "./core/error";
import MyTor from "./core/tor";

class YoutubeDlp {
    async getVideoById(
        id: string,
        options: TOptions = defautlOptions,
        try_count: number = 0
    ): Promise<TVideo> {
        try {
            try_count++;
            if (!checkVideoId(id)) throw new Error("Invalid video id");
            const htmlContent = await fetchHtml(
                youtubeUrls.main + id,
                options.torRequest
            );
            const video = exctractVideoInfo(htmlContent);
            const adaptiveFormats = await fetchAndroidJsonPlayer(
                id,
                options.torRequest
            );
            const scripts = await extractFunctions(htmlContent);

            video?.formats.map((format) =>
                desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                )
            );

            video.adaptiveFormats = adaptiveFormats.map((format) =>
                desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                )
            );

            return await validateByOptions(video, options);
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
            const adaptiveFormats = await fetchAndroidJsonPlayer(
                video.videoDetails.videoId,
                options.torRequest
            );

            video.formats.map((format) => {
                return desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                );
            });

            video.adaptiveFormats = adaptiveFormats.map((format) =>
                desipherDownloadURL(
                    format,
                    scripts.decipher,
                    scripts.nTransform
                )
            );

            return await validateByOptions(video, options);
        } catch (e) {
            if (
                (e as ErrorModule).stack === "LOGIN_REQUIRED" &&
                options.torRequest &&
                try_count <= ALLOWED_TRY_COUNT
            ) {
                await new MyTor().newNym();
                return this.getVideoById(htmlContent, options);
            }
            throw e;
        }
    }
}

export default YoutubeDlp;

new YoutubeDlp()
    .getVideoById("dylyj3xObJo", { format: "audio", torRequest: true })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
