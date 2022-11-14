import { vscode } from "./vscode";
export default class Command {

    private static db: any = {};

    public static call(rq: any) {
        if (rq && rq.cmd) {
            if (typeof Command.db[rq.cmd] === 'function') {
                Command.db[rq.cmd](rq.dat || null);
                Command.db[rq.cmd] = undefined;
                return true;
            }
        }
        return false;
    }

    public static clear(id: string, data: any = null) {
        Command.send("clear", { id: id, data: data });
    }

    public static send(command: string, data: any = null, func: any = null) {
        if (typeof data === 'function') {
            func = data;
            data = {};
        }
        const content = data || {};
        if (typeof func === 'function') {
            Command.db[command] = func;
        }
        return vscode.postMessage({ command: command, content: content });
    }

}
