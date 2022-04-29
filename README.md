# lsp-fenix README


https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-sample

https://code.visualstudio.com/api/language-extensions/language-server-extension-guide

首先安装
```
npm install -g yo generator-code
```

然后
```
yo code
```

然后再 package.json中这样改：
```
"activationEvents": [
    "onLanguage:plaintext"
]
```
在发现是onLanguage:plaintext的时候，就启动插件

然后是
```
   "contributes": {
        "configuration": {
            "type": "object",
            "title": "Example configuration",
            "properties": {
                "languageServerExample.maxNumberOfProblems": {
                    "scope": "resource",
                    "type": "number",
                    "default": 100,
                    "description": "Controls the maximum number of problems produced by the server."
                },
                "languageServerExample.trace.server": {
                    "scope": "window",
                    "type": "string",
                    "enum": [
                        "off",
                        "messages",
                        "verbose"
                    ],
                    "default": "off",
                    "description": "Traces the communication between VS Code and the language server."
                }
            }
        }
    }
```
这里我们把server和client放在一起。

先看server。
在src/server.ts中
```
import { TextDocument } from "vscode-languageserver-textdocument";
import { CompletionItemKind, createConnection, InitializeParams, InitializeResult, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from "vscode-languageserver/node";

const connection = createConnection(ProposedFeatures.all);
connection.onInitialize((params: InitializeParams) => {
    console.log(`onInitialize`);
    console.log(params)
    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
        }
    }
    return result
})

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
documents.onDidOpen(e => {
    console.log(`onDidOpen`);
    console.log(e)
})

documents.onDidChangeContent(e => {
    console.log(`onDidChangeContent`);
    console.log(e)
})

documents.onDidClose(e => {
    console.log(`onDidClose`);
    console.log(e)
})

documents.listen(connection);
connection.listen()
```
一个是connection，一个document。
connection是为了和client保持连接。

然后我们看client

client，就是在extension.ts中写
```
let client: LanguageClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "lsp-fenix" is now active!');
    const p = context.asAbsolutePath(path.join('server.js'))
    console.log(`============>${p}`)

    const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc }
    }

    const clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'plaintext' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
        }
    };

    client = new LanguageClient('lsp-fenix', 'LSP Fenix', serverOptions, clientOptions);
    client.start()
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
```
重要的有俩参数，一个是serverOption，一个clientOption。
serverOption的module参数是指定了启动方式，指定了ipc。
clientOption是指定了哪些文件要去开启lsp。

然后就可以调试了。