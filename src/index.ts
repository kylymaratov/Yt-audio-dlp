import "./path-register";
import Youtube from "./libs/Youtube/youtube-module";

export default class AudioDownloader {
    public readonly youtube: Youtube;

    constructor() {
        this.youtube = new Youtube();
    }
}
