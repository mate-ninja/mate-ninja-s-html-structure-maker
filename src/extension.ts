import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('mate-ninja-s-html-structure-maker.generateHtmlStructure', async () => {
    // Pobierz aktualnie wybrany folder w eksploratorze
    const selectedResource = vscode.window.activeTextEditor?.document.uri.fsPath || 
      (vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null);

    if (!selectedResource) {
      vscode.window.showErrorMessage("Nie znaleziono aktualnego folderu. Upewnij się, że masz otwarte repozytorium w VS Code.");
      return;
    }

    // Sprawdź, czy to folder
    const stats = fs.statSync(selectedResource);
    const baseFolder = stats.isDirectory() ? selectedResource : path.dirname(selectedResource);

    // Zapytaj użytkownika, czy stworzyć nowy folder
    const createSubFolder = await vscode.window.showQuickPick(["Tak", "Nie"], {
      placeHolder: "Czy chcesz stworzyć osobny folder?",
    });

    let finalFolder = baseFolder;

    if (createSubFolder === "Tak") {
      const newFolderName = await vscode.window.showInputBox({
        prompt: "Podaj nazwę nowego folderu",
        placeHolder: "NowyFolder",
      });

      if (!newFolderName) {
        vscode.window.showErrorMessage("Nie podano nazwy folderu.");
        return;
      }

      finalFolder = path.join(baseFolder, newFolderName);

      // Stwórz nowy folder
      if (!fs.existsSync(finalFolder)) {
        fs.mkdirSync(finalFolder);
      }
    }

    // Ścieżki do plików
    const htmlPath = path.join(finalFolder, "index.html");
    const cssPath = path.join(finalFolder, "style.css");
    const jsPath = path.join(finalFolder, "script.js");

    // Treści plików
    const htmlContent = `<!DOCTYPE html>
<html lang="PL-pl">
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

    vscode.window.showInformationMessage("Struktura wygenerowana!");
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
