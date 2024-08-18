import "./path-register";
import { defautlOptions, youtubeUrls } from "@/helpers/constants";
import { checkVideoId } from "@/regexp/check-regexp";
import {
    fetchAndroidJsonPlayer,
    fetchAudioStream,
    fetchHtml,
} from "@/core/downloader";
import { exctractVideoInfo } from "./core/exctractor";
import { extractFunctions, desipherDownloadURL } from "./core/desipher";
import { TOptions } from "./types/options";
import { validateByOptions } from "./core/options";
import { TVideo } from "./types/video-details";
import ffmpeg from "fluent-ffmpeg";
import { TAudioFormat } from "./types/format";

export const getVideoById = async (
    id: string,
    options: TOptions = defautlOptions
): Promise<TVideo> => {
    try {
        if (!checkVideoId(id)) throw new Error("Invalid video id");
        const htmlContent = await fetchHtml(youtubeUrls.main + id);
        const video = exctractVideoInfo(htmlContent);
        const adaptiveFormats = await fetchAndroidJsonPlayer(id);
        const scripts = await extractFunctions(htmlContent);

        video?.formats.map((format) =>
            desipherDownloadURL(format, scripts.decipher, scripts.nTransform)
        );

        video.adaptiveFormats = adaptiveFormats.map((format) =>
            desipherDownloadURL(format, scripts.decipher, scripts.nTransform)
        );

        return await validateByOptions(video, options);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getAudioStreamById = async (
    id: string,
    format: TAudioFormat = "mp3"
): Promise<{ video: TVideo; stream: ffmpeg.FfmpegCommand }> => {
    try {
        if (!checkVideoId(id)) throw new Error("Invalid video id");

        const video = await getVideoById(id);

        const stream = await fetchAudioStream(
            video.formats[0].url || "",
            format
        );

        return { video, stream };
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getAudioStreamByHtml = async (
    htmlContent: string,
    format: TAudioFormat = "mp3"
): Promise<{ video: TVideo; stream: ffmpeg.FfmpegCommand }> => {
    try {
        const video = await getVideoByHtml(htmlContent);

        const stream = await fetchAudioStream(video.formats[0].url, format);

        return { video, stream };
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getVideoByHtml = async (
    htmlContent: string,
    options: TOptions = defautlOptions
): Promise<TVideo> => {
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
            desipherDownloadURL(format, scripts.decipher, scripts.nTransform)
        );

        return await validateByOptions(video, options);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

getVideoById("hl7_pm4lnP0").then((res) => console.log(res));
