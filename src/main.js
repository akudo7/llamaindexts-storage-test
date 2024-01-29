"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const llamaindex_1 = require("llamaindex");
// Error: Set OpenAI Key in OPENAI_API_KEY env variable
// export OPENAI_API_KEY=sk-...
// export | grep OPENAI_API_KEY
async function main1() {
    try {
        // ストレージ作成
        const serviceContext = (0, llamaindex_1.serviceContextFromDefaults)({
            chunkSize: 512,
            chunkOverlap: 20,
        });
        const documents = await new llamaindex_1.SimpleDirectoryReader().loadData({
            // copy the abramov.txt from node_modules/llamaindex/examples
            directoryPath: "./data",
        });
        const storageContext = await (0, llamaindex_1.storageContextFromDefaults)({
            persistDir: "storage",
            storeImages: true,
        });
        const index = await llamaindex_1.VectorStoreIndex.fromDocuments(documents, {
            serviceContext,
            storageContext,
        });
        console.log(`Storage successfully generated.`);
        // Create query engine
        const retriever = index.asRetriever();
        retriever.similarityTopK = 5;
        const nodePostprocessor = new llamaindex_1.SimilarityPostprocessor({
            similarityCutoff: 0.7,
        });
        // TODO: cannot pass responseSynthesizer into retriever query engine
        const queryEngine = new llamaindex_1.RetrieverQueryEngine(retriever, undefined, undefined, [nodePostprocessor]);
        // Query the index
        const question = "What did the author do in college?";
        console.log("question:", question);
        const result = await queryEngine.query(question);
        console.log("response:", result.response);
    }
    catch (error) {
        console.error(error);
    }
}
async function main2() {
    try {
        // 既存のストレージを読み込む
        const storageContext = await (0, llamaindex_1.storageContextFromDefaults)({
            persistDir: "storage",
            storeImages: true,
        });
        const index = await llamaindex_1.VectorStoreIndex.init({
            storageContext: storageContext,
        });
        // Create query engine
        const retriever = index.asRetriever();
        retriever.similarityTopK = 5;
        const nodePostprocessor = new llamaindex_1.SimilarityPostprocessor({
            similarityCutoff: 0.7,
        });
        // TODO: cannot pass responseSynthesizer into retriever query engine
        const queryEngine = new llamaindex_1.RetrieverQueryEngine(retriever, undefined, undefined, [nodePostprocessor]);
        // Query the index
        const question = "What did the author do in college?";
        console.log("question:", question);
        const result = await queryEngine.query(question);
        console.log("response:", result.response);
    }
    catch (error) {
        console.error(error);
    }
}
async function main() {
    try {
        // 既存のストレージを読み込む
        const storageContext = await (0, llamaindex_1.storageContextFromDefaults)({
            persistDir: "storage",
            storeImages: true,
        });
        const documents = await storageContext.docStore.getAllRefDocInfo();
        console.log("documents:", documents);
        /*
        documents: {
          './data/abramov.txt': {
            nodeIds: [
              'd6a17216-f1bb-4b64-b013-9323f9a1f7ab',
              'f7da1558-9ab6-42cb-9370-277d518f9d25',
              'a77e9fc6-1b03-4339-ac43-cbdf4d31b8ab',
              'c2c83ecc-b1b1-4b8d-9055-44a7ebe45f5d',
              'b5ce1656-dcca-40e4-9b1c-067177a45377',
              '1b5bd7e9-9740-4e4d-9d6a-cfeee51ddabf',
              'a83e58aa-760b-4875-97ad-c4201a8d9537',
              '7bef3937-23e4-41dc-b5cd-67988307748f',
              '77573c0e-30ae-434c-8fd4-7f039769b75f',
              'a0456c2b-ee0d-4455-a5da-11f9af8324c0',
              '03811cf1-f20a-4fd6-ad0c-7d2fc66ac448',
              'e1ab05ac-6e63-4b8d-bc2f-b33cfb7ca970',
              '3912baff-96ce-4b0b-803c-93f7c6f91d90',
              '8de1f9c9-2210-4c4a-83d9-6d4be0cad76b',
              '3cca210f-3092-45e8-ba71-cc3526803705',
              '58908b22-61af-4076-a38b-9c6caa51d172'
            ],
            extraInfo: {}
          }
        }
        */
        if (!documents) {
            throw new Error('documents not exist');
        }
        const document = await storageContext.docStore.getDocument(documents['./data/abramov.txt']['nodeIds'][0], true);
        console.log("document:", document);
        const info = await storageContext.docStore.getRefDocInfo('./data/abramov.txt');
        console.log("info:", info);
        // Not working at all
        // await storageContext.docStore.deleteRefDoc("./data/abramov.txt", true);
        documents['./data/abramov.txt']['nodeIds'].map(async (nodeId) => {
            // TypeError: Cannot read properties of undefined (reading 'length') ... at the end of this program
            await storageContext.docStore.deleteDocument(nodeId, true);
        });
        console.log("end !!");
    }
    catch (error) {
        console.error(error);
    }
}
main();
