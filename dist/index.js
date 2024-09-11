"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./path-register");
const youtube_module_1 = __importDefault(require("./libs/youtube/youtube-module"));
class AudioDownloader {
    constructor() {
        this.youtube = new youtube_module_1.default();
    }
}
exports.default = AudioDownloader;
