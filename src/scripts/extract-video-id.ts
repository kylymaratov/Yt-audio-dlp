export function extractVideoId(url: string): string | null {
    if (!url) return null;

    const regex =
        /(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|watch\?v=)|.*[?&]v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
