import ffmpeg from "fluent-ffmpeg";
import { PassThrough, Readable } from "stream";
import { TAudio } from "@/youtube/types/audio";
import { fetchVideo } from "./fetcher";
import { TCodecs, TOutputFormats } from "@/youtube/types/options";

function parseTimemark(timemark: string): number {
    const [hours, minutes, seconds] = timemark.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}

function convertVideoToAudio(
    audio: TAudio,
    videoStream: Readable,
    outputFormat: TOutputFormats
): Promise<Readable> {
    return new Promise((resolve, reject) => {
        const temporaryBuffer = new PassThrough();
        const audioStream = new Readable({
            read(size) {},
        });

        ffmpeg()
            .input(videoStream)
            .inputFormat("mp4")
            .noVideo()
            .audioCodec(TCodecs[outputFormat])
            .audioChannels(audio.formats[0].audioChannels)
            .outputOptions([`-b:a`, "128k", `-t`, audio.details.lengthSeconds])
            .toFormat(outputFormat)
            .on("progress", (progress) => {
                const percentage =
                    (parseTimemark(progress.timemark) /
                        Number(audio.details.lengthSeconds)) *
                    100;
                process.stdout.write(
                    `\r Compiling progress: ${percentage.toFixed(2)}%`
                );
            })
            .on("error", (err) => reject(err))
            .pipe(temporaryBuffer, { end: true });

        temporaryBuffer.on("end", () => {
            audioStream.push(null);
            process.stdout.write("\r\x1b[2K");
            resolve(audioStream);
        });

        temporaryBuffer.on("data", (chunk) => {
            audioStream.push(chunk);
        });

        temporaryBuffer.on("error", (err) => {
            reject(err);
        });
    });
}

async function getAudioStream(
    audio: TAudio,
    headers: any,
    outputFormat: TOutputFormats
): Promise<Readable> {
    const videoStream = await fetchVideo(audio.formats[0], headers);

    const audioStream = await convertVideoToAudio(
        audio,
        videoStream,
        outputFormat
    );

    return audioStream;
}

export { getAudioStream };
