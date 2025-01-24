import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

//TODO:

  let disposable = vscode.commands.registerCommand('mate-ninja-s-tweaks.generateHtmlStructure', async (uri: vscode.Uri) => {
    let targetFolder: string | undefined;

    // Jeśli URI jest podane (kliknięcie w eksploratorze), użyj go
    if (uri && fs.statSync(uri.fsPath).isDirectory()) {
      targetFolder = uri.fsPath;
    } else {
      // Jeśli komenda jest wywołana z konsoli, zapytaj użytkownika o folder
      const folderPick = await vscode.window.showWorkspaceFolderPick();
      if (folderPick) {
        targetFolder = folderPick.uri.fsPath;
      }
    }

    if (!targetFolder) {
      vscode.window.showErrorMessage("Folder wasn't chosen. Please right click on a folder or choose one from a list.");
      return;
    }

    // Zapytaj użytkownika, czy stworzyć nowy podfolder
    const createSubFolder = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: "Do you want to create a subfolder or generate in the selected folder?",
    });

    if (!createSubFolder) {
      vscode.window.showErrorMessage("Operation canceled");
      return;
    }

    let finalFolder = targetFolder;

    if (createSubFolder === "Yes") {
      const newFolderName = await vscode.window.showInputBox({
        prompt: "Choose a name for the folder",
        placeHolder: "New Folder",
      });

      if (!newFolderName) {
        vscode.window.showErrorMessage("Folder name not specified");
        return;
      }

      finalFolder = path.join(targetFolder, newFolderName);

      // Stwórz nowy folder
      if (!fs.existsSync(finalFolder)) {
        fs.mkdirSync(finalFolder);
      }
    }

    const config = vscode.workspace.getConfiguration("mateninjasTweaks");
    const htmlLang = config.get<string>("htmlLang") || "en";

    // Ścieżki do plików
    const htmlPath = path.join(finalFolder, "index.html");
    const cssPath = path.join(finalFolder, "style.css");
    const jsPath = path.join(finalFolder, "script.js");

    // Treści plików
    const htmlContent = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>
<body>
    <script src="script.js"></script>
</body>
</html>`;

    // Tworzenie plików
    fs.writeFileSync(htmlPath, htmlContent);
    fs.writeFileSync(cssPath, "");
    fs.writeFileSync(jsPath, "");

    vscode.window.showInformationMessage("Structure generated with no errors!");
  });

  //TODO:

  const openPastebinCommand = vscode.commands.registerCommand('mate-ninja-s-tweaks.openPastebin', async () => {
    // Zapytaj użytkownika o końcówkę linku
    const pastebinKey = await vscode.window.showInputBox({
      prompt: "Input the end of the pastebin code",
      placeHolder: "XXXXXXXX",
    });

    if (!pastebinKey) {
      vscode.window.showErrorMessage("Canceled");
      return;
    }

    // Zbudowanie pełnego linku
    const pastebinUrl = `https://pastebin.com/${pastebinKey}`;

    // Otwórz link w przeglądarce
    vscode.env.openExternal(vscode.Uri.parse(pastebinUrl));

    vscode.window.showInformationMessage(`Opened Pastebin link: ${pastebinUrl}`);
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(openPastebinCommand);

}

export function deactivate() {}
