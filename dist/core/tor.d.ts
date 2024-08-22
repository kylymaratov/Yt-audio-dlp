import { TTorOptions } from "@/types/options";
import TorControl from "tor-control";
declare class MyTor extends TorControl {
    constructor(torOptions?: TTorOptions);
    newNym(): Promise<void>;
}
export default MyTor;
