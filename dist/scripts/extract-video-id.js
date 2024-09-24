"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVideoId = extractVideoId;
function extractVideoId(url) {
    if (!url)
        return null;
    const regex = /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|watch\?v=)|.*[?&]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
