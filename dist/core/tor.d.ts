import TorControl from "tor-control";
declare class MyTor extends TorControl {
    constructor(host?: string, port?: number, password?: string);
    newNym(): Promise<void>;
}
export default MyTor;
