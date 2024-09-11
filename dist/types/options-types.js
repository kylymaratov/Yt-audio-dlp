"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCodecs = void 0;
var TCodecs;
(function (TCodecs) {
    TCodecs["webm"] = "libvorbis";
    TCodecs["mp3"] = "libmp3lame";
    TCodecs["wav"] = "pcm_s16le";
    TCodecs["opus"] = "opus";
    TCodecs["ogg"] = "libvorbis";
})(TCodecs || (exports.TCodecs = TCodecs = {}));
