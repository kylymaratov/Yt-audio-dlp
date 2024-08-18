export const generateClientPlaybackNonce = (length: number): string => {
    const CPN_CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    return Array.from(
        { length },
        () => CPN_CHARS[Math.floor(Math.random() * CPN_CHARS.length)]
    ).join("");
};
