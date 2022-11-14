/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable curly */
import { ExtensionContext, WebviewView, commands, window, env } from "vscode";
import { existsSync } from 'fs';
import { basename, dirname } from 'path';

type FunCallPage = (data: any, opc: number) => {};

export default class Core {
    public static id: string = 'iH5421';
    private ses: any;
    public ver: string = '0.0.8';
    public data: any;
    public author: any;
    public lang: string = env.language || 'en';
    public path: string;
    public cmdExe = commands.executeCommand;
    public cmdReg = commands.registerCommand;

    constructor(
        public name: string,
        public context: ExtensionContext,
        public view?: WebviewView
    ) {
        this.ses = {
            id: name + '.session'
        };
        this.ver = require('../../package.json')['version'];
        this.author = require('../../package.json')['author'];
        this.path = '';
        this.data = null;
        this.setMenu(1);
    }

    public get(id: string) {
        return this.getStsGlobal(this.ses.id + id);
    }

    public set(id: string, data: any) {
        this.setStsGlobal(this.ses.id + id, data);
    }

    public updSession(data: any) {
        this.dataSession(data);
    }

    public loadSession(): any {
        this.data = this.data ? this.data : this.getStsGlobal(this.ses.id);
    }

    public dataSession(data: any) {
        this.data = data;
        this.setStsGlobal(this.ses.id, this.data);
    }

    public async loginSession(data: any, callback: FunCallPage) {
        if (data && data.file) {
            if (existsSync(data.file)) {
                data.id = basename(data.file);
                data.name = data.id.replace('.secrets', '');
                data.path = dirname(data.file);
                this.setSession(data);
                return callback(this.data, 2);
            }
        }
        callback(null, 1);
    }

    public setSession(data: any) {
        this.updSession(data);
    }

    public globalSession(callback: FunCallPage) {
        this.loadSession();
        if (this.data && this.data.id) {
            const rd = this.data;
            rd.lang = this.lang;
            rd.success = true;
            this.setSession(this.data);
            callback(rd, 2);
        } else {
            callback({ success: false, lang: this.lang }, 1);
        }
    }

    public initSession(data: any, callback: FunCallPage) {
        this.setSession(data);
        callback({ success: true, lang: this.lang }, 2);
    }

    public dropSession(callback: FunCallPage) {
        this.data = null;
        this.setStsGlobal('keys-anemona', []);
        this.setStsGlobal(this.ses.id, this.data);
        callback({ success: true }, 1);
    }

    public routeSession(cmd: [string], data: any, callback: any) {
        switch (cmd.shift()) {
            case "global": return this.globalSession(callback);
            case "init": return this.initSession(data, callback);
            case "drop": return this.dropSession(callback);
            case "login": return this.loginSession(data, callback);
        }
    }

    public session(cmd: [string], req: any) {
        const _cmd = 'session/' + cmd.join('/');
        this.postCmd('lang', this.lang);
        this.routeSession(cmd, req.content, (data: any, opc: number) => {
            this.setMenu(opc);
            this.postCmd(_cmd, data || {});
        });
    }

    public vars(id: string, req: any) {
        //console.log('var:', id);
        this.postCmd(req.command, this.getStsGlobal(id) || {});
    }

    public clear(type: string, data: any = null) {
        this.setStsGlobal(type, data);
    }

    public initLang() {
        this.lang = this.lang;
    }

    public loadLang(cmd: [string], req: any) {
        this.postCmd(req.command, this.lang);
    }

    public setLang(lang: string) {
        this.lang = lang;
        this.setStsGlobal('lang', lang);
    }

    public getStsGlobal(key: string): any {
        return this.context.globalState.get(key);
    }

    public setStsGlobal(key: string, data: any): void {
        this.context.globalState.update(key, data);
        this.context.globalState.setKeysForSync([key]);
    }

    public delStsGlobal(key: string): void {
        this.context.globalState.update(key, undefined);
    }

    public setCtx(id: string, value: any): void {
        this.cmdExe('setContext', this.name + '.' + id, value);
    }

    public setMenu(option: number): void {
        this.setCtx('idMenuOption', option);
    }

    public postCmd(cmd: string, data: any = {}): void {
        this.view?.webview.postMessage({ cmd: cmd, dat: data });
    };

    public setView(view: WebviewView) {
        this.view = view;
    };

    public winMsgInfo(message: string | undefined) {
        if (message) window.showInformationMessage(message);
    }
    public winMsgError(message: string | undefined) {
        if (message) window.showErrorMessage(message);
    }

    public async winOpenFile(filters: any) {
        return await window.showOpenDialog({
            // title: title,
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'Files': filters }
        });
    }

    public async winSaveFile(filters: any) {
        return await window.showSaveDialog({
            filters: { 'Files': filters }
        });
    }
}