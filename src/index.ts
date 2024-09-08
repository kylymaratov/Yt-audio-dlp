import "./path-register";
import Youtube from "./youtube/youtube";

class AudioDownloader {
    public readonly youtube: Youtube = new Youtube();
}

export default AudioDownloader;
