import TorControl from "tor-control";

class MyTor extends TorControl {
    constructor(host?: string, port?: number, password?: string) {
        super({
            host: host || "127.0.0.1",
            port: port || 9050,
            password: password || "",
        });
    }

    async newNym() {
        try {
            await this.authenticate();
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
