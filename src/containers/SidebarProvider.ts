/* eslint-disable curly */
import { ExtensionContext, Webview, WebviewViewProvider, WebviewView, TextDocument, Uri, window, commands } from "vscode";
import { getNonce } from "../services/nonce";
import Core from "../services/Core";
import Keys from "../services/Keys";
import Pages from "../services/Pages";

export class SidebarProvider implements WebviewViewProvider {

  private readonly _extensionUri: Uri;
  public _view?: WebviewView;
  public _doc?: TextDocument;

  constructor(private readonly _context: ExtensionContext, public core: Core) {
    this.core = core;
    this._extensionUri = this._context.extensionUri;
  }

  public page(name: string) {
    this.command({ command: name, data: {} });
  }

  public async command(req: any) {
    req = req ? req : {};
    const cmd = req.command.split('/');
    //console.log('vsc recibe: ', req);
    this.core.initLang();
    switch (cmd.shift()) {
      case 'vars': return this.core.vars(cmd.shift(), req);
      case 'session': return this.core.session(cmd, req);
      case 'page': return Pages.self(this.core, cmd, req);
      case 'keys': return Keys.self(this.core, cmd, req);
    }
    switch (req.command) {
      case 'clear': return this.core.clear(req.content.id, req.content.data);
      case "reload": return this.core.postCmd('reload'); //await this.core.cmdExe(this.core.name + '.refresh-en');
      case "onInfo": return this.core.winMsgInfo(req.content);
      case "onError": return this.core.winMsgError(req.content);
    }
  }
  /**
   * 
   * @param webviewView 
   */
  public resolveWebviewView(webviewView: WebviewView) {
    this._view = webviewView;
    this.core?.setView(webviewView);
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (req:any) => await this.command(req));
  }
  /**
   * 
   * @param panel 
   */
  public revive(panel: WebviewView) {
    this._view = panel;
  }
  /**
   * 
   * @param webview 
   * @returns 
   */
  private _getHtmlForWebview(webview: Webview) {

    this.core.path = '' + webview.asWebviewUri(Uri.joinPath(this._extensionUri));

    const styleResetUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "assets", "css/reset.css")
    );
    const styleMainUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "dist", "App.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "assets", "css/vscode.css")
    );
    const styleBassCssUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "assets", "plugins/basscss/basscss.min.css")
    );
    const fontawesomeV6CssUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "assets", "plugins/fontawesome-6/css/all.min.css")
    );
    //Javascript
    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "dist", "App.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
	  <html lang="en">
	  	<head>
	  	    <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content=" font-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
	  	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	    <link href="${styleResetUri}" rel="stylesheet">
	  	    <link href="${styleVSCodeUri}" rel="stylesheet">
          <link href="${styleMainUri}" rel="stylesheet">
          <link href="${styleBassCssUri}" rel="stylesheet">
          <link href="${fontawesomeV6CssUri}" rel="stylesheet">
	  	</head>
        <body id="sidebar">
           <script nonce="${nonce}" src="${scriptUri}"></script>
	  	</body>
	  </html>`;
  }
}