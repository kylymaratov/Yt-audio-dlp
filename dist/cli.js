#!/usr/bin/env node
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
const _1 = __importDefault(require("."));
const stream_1 = require("stream");
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const extract_video_id_1 = require("./scripts/extract-video-id");
const program = new commander_1.Command();
program
    .version("1.0.5")
    .description("Node.js library for downloading songs from popular music platforms")
    .option("-u, --url <type>", "Youtube audio url")
    .option("-f, --format <type>", "mp3, web, ogg, opus, wav formats")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const youtubeAudio = new _1.default();
        const { url, format = "mp3" } = options;
        const id = (0, extract_video_id_1.extractVideoId)(url);
        if (!id) {
            throw new Error("Incorrect url");
        }
        const { buffer, audio } = yield youtubeAudio.getAudioById(id, {
            outputFormat: format,
        });
        const stream = stream_1.Readable.from(buffer);
        const outputPath = (0, fs_1.createWriteStream)((0, path_1.join)(process.cwd(), `${audio.details.title} - ${audio.details.videoId}.${format}`));
        stream.pipe(outputPath);
        console.info(`${audio.details.title} download complete!`);
    }
    catch (error) {
        console.error("Error:", error.message);
    }
    finally {
        process.exit(1);
    }
}));
program.parse(process.argv);
