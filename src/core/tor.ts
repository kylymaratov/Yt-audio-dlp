import { TTorOptions } from "@/types/options";
import TorControl from "tor-control";

class MyTor extends TorControl {
    constructor(torOptions?: TTorOptions) {
        super({
            host: torOptions?.host || "127.0.0.1",
            port: torOptions?.port || 9050,
            password: torOptions?.password || "",
        });
    }

    async newNym() {
        try {
            await this.signal("NEWNYM");

            console.info("Tor nodes have been changed.");

            return;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
}

export default MyTor;
