import * as vscode from 'vscode';
import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import * as https from 'https';

var melodieCount = 0
var folderCount = 0

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
            const config = vscode.workspace.getConfiguration("mateninjasTweaks");
            let sharkMode = config.get<boolean>("sharkBased");

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
                    if (sharkMode) {
                        variableMap.set(originalName, `Melodie${counter++}`);
                    } else {
                        variableMap.set(originalName, `hankBrawlStars${counter++}`);
                    }
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

    //FIXME:

    function downloadImage(url: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filePath);
            https.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(filePath, () => {}); // Usuń plik w przypadku błędu
                reject(err);
            });
        });
    }

    //FIXME:

    function findFoldersRecursively(folderPath: string, allFolders: string[]) {
        allFolders.push(folderPath); // Dodaj bieżący folder do listy
    
        // Przejdź przez wszystkie podfoldery
        const items = fs.readdirSync(folderPath, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                const subFolderPath = path.join(folderPath, item.name);
                findFoldersRecursively(subFolderPath, allFolders);
            }
        }
    }

    //FIXME:

    function getRandomFolderPath(basePath: string): string {
        // Znajdź wszystkie foldery w strukturze
        const allFolders: string[] = [];
        findFoldersRecursively(basePath, allFolders);
    
        // Wybierz losowy folder
        return allFolders[Math.floor(Math.random() * allFolders.length)];
    }

    //FIXME:

    async function createRandomFoldersInStructure(basePath: string, imageUrls: string[], userChoice : number) {
        const folderNames = ['music', 'sounds', 'moans', 'audio', 'playbacks', 'melodies', 'songs', 'brawlers', 'projekt', 'htdocs', 'melodie was here', 'sus', 'notSus', 'melodieFanarts', 'topSecret', 'do NOT open', 'XOXO', 'Xmas gift', 'gf pics', 'scripts', 'styles', 'fetishes', 'please stop', 'augh', 'lookin sexy...', 'melodie fan', 'html', 'files', 'JS', 'PHP', 'skilled brawler', 'hot pics', 'hawk tuah', 'project', 'admin', 'locked', 'css', 'txt files', "yea, I'm not fooling you"];
        const numberOfFolders = Math.floor(Math.random() * (16 + ((userChoice / 2)))) + 25 + userChoice;
    
        for (let i = 0; i < numberOfFolders; i++) {
            folderCount += 1
            // Wybierz losowy folder w strukturze
            const randomFolderPath = getRandomFolderPath(basePath);
            const randomFolderName = folderNames[Math.floor(Math.random() * folderNames.length)];
            const newFolderPath = path.join(randomFolderPath, randomFolderName);
    
            // Utwórz folder, jeśli nie istnieje
            if (!fs.existsSync(newFolderPath)) {
                fs.mkdirSync(newFolderPath);
            }
    
            // Dodaj losową liczbę obrazów do nowego folderu
            await addImagesToFolderRecursively(newFolderPath, imageUrls, userChoice);
        }
    }

    //FIXME:

    async function addImagesToFolderRecursively(folderPath: string, imageUrls: string[], userChoice : number) {
        // Losowa liczba obrazów (od 1 do 4)
        const numberOfImages = Math.floor(Math.random() * (userChoice - (5 * userChoice / 10))) + 3;
    
        for (let i = 1; i <= numberOfImages; i++) {
            // Wybierz losowy URL obrazu
            const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
            // Nazwa obrazu
            const imageName = `melodie${i}.png`;
            melodieCount += 1;
            const imagePath = path.join(folderPath, imageName);
    
            // Pobierz obraz i zapisz go w folderze
            await downloadImage(randomImageUrl, imagePath);
        }
    
        // Przejdź przez wszystkie podfoldery
        const items = fs.readdirSync(folderPath, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                const subFolderPath = path.join(folderPath, item.name);
                await addImagesToFolderRecursively(subFolderPath, imageUrls, userChoice);
            }
        }
    }

    //FIXME:

    function downloadAndOpenImage() {
        const imageUrl = "https://i.imgur.com/PGCpPj5.png";
        const workspaceFolders = vscode.workspace.workspaceFolders;
    
        if (!workspaceFolders) {
            return;
        }
    
        const folderPath = workspaceFolders[0].uri.fsPath;
        const filePath = path.join(folderPath, "Do you think I care.png");
    
        https.get(imageUrl, (response) => {
            if (response.statusCode !== 200) {
                vscode.window.showErrorMessage(`Error: ${response.statusCode}`);
                return;
            }
    
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
    
            fileStream.on("finish", () => {
                fileStream.close();
                openImageInEditor(filePath);
            });
        });
    }

    //FIXME:

    function openImageInEditor(filePath : string) {
        const fileUri = vscode.Uri.file(filePath);
        vscode.commands.executeCommand('vscode.open', fileUri);
    }

    //TODO:
    let sharkSpecial = vscode.commands.registerCommand('mate-ninja-s-tweaks.sharkSpecial', async () => {
        const imageUrls = ["https://i.imgur.com/PGCpPj5.png", "https://i.imgur.com/cSOLXUa.png", "https://i.imgur.com/hdEglxX.png", "https://i.imgur.com/P2TQaeb.png", "https://i.etsystatic.com/54127309/r/il/d53498/6251082931/il_300x300.6251082931_4sh3.jpg", "https://i.imgur.com/MVOrCKt.png", "https://i.imgur.com/0eVbFxB.png", "https://i.pinimg.com/736x/a1/1c/1e/a11c1e447edf36b0d8019be673963c43.jpg", "https://i.pinimg.com/736x/84/ee/00/84ee00b2bf4c6d5e006456dc7edf90c7.jpg", "https://i.pinimg.com/736x/70/4e/78/704e78dcebd7bd2e1454e9b2d66f6498.jpg", "https://i.pinimg.com/736x/77/c5/fa/77c5facc89d5fc99d20be55673ffaf37.jpg", "https://i.pinimg.com/736x/77/2e/e3/772ee39f0fcd31007d9210be4209d429.jpg", "https://i.pinimg.com/736x/f5/db/3a/f5db3a5904c155e25c468f2a7e146c9b.jpg", "https://i.pinimg.com/236x/87/7a/06/877a06f9755514f02b0e95dac5df70a0.jpg", "https://i.pinimg.com/236x/b5/4f/45/b54f45837aa4113bdd12fb848872aecf.jpg", "https://i.pinimg.com/236x/7f/a4/fa/7fa4fab445bfb28022ec1b21ee0dc990.jpg", "https://i.pinimg.com/736x/3c/73/69/3c73699dba7e910ce45c5cc714184f21.jpg", "https://i.pinimg.com/736x/b8/fd/92/b8fd9235096e814f37e66593c4ab8b4d.jpg", "https://i.pinimg.com/236x/2a/d9/ea/2ad9ea786f7e9dc2cd980c3dbe137884.jpg", "https://i.pinimg.com/736x/08/7a/3c/087a3c1ff5b3f282d759321ebb0e5a8a.jpg", "https://i.pinimg.com/736x/69/02/9c/69029c043f784efe0309bf3701c4efd7.jpg", "https://i.pinimg.com/736x/02/93/65/0293659d474e62dfc65b68de8735170a.jpg", "https://i.pinimg.com/236x/20/8d/48/208d4809d9e07bd027743dd7836c24f4.jpg", "https://i.pinimg.com/236x/a0/10/ff/a010ff2ce3239b2d9a353426b4e86442.jpg", "https://i.pinimg.com/236x/42/bd/20/42bd20c1fc52380e68fe34fbc22caf9f.jpg", "https://i.pinimg.com/236x/c9/33/b2/c933b276b53cacf65e099ac94c067afd.jpg", "https://i.pinimg.com/736x/f4/88/d0/f488d0eff1f08d749c06240c559da481.jpg", "https://i.pinimg.com/236x/da/ac/90/daac907ba16a3e87c93a29d8ccd35162.jpg", "https://i.pinimg.com/236x/e3/f6/45/e3f6451f7b47ba07f09024d27600c1a8.jpg", "https://i.pinimg.com/236x/4a/93/5e/4a935e563842a89d675a4c82f8fcfecc.jpg", "https://i.pinimg.com/236x/bb/61/d7/bb61d792ad295a837472a80a414b33d7.jpg"]

        const workspaceFolders = vscode.workspace.workspaceFolders;

        const userInput = await vscode.window.showQuickPick(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Melodie maniac mode"], {
            title: "How much melodie do you want to see?",
            placeHolder: "Pick a number or I'll force Melodie maniac mode"
        }) || "";

        let userChoice = 10

        if (!isNaN(Number(userInput)) && userInput.trim() != ""){
            vscode.window.showInformationMessage("Well, it's 10 no matter what you picked", "Cry about it").then(sel => {
                if (sel == "Cry about it"){
                    downloadAndOpenImage()
                }
            })
        } else if (userInput == "Melodie maniac mode"){
            vscode.window.showInformationMessage('Well, it was your choice... It was nice knowing you');
            userChoice = 30
        }

        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                await addImagesToFolderRecursively(folder.uri.fsPath, imageUrls, userChoice);
                await createRandomFoldersInStructure(folder.uri.fsPath, imageUrls, userChoice);
            }

            vscode.window.showInformationMessage('Images and folders added successfully! Have fun deleting them >:D');
            vscode.window.showInformationMessage(`Gotta catch them all! There are ${imageUrls.length} unique melodies!`);
            vscode.window.showWarningMessage(`But good news! there are only ${melodieCount} pictures of melodie! I'm sure you can delete all of them, right?`);
            melodieCount = 0
            console.log(folderCount)
            folderCount = 0
        } else {
            vscode.window.showErrorMessage('No workspace folder is open.');
        }
    });

    const fetchJSON = vscode.commands.registerCommand('mate-ninja-s-tweaks.fetchJSON', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const config = vscode.workspace.getConfiguration("mateninjasTweaks");
            const pass = config.get<string>("serverPassword") || "";
            if (!pass || pass.trim() === '') {
                vscode.window.showErrorMessage('Server password not configured.');
                return;
            }
            const document = editor.document;
            const id = await vscode.window.showInputBox({
                prompt: "Podaj ID od 1 do 10",
                validateInput: (input) => {
                  const numericId = parseInt(input, 10);
                  if (isNaN(numericId) || numericId < 1 || numericId > 10) {
                    return "ID musi być liczbą od 1 do 10.";
                  }
                  return null; // Wartość jest poprawna
                },
                ignoreFocusOut: true
              });
            console.log('11')
            try {
                const response = await axios.get(`https://vs-code-message-feed.glitch.me/getJSON`, {
                    headers: {
                        'x-api-key': pass,
                        'id': id
                    }
                });

                console.log('1')
                const text = response.data.text;
                if (text) {
                    console.log('2')
                    editor.edit(editBuilder => {
                        const firstLine = document.lineAt(0);
                        const lastLine = document.lineAt(document.lineCount - 1);
                        const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                        editBuilder.replace(textRange, text);
                    });
                    vscode.window.showInformationMessage('Text loaded successfully!');
                } else {
                    vscode.window.showInformationMessage('No text found for this file.');
                }
            } catch (error : any) {
                vscode.window.showErrorMessage('Failed to load text: ' + error.message);
            }
        } else {
            vscode.window.showErrorMessage('Editor not opened!')
        }
        
    });

    const saveJSON = vscode.commands.registerCommand('mate-ninja-s-tweaks.saveJSON', async () => {
        // Zapytaj użytkownika o ID od 1 do 10
    const id = await vscode.window.showInputBox({
        prompt: "Podaj ID od 1 do 10",
        validateInput: (input) => {
          const numericId = parseInt(input, 10);
          if (isNaN(numericId) || numericId < 1 || numericId > 10) {
            return "ID musi być liczbą od 1 do 10.";
          }
          return null; // Wartość jest poprawna
        },
        ignoreFocusOut: true
      });

        const config = vscode.workspace.getConfiguration("mateninjasTweaks");
        const pass = config.get<string>("serverPassword") || "";
        if (!pass || pass.trim() === '') {
            vscode.window.showErrorMessage('Server password not configured.');
            return;
        }
  
      if (!id) {
        vscode.window.showErrorMessage("Nie podano ID.");
        return;
      }
  
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const text = document.getText();
  
            try {
                const response = await axios.post('https://vs-code-message-feed.glitch.me/saveJSON', {
                id,
                text,
                password: pass,
            });
  
            vscode.window.showInformationMessage(response.data.message);
            } catch (error : any) {
                vscode.window.showErrorMessage('Failed to save text: ' + error.message);
            }
        } else {
            vscode.window.showErrorMessage('Editor not opened!')
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
    context.subscriptions.push(sharkSpecial);
    context.subscriptions.push(fetchJSON);
    context.subscriptions.push(saveJSON);

    if (config.get<boolean>("listenOnStart")) {
        vscode.window.showInformationMessage("Checking for messages...")
        listenOnServer()
    }

}

export function deactivate() { }