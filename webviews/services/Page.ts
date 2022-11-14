/* eslint-disable curly */
import State from "./State";

export default class Page {

    public static pagLogin:string = 'login';
    public static pagDash:string = 'dash';
    

    private static funcEvent: any = (page: string, type: string) => { };

    public static clean() {
        State.set('page', []);
    }

    public static setScroll(id: any, time: number = 0) {
        window.setTimeout(() => {
            window.scrollTo(0, State.get('scroll_' + id) || 0);
        }, time);
    }

    public static addEventListener(funcPage: any) {
        Page.funcEvent = funcPage;
    }

    public static back() {
        const page = Page.get() || 'dash';
        Page.funcEvent(page, 'back');
    }

    public static put(page: string) {
        Page.funcEvent(page, 'put');
    }

    public static set(page: string) {
        const pp = State.get('page') || [];
        if (!pp.length || pp[pp.length - 1] !== page) {
            pp.push(page);
            if (pp.length > 9) pp.shift();
            State.set('page', pp);
        }
    }

    public static get() {
        let pp = State.get('page');
        pp = pp instanceof Array ? pp : [];
        let page: any = null;
        if (pp.pop()) page = pp.pop();
        State.set('page', pp);
        return page;
    }

    public static last() {
        let pp = State.get('page') || [];
        let page = pp.pop();
        State.set('page', pp);
        return page;
    }
}
