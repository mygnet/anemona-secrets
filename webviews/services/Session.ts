/* eslint-disable curly */
import State from "./State";
import Command from "./Command";
import Lang from "./Lang";
import Page from "./Page";

let rd: any = {};

export default class Session {

  public static isView: boolean = false;

  public static type: string = 'sidebar';

  public static set(data: any) {
    rd = data;
    State.set('session', rd);
  }

  public static get() {
    Session.load();
    return rd;
  }

  public static allow() {
    return rd && rd.id ? rd.allow : false;
  }

  public static load() {
    rd = rd && rd.id ? rd : State.get('session') || {};
  }

  public static wAuth() {
    return Command.send("session/init", rd, (rs: any) => {
      //
    });
  }

  public static onAuth(rs: any) {
    Lang.load(rs && rs.lang ? rs.lang : "en");
    if (Session.isView) {
      if (rs && rs.id) {
        rs.id && Session.set(rs);
        Page.put(Session.type);
      } else Page.put('closed');
    } else {
      if (rs && rs.success === true) {
        rs.id && Session.set(rs);
        const pag = Page.last();
        Page.put(pag ? (pag !== 'login' ? pag : 'dash') : "dash");
        State.run('refresh');
      } else return Command.send("session/drop", () => {
        Page.put("login");
      });
    }
  }

  public static auth(type: string) {
    Session.isView = type !== 'sidebar';
    Session.type = type;
    Session.load();
    if (Session.isView || (rd.id && rd.file)) {
      return Command.send("session/init", rd, (rs: any) => {
        Session.onAuth(rs);
      });
    }
    return Command.send("session/global", (rs: any) => {
      Session.onAuth(rs);
    });
  }

  public static login(rd: any, callback: any) {
    Command.send("session/login", rd, (session: any) => {
      if (session && session.id) {
        State.set("session", session);
        State.set("page", []);
        Command.send("reloads");
        callback(true);
      }
      callback(false);
    });
  }

  public static drop() {
    rd = {};
    State.set('session', rd);
    Command.send("session/drop", () => {
      Page.put("login");
    });
  }

}