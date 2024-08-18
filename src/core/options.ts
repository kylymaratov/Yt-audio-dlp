import axios, { AxiosError } from "axios";
import { TOptions } from "@/types/options";
import { TVideo } from "@/types/video-details";

export const validateByOptions = async (
    video: TVideo,
    opt: TOptions
): Promise<TVideo> => {
    if (opt.format === "audio") {
        video.adaptiveFormats = video?.adaptiveFormats.filter((f) =>
            f.mimeType.includes("audio/")
        );
    }

    if (opt.format === "video") {
        video.adaptiveFormats = video?.adaptiveFormats.filter((f) =>
            f.mimeType.includes("video/")
        );
    }

    if (opt.checkWorkingLinks) {
        const work_formats = [];
        for (let f of video.adaptiveFormats) {
            try {
                if (!f.url) continue;
                const response = await axios.head(f.url, { timeout: 5000 });
                work_formats.push(f);
                console.log(response.status);
            } catch (e) {
                console.log((e as AxiosError).response?.status);
                continue;
            }
        }
        video.adaptiveFormats = work_formats;
    }

    return video;
};
