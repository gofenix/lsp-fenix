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