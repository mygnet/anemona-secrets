/* eslint-disable curly */
import { vscode } from "./vscode";

export default class State {

    private static rd: any = {};
    private static funcEvent: any = (cmd: string, type: string) => { };
    public static addEventListener(funcPage: any) {
        State.funcEvent = funcPage;
    }

    public static run(cmd: string, data?: any) {
        State.funcEvent(cmd, data);
    }

    public static drop() {
        State.rd = {};
        vscode.setState(State.rd);
    }

    public static get(id: string, val: any = null): any {
        if (State.rd[id]) return State.rd[id];
        State.rd = vscode.getState() || {};
        if (State.rd[id]) return State.rd[id];
        if (val !== null) {
            State.set(id, val);
            return val;
        }
        return null;
    }

    public static set(id: string, data: any) {
        State.rd[id] = data;
        vscode.setState(State.rd);
    }

    public static dispatch(el: any, fun: any) {
        if (el) return fun(true);
        window.setTimeout(() => {
            if (typeof fun === 'function') fun((ex: any) => {
                State.dispatch(ex, fun);
            });
        }, 100);
    }
};
