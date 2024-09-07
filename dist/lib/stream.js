"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudioStream = getAudioStream;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const stream_1 = require("stream");
const fetcher_1 = require("./fetcher");
function parseTimemark(timemark) {
    const [hours, minutes, seconds] = timemark.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
function convertVideoToAudio(audio, videoStream) {
    return new Promise((resolve, reject) => {
        const temporaryBuffer = new stream_1.PassThrough();
        const audioStream = new stream_1.Readable({
            read(size) { },
        });
        (0, fluent_ffmpeg_1.default)()
            .input(videoStream)
            .inputFormat("mp4")
            .noVideo()
            .audioCodec("libopus")
            .audioChannels(audio.formats[0].audioChannels)
            .outputOptions([`-b:a`, "128k", `-t`, audio.details.lengthSeconds])
            .toFormat("webm")
            .on("progress", (progress) => {
            const percentage = (parseTimemark(progress.timemark) /
                Number(audio.details.lengthSeconds)) *
                100;
            process.stdout.write(`\r Compiling progress: ${percentage.toFixed(2)}%`);
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
function getAudioStream(_a) {
    return __awaiter(this, arguments, void 0, function* ({ audio, headers, }) {
        const videoStream = yield (0, fetcher_1.fetchVideo)(audio.formats[0], headers);
        const audioStream = yield convertVideoToAudio(audio, videoStream);
        return audioStream;
    });
}
