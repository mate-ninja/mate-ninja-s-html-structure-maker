import * as vscode from 'vscode';
import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    var isListening = false;

    const config = vscode.workspace.getConfiguration("mateninjasTweaks");

    //TODO:

    let generateHTML = vscode.commands.registerCommand('mate-ninja-s-tweaks.generateHtmlStructure', async (uri: vscode.Uri) => {
        let targetFolder: string | undefined;
        const config = vscode.workspace.getConfiguration("mateninjasTweaks");
        let sharkMode = config.get<boolean>("sharkBased");
        console.log(sharkMode);

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

        const htmlLang = config.get<string>("htmlLang") || "en";

        // Ścieżki do plików
        const htmlPath = path.join(finalFolder, "index.html");
        const cssPath = path.join(finalFolder, "style.css");
        const jsPath = path.join(finalFolder, "script.js");

        // Treści plików
        let htmlContent
        if (sharkMode) {
            htmlContent = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>

</style>
<body>
    <script>
    
    </script>
</body>
</html>`;
        } else {
            htmlContent = `<!DOCTYPE html>
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
        }


        // Tworzenie plików
        fs.writeFileSync(htmlPath, htmlContent);
        if (!sharkMode) {
            fs.writeFileSync(cssPath, "");
            fs.writeFileSync(jsPath, "");
        }

        vscode.window.showInformationMessage("Structure generated with no errors!");
    });

    let generatePHP = vscode.commands.registerCommand('mate-ninja-s-tweaks.generatePHPStructure', async (uri: vscode.Uri) => {
        let targetFolder: string | undefined;
        const config = vscode.workspace.getConfiguration("mateninjasTweaks");
        let sharkMode = config.get<boolean>("sharkBased");

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

        const phpLang = config.get<string>("htmlLang") || "en";

        // Ścieżki do plików
        const phpPath = path.join(finalFolder, "index.php");
        const cssPath = path.join(finalFolder, "style.css");
        const jsPath = path.join(finalFolder, "script.js");

        // Treści plików
        let phpContent
        if (sharkMode) {
            phpContent = `<!DOCTYPE html>
<html lang="${phpLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>

</style>

<?php

?>

<body>
    <script>
    
    </script>
</body>
</html>`;
        } else {
            phpContent = `<!DOCTYPE html>
<html lang="${phpLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>

<?php

?>

<body>
    <script src="script.js"></script>
</body>
</html>`;
        }

        // Tworzenie plików
        fs.writeFileSync(phpPath, phpContent);
        if (!sharkMode) {
            fs.writeFileSync(cssPath, "");
            fs.writeFileSync(jsPath, "");
        }

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
        let password = config.get<string>("serverPassword");
        const username = config.get<string>("serverUsername");

        let tempPass = '1'

        if (!password || password.trim() === '') {
            tempPass = await vscode.window.showInputBox({
                prompt: "Enter temporary password",
                password: true
            }) || "";
            password = tempPass
        }

        if (!tempPass || tempPass.trim() === '') {
            vscode.window.showErrorMessage('Server password not configured.');
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

    async function fetchMessage(serverPassword: string, listen: boolean) {
        try {

            let passsword = serverPassword
            let tempPass = '1'

            if (!serverPassword || serverPassword.trim() === '') {
                tempPass = await vscode.window.showInputBox({
                    prompt: "Enter temporary password",
                    password: true
                }) || "";
                passsword = tempPass
            }

            if (!tempPass || tempPass.trim() === '') {
                vscode.window.showErrorMessage('Server password not configured.');
                return;
            }

            // Pobierz wiadomości z serwera z nagłówkiem autoryzacji
            const response = await axios.get('https://vs-code-message-feed.glitch.me/messages', {
                headers: {
                    'x-api-key': passsword
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
        if (isListening) {
            vscode.window.showErrorMessage("Already listening!");
            return;
        }
        isListening = true
        const config = vscode.workspace.getConfiguration("mateninjasTweaks");
        const pass = config.get<string>("serverPassword") || "";
        const authSucces = await authenticate(pass);
        if (authSucces) {
            const response = await axios.get('https://vs-code-message-feed.glitch.me/messages', {
                headers: {
                    'x-api-key': pass
                }
            });
            if (response.status == 200 && response.data.length != 0 && response.data) {
                await fetchMessage(pass, true);
                isListening = false;
                return;
            } else {
                setTimeout(() => isListening = false, 59900);
                setTimeout(listenOnServer, 60000);
            }
        } else {
            isListening = false;
            return;
        }
    }

    //TODO:

    const listenForMessages = vscode.commands.registerCommand('mate-ninja-s-tweaks.listenForMessages', async () => {
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

    //TODO:

    const spacesToTabs = vscode.commands.registerCommand('mate-ninja-s-tweaks.convertSpacesToTabs', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            const text = document.getText(selection.isEmpty ? undefined : selection);

            const convertedText = text.replace(/ {2}/g, '\t');

            editor.edit(editBuilder => {
                if (selection.isEmpty) {
                    const firstLine = document.lineAt(0);
                    const lastLine = document.lineAt(document.lineCount - 1);
                    const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                    editBuilder.replace(textRange, convertedText);
                } else {
                    editBuilder.replace(selection, convertedText);
                }
            });
        }
    });

    //TODO:

    let replaceVars = vscode.commands.registerCommand('mate-ninja-s-tweaks.renameVariables', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();

            // Regular expression to match variable names
            const variableRegex = /(\blet\b|\bconst\b|\bvar\b)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

            let match;
            let counter = 1;
            let newText = text;
            const variableMap = new Map<string, string>();

            // Find all variable declarations and map them to new names
            while ((match = variableRegex.exec(text)) !== null) {
                const originalName = match[2];
                if (!variableMap.has(originalName)) {
                    variableMap.set(originalName, `hankBrawlStars${counter++}`);
                }
            }

            // Replace all occurrences of the variables
            variableMap.forEach((newName, originalName) => {
                const regex = new RegExp(`\\b${originalName}\\b`, 'g');
                newText = newText.replace(regex, newName);
            });

            // Replace the entire document with the new text
            editor.edit(editBuilder => {
                const firstLine = document.lineAt(0);
                const lastLine = document.lineAt(document.lineCount - 1);
                const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                editBuilder.replace(textRange, newText);
            });
        }
    });

    context.subscriptions.push(generateHTML);
    context.subscriptions.push(generatePHP);
    context.subscriptions.push(openPastebinCommand);
    context.subscriptions.push(sendToServerCommand);
    context.subscriptions.push(fetchMessagesCommand);
    context.subscriptions.push(listenForMessages);
    context.subscriptions.push(openInGoogle);
    context.subscriptions.push(openInGoogleImages);
    context.subscriptions.push(spacesToTabs);
    context.subscriptions.push(replaceVars);

    if (config.get<boolean>("listenOnStart")) {
        vscode.window.showInformationMessage("Checking for messages...")
        listenOnServer()
    }

}

export function deactivate() { }