/* eslint-disable curly */
import Core from './Core';
import Crypt from './Crypt';
import { workspace, window } from 'vscode';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const extension = 'keys-anemona';

export default class Keys {
    public static me?: Keys;
    constructor(private core: Core) { }

    public static self(core?: Core, cmd?: [string], req?: any) {
        if (!Keys.me) Keys.me = core ? new Keys(core) : undefined;
        if (Keys.me && cmd) Keys.me.router(cmd, req);
        return Keys.me;
    }

    public static putFileContent(file: string, rs: any) {
        rs = rs || {};
        writeFileSync(file, JSON.stringify(rs), { encoding: 'UTF-8' });
    }

    public static getFileContent(file: string) {
        const content: any = readFileSync(file, { encoding: 'UTF-8' });
        let rs: any = {};
        try {
            rs = JSON.parse(content);
        } catch (err: any) {
            rs = {};
        }
        return rs;
    }

    public async router(cmd: [string], req?: any) {
        switch (cmd.shift()) {
            case 'new': return this.newDocument(req);
            case 'open': return this.openDocument(req);
            case 'get': return this.getContent(req);
            case 'save': return this.saveContent(req);
            case 'lock': return this.lockContent(req);
            case 'unlock': return this.unlockContent(req);
            case 'export': return this.exportContent(req);
            case 'recent': return this.recent(req);
        }
    }
    /**
     *  Agrega el archivo a las variables global de recientes
     * @param file nombre absoluto del archivo
     * @returns 
     */
    public addRecent(file: string) {
        if (!file) return;
        let re = this.core.getStsGlobal('recent');
        re = re instanceof Array ? re : [];
        const idx = re.indexOf(file);
        if (idx > -1) re.splice(idx, 1);
        if (re.length > 20) re.pop();
        re.unshift(file);
        this.core.setStsGlobal('recent', re);
    }
    /**
     * 
     * @param req 
     */
    public async newDocument(req: any) {
        let file: string = '';
        const res = await this.core.winSaveFile(['secrets']);
        if (res) {
            //console.log('secret:', res);
            file = res.fsPath;
            const rs = { id: Crypt.md5(file) };
            Keys.putFileContent(file, rs);
        }
        this.addRecent(file);
        this.core.postCmd(req.command, file);
    }
    /**
     * 
     * @param req 
     */
    public async openDocument(req: any) {
        let file: string = '';
        const res = await this.core.winOpenFile(['secrets']);
        if (res && res.length) {
            file = res[0].fsPath;
            this.addRecent(file);
        }
        this.core.postCmd(req.command, file);
    }
    /**
     * Carga el contenido de un llavero
     * @param req 
     */
    public getContent(req: any) {
        const rd = req.content;
        let res: any = {};
        if (existsSync(rd.file)) {
            res = Keys.getFileContent(rd.file);
            if (!res.id) {
                res.id = res.id || Crypt.md5(rd.file);
                Keys.putFileContent(rd.file, res);
            }
            if (!res.lock) {
                if (res.data) res.data = JSON.parse(Crypt.decode(res.data, res.id));
                else res.data = [];
            }
            if (res.clue) {
                res.clue = Crypt.decode(res.clue, res.id);
            }
        } else {
            res = { error: 404, message: 'El archivo "' + rd.file + '" no localizado...' };
            this.core.winMsgError(res.message);
        }
        this.core.postCmd(req.command, res);
    }
    /**
     * Guarda el contenido de un llavero
     * @param req 
     */
    public async saveContent(req: any) {
        const rd = req.content;
        rd.data.lock = false;
        let rs: any = rd.data;
        rs.data = Crypt.encode(JSON.stringify(rd.data.data), rs.id);
        Keys.putFileContent(rd.key.file, rs);
        this.core.postCmd(req.command, { success: true });
    }
    /**
     * Exportar llaves
     * @param req 
     */
    public async exportContent(req: any) {
        const rd = req.content;
        let content: any = '';
        if (rd.format === 'txt') {
            for (const x in rd.data) {
                content += "\n";
                for (const id in rd.data[x])
                    content += "\n" + id + ": " + rd.data[x][id];
            }
        } else {
            content = rd.data;
            if (rd.format === 'key') {
                const uid = Crypt.md5(Math.random() + extension);
                content = {
                    type: extension,
                    uid: uid,
                    data: Crypt.encode(JSON.stringify(rd.data), uid + extension)
                };
            }
            content = JSON.stringify(content, null, 4);
        }
        const doc = await workspace.openTextDocument({ content: content, language: rd.format === 'txt' ? 'txt' : 'json' });
        await window.showTextDocument(doc);
        this.core.postCmd(req.command, { success: true });
    }
    /**
     * Desbloquea un llavero
     * @param req 
     * @returns 
     */
    public async unlockContent(req: any) {
        const rd = req.content;
        const key = rd.key;
        const rs = rd.data;
        let code: any = '';
        if (!rd.pwd) this.core.postCmd(req.command, { error: true });
        try {
            code = Crypt.decode(rs.data, rd.pwd + rs.id);
        } catch (err) {
            return this.core.postCmd(req.command, { error: true });
        }
        const res: any = {
            id: rs.id,
            lock: false,
            data: Crypt.encode(code, rs.id),
            order: rs.order ? 1 : 0
        };
        Keys.putFileContent(key.file, res);
        res.data = JSON.parse(code);
        this.core.postCmd(req.command, res);
    }
    /**
     *  Bloque una llavero
     * @param req 
     */
    public lockContent(req: any) {
        const rd = req.content;
        const key = rd.key;
        const rs = rd.data;
        //console.log('data content:::>>> ', rs);
        if (!rd.pwd) this.core.postCmd(req.command, { error: true });
        rs.data = Crypt.encode(JSON.stringify(rs.data), rd.pwd + rs.id);
        rs.lock = true;
        rs.clue = Crypt.encode(rd.clue || '*', rs.id);
        Keys.putFileContent(key.file, rs);
        rs.clue = '*';
        this.core.postCmd(req.command, rs);
    }

    public recent(req: any) {
        const rs: any = this.core.getStsGlobal('recent') || [];
        const rd: any = [];
        if (rs.length) {
            let ex = false;
            for (const x in rs) {
                if (existsSync(rs[x])) rd.push(rs[x]);
                else ex = true;
            }
            if (ex) {
                this.core.setStsGlobal('recent', rd);
            }
        }
        this.core.postCmd(req.command, rd);
    }
}