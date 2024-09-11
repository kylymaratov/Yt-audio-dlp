import "./path-register";
import Youtube from "./libs/youtube/youtube-module";

export default class AudioDownloader {
    public readonly youtube: Youtube;

    constructor() {
        this.youtube = new Youtube();
    }
}
