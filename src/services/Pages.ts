/* eslint-disable curly */
import Core from './Core';

export default class Pages {

    public static me?: Pages;

    constructor(private core: Core) { }

    public static self(core?: Core, cmd?: [string], req?: any) {
        if (!Pages.me) Pages.me = core ? new Pages(core) : undefined;
        if (Pages.me && cmd) Pages.me.router(cmd, req);
        return Pages.me;
    }

    public async router(cmd: [string], req?: any) {
        switch (cmd.shift()) {
            case 'about': return this.core.postCmd('page/about');
            case 'keys': return this.core.postCmd('page/keys');
            case 'logout': return this.core.postCmd('page/logout');
            case 'login': return this.core.postCmd('page/login');
            case 'langEs': return this.changeLanguage('es');
            case 'langEn': return this.changeLanguage('en');
        }
    }

    public async changeLanguage(lang: string) {
        this.core.setLang(lang);
        if (this.core.data && this.core.data.id) this.core.setMenu(2);
        else this.core.setMenu(1);
        await this.core.cmdExe(this.core.name + '.refresh');
    }

}