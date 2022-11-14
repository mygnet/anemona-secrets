import State from "./State";

/* eslint-disable curly */
const log = console.log;

export default class Debug {

    public static log(...args: any) {
        //args.unshift("Debugger: ");
        // State.run('debug', JSON.stringify(args)
        //     + "\n-----------------------------------------\n"
        // );
        log.apply(console, args);
    }

}
