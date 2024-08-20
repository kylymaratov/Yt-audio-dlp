import axios from "axios";
//
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
                await axios.head(f.url, { timeout: 5000 });
                work_formats.push(f);
            } catch (e) {
                continue;
            }
        }
        video.adaptiveFormats = work_formats;
    }

    return video;
};
