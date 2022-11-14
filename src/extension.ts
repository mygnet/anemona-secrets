/* eslint-disable curly */
import { ExtensionContext, window } from "vscode";
import { SidebarProvider } from "./containers/SidebarProvider";
import Core from "./services/Core";

export function activate(context: ExtensionContext) {
  const core = new Core('vscode-anemona-secrets', context);
  const ext = core.name;
  const sidebarProvider = new SidebarProvider(context, core);
  context.subscriptions.push(
    window.registerWebviewViewProvider(ext + '-sidebar', sidebarProvider),
    core.cmdReg(ext + '.keys', () => sidebarProvider.page('page/keys')),
    core.cmdReg(ext + '.about', () => sidebarProvider.page('page/about')),
    core.cmdReg(ext + '.logout', () => sidebarProvider.page('page/logout')),
  );
}

export function deactivate() {
  //Services.dispose();
}
