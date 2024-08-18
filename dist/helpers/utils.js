"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClientPlaybackNonce = void 0;
const generateClientPlaybackNonce = (length) => {
    const CPN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    return Array.from({ length }, () => CPN_CHARS[Math.floor(Math.random() * CPN_CHARS.length)]).join("");
};
exports.generateClientPlaybackNonce = generateClientPlaybackNonce;
