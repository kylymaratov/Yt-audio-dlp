import "./path-register";
import { defautlOptions, youtubeUrls } from "@/helpers/constants";
import { checkVideoId } from "@/regexp/check-regexp";
import {
    fetchAndroidJsonPlayer,
    fetchAudioStream,
    fetchHtml,
    fetchHtmlByPuppeteer,
} from "@/core/fetcher";
import { exctractVideoInfo } from "@/core/exctractor";
import { extractFunctions, desipherDownloadURL } from "@/core/desipher";
import { validateByOptions } from "./core/options";
import ffmpeg from "fluent-ffmpeg";
import { TOptions } from "./types/options";
import { TVideo } from "./types/video-details";
import { TAudioFormat } from "./types/format";

class YoutubeDlp {
    async getVideoById(
        id: string,
        options: TOptions = defautlOptions
    ): Promise<TVideo> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");
            const htmlContent = await fetchHtml(youtubeUrls.main + id);
            const video = exctractVideoInfo(htmlContent);
            const adaptiveFormats = await fetchAndroidJsonPlayer(id);
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
            throw e;
        }
    }

    async getAudioStreamById(
        id: string,
        format: TAudioFormat = "mp3"
    ): Promise<{ video: TVideo; stream: ffmpeg.FfmpegCommand }> {
        try {
            if (!checkVideoId(id)) throw new Error("Invalid video id");

            const video = await this.getVideoById(id);

            const stream = await fetchAudioStream(
                video.formats[0].url || "",
                format
            );

            return { video, stream };
        } catch (e) {
            throw e;
        }
    }

    async getAudioStreamByHtml(
        htmlContent: string,
        format: TAudioFormat = "mp3"
    ): Promise<{ video: TVideo; stream: ffmpeg.FfmpegCommand }> {
        try {
            const video = await this.getVideoByHtml(htmlContent);

            const stream = await fetchAudioStream(video.formats[0].url, format);

            return { video, stream };
        } catch (e) {
            throw e;
        }
    }

    async getVideoByHtml(
        htmlContent: string,
        options: TOptions = defautlOptions
    ): Promise<TVideo> {
        try {
            const video = exctractVideoInfo(htmlContent);
            const scripts = await extractFunctions(htmlContent);
            const adaptiveFormats = await fetchAndroidJsonPlayer(
                video.videoDetails.videoId
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
            throw e;
        }
    }
}

export default YoutubeDlp;

new YoutubeDlp()
    .getVideoById("dylyj3xObJo")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
