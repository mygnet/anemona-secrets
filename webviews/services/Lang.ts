/* eslint-disable curly */

import langEs from "../../assets/lang/es.json";
import langEn from "../../assets/lang/en.json";

export default class Lang {
    public static id: string = 'en';
    public static rd: any = null;

    public static key(name: string) {
        const id = name.toLowerCase().replace(/[^a-z0-9-]/g, '');;
        return Lang.get(id) || name;
    }
    public static load(lang: string) {
        if (lang === 'es') Lang.rd = langEs;
        else if (lang === 'en') Lang.rd = langEn;
        Lang.id = lang;
    }

    public static get(key: string) {
        if (!Lang.rd) {
            Lang.rd = Lang.id === 'es' ? langEs : langEn;
        }
        return Lang.rd[key] || '';
    }

};

export const lang = Lang.get;
export const langKey = Lang.key;