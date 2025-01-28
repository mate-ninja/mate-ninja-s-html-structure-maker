import * as vscode from 'vscode';
import * as fs from 'fs';
import axios from 'axios';
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

  //TODO:

  const sendToServerCommand = vscode.commands.registerCommand('mate-ninja-s-tweaks.sendToServer', async () => {
    const message = await vscode.window.showInputBox({
      prompt: 'Enter the message to send to the server',
      placeHolder: 'Type your message here...',
    });

    if (!message) {
      vscode.window.showErrorMessage('Message is empty. Try again.');
      return;
    }

    const config = vscode.workspace.getConfiguration("mateninjasTweaks");
    const password = config.get<string>("serverPassword");
    const username = config.get<string>("serverUsername");

    if (!password) {
      vscode.window.showErrorMessage("Password was not set");
      return;
    }

    try {
      const response = await axios.post('https://vs-code-message-feed.glitch.me/send-message', {
        message,
        password,
        username
      });

      if (response.status === 200) {
        vscode.window.showInformationMessage('Message sent successfully!');
      }
    } catch (error: any) {
      vscode.window.showErrorMessage('Failed to send message. Check the server.');
      console.error(error);
    }
  });

  //FIXME:

  async function fetchMessage(serverPassword: string, listen : boolean) {
    try {

      if (!serverPassword || serverPassword.trim() === '') {
        vscode.window.showErrorMessage('Server password not configured.');
        return;
      }

      // Pobierz wiadomości z serwera z nagłówkiem autoryzacji
      const response = await axios.get('https://vs-code-message-feed.glitch.me/messages', {
        headers: {
          'x-api-key': serverPassword
        }
      });

      if (response.status === 200) {
        const messages = response.data;
        if (!messages || messages.length === 0) {
          if (!listen) {
            vscode.window.showInformationMessage('No messages found on the server.');
          } else {
            console.log('No messages found on the server.');
          }
          return;
        }
        if (!listen) {
          // Przygotuj treść wiadomości
          const formattedMessages = messages.map((msg: { text: string, sender: string }) => {
            return `${msg.sender}: ${msg.text}`
          }).join('\n');

          // Otwórz nowy dokument w edytorze VS Code
          const document = await vscode.workspace.openTextDocument({
            content: formattedMessages,
            language: 'plaintext' // Możesz zmienić język na 'markdown' lub inny, jeśli chcesz
          });

          // Pokaż dokument w edytorze
          await vscode.window.showTextDocument(document);
        } else {
          vscode.window.showInformationMessage("You've got mail!")
        }
      } else {
        vscode.window.showErrorMessage('Failed to fetch messages from the server.');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        vscode.window.showErrorMessage('Unauthorized: Invalid password.');
      } else {
        vscode.window.showErrorMessage(`Error fetching messages: ${error.message}`);
      }
      console.error('Error details:', error);
    }
  }

  //TODO:

  const fetchMessagesCommand = vscode.commands.registerCommand('mate-ninja-s-tweaks.fetchMessages', async () => {
    const config = vscode.workspace.getConfiguration("mateninjasTweaks");
    const serverPassword = config.get<string>("serverPassword") || "";
    await fetchMessage(serverPassword, false);
  });

  //FIXME:

  async function authenticate(serverPassword: string) {
    try {

      if (!serverPassword || serverPassword.trim() === '') {
        vscode.window.showErrorMessage('Server password not configured.');
        return;
      }

      // Pobierz wiadomości z serwera z nagłówkiem autoryzacji
      const response = await axios.get('https://vs-code-message-feed.glitch.me/authenticate', {
        headers: {
          'x-api-key': serverPassword
        }
      });

      if (response.status === 200) {
        return true;
      } else {
        vscode.window.showErrorMessage('Error while authenticating');
      }
      return false;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        vscode.window.showErrorMessage('Failed to authenticate');
      } else {
        vscode.window.showErrorMessage(`Error while authenticating`);
      }
      console.error('Error details:', error);
      return false;
    }
  }

  //FIXME:

  async function listenOnServer() {
    const config = vscode.workspace.getConfiguration("mateninjasTweaks");
    const pass = config.get<string>("serverPassword") || "";
    const authSucces = await authenticate(pass);
    console.log(authSucces);
    if (authSucces) {
      let message = "";
      const response = await axios.get('https://vs-code-message-feed.glitch.me/messages', {
        headers: {
          'x-api-key': pass
        }
      });
      if (response.status == 200 && response.data.length != 0 && response.data) {
        console.log('Fetching!')
        await fetchMessage(pass, true);
        return;
      } else {
        setTimeout(listenOnServer, 60000);
        console.log('Aligned another listening')
      }
    } else {
      return;
    }
  }

  //TODO:

  const listenForMessages = vscode.commands.registerCommand('mate-ninja-s-tweaks.listenForMessages', async () => {
    console.log('Listening...')
    vscode.window.showInformationMessage("Listening for messages...");
    await listenOnServer();
    return;
  });

  //TODO:
  const openInGoogle = vscode.commands.registerCommand('mate-ninja-s-tweaks.openInGoogle', async () => {
    const keyValue = await vscode.window.showInputBox({
      prompt: "Input what you want to search for",
      placeHolder: "Hank Brawl Stars",
    });

    if (!keyValue) {
      vscode.window.showErrorMessage("Canceled");
      return;
    }

    // Zbudowanie pełnego linku
    const url = `https://google.com/search?q=${encodeURIComponent(keyValue)}`;

    // Otwórz link w przeglądarce
    vscode.env.openExternal(vscode.Uri.parse(url));

    vscode.window.showInformationMessage(`Opened Google link: ${url}`);
  });

  const openInGoogleImages = vscode.commands.registerCommand('mate-ninja-s-tweaks.openInGoogleImages', async () => {
    const keyValue = await vscode.window.showInputBox({
      prompt: "Input what you want to search for",
      placeHolder: "Hank Brawl Stars",
    });

    if (!keyValue) {
      vscode.window.showErrorMessage("Canceled");
      return;
    }

    // Zbudowanie pełnego linku
    const url = `https://google.com/images?q=${encodeURIComponent(keyValue)}`;

    // Otwórz link w przeglądarce
    vscode.env.openExternal(vscode.Uri.parse(url));

    vscode.window.showInformationMessage(`Opened Google Images link: ${url}`);
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(openPastebinCommand);
  context.subscriptions.push(sendToServerCommand);
  context.subscriptions.push(fetchMessagesCommand);
  context.subscriptions.push(listenForMessages);
  context.subscriptions.push(openInGoogle);
  context.subscriptions.push(openInGoogleImages);

}

export function deactivate() { }

