import {
  VectorStoreIndex,
  serviceContextFromDefaults,
  storageContextFromDefaults,
  SimpleDirectoryReader,
  SimilarityPostprocessor,
  RetrieverQueryEngine,
} from "llamaindex";

// Error: Set OpenAI Key in OPENAI_API_KEY env variable
// export OPENAI_API_KEY=sk-...
// export | grep OPENAI_API_KEY

async function main1() {
  try {
    // ストレージ作成
    const serviceContext = serviceContextFromDefaults({
      chunkSize: 512,
      chunkOverlap: 20,
    });
    const documents = await new SimpleDirectoryReader().loadData({
      // copy the abramov.txt from node_modules/llamaindex/examples
      directoryPath: "./data",
    });
    const storageContext = await storageContextFromDefaults({
      persistDir: "storage",
      storeImages: true,
    });
    const index = await VectorStoreIndex.fromDocuments(documents, {
      serviceContext,
      storageContext,
    });
    console.log(`Storage successfully generated.`);

    // Create query engine
    const retriever = index.asRetriever();
    retriever.similarityTopK = 5;
    const nodePostprocessor = new SimilarityPostprocessor({
      similarityCutoff: 0.7,
    });
    // TODO: cannot pass responseSynthesizer into retriever query engine
    const queryEngine = new RetrieverQueryEngine(
      retriever,
      undefined,
      undefined,
      [nodePostprocessor]
    );
    // Query the index
    const question = "What did the author do in college?";
    console.log("question:", question);
    const result = await queryEngine.query({query: question});
    console.log("response:", result.response);
  } catch (error) {
    console.error(error);
  }
}

async function main2() {
  try {
    // 既存のストレージを読み込む
    const storageContext = await storageContextFromDefaults({
      persistDir: "storage",
      storeImages: true,
    });
    const index = await VectorStoreIndex.init({
      storageContext: storageContext,
    });
    // Create query engine
    const retriever = index.asRetriever();
    retriever.similarityTopK = 5;
    const nodePostprocessor = new SimilarityPostprocessor({
      similarityCutoff: 0.7,
    });
    // TODO: cannot pass responseSynthesizer into retriever query engine
    const queryEngine = new RetrieverQueryEngine(
      retriever,
      undefined,
      undefined,
      [nodePostprocessor]
    );
    // Query the index
    const question = "What did the author do in college?";
    console.log("question:", question);
    const result = await queryEngine.query({query: question});
    console.log("response:", result.response);
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  try {
    // 既存のストレージを読み込む
    const storageContext = await storageContextFromDefaults({
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
    const document = await storageContext.docStore.getDocument(
      documents['./data/abramov.txt']['nodeIds'][0],
      true
    );
    console.log("document:", document);
    /*
    document: TextNode {
      id_: 'd6a17216-f1bb-4b64-b013-9323f9a1f7ab',
      metadata: {},
      excludedEmbedMetadataKeys: [],
      excludedLlmMetadataKeys: [],
      relationships: {},
      hash: 'banSxr0J8S9G++9zGOVaNxWAyRP1vgmXMP9V7Eg/hlY=',
      text: 'I started this decade as a first-year college student fresh out of high school. I was 17, didn’t have a job, didn’t have any industry connections, and really didn’t know shit. And now you’re reading my blog! I would have been proud. I’ve told bits and pieces of my story on different podcasts. Now feels like an appropriate time to write down the parts that were most memorable to me. Every person’s story is unique and not directly reproducible. I’ve benefited immensely from the privilege of being born in an upper middle class family and looking like a typical coder stereotype. People took chances on me. Still, I hope that sharing my story can be helpful to compare our experiences. Even if our circumstances are too different, at least you might find some of it entertaining. 2010 I was born in Russia and I finished the high school there in 2009. In Russia, higher education is free if you do well enough at tests. I tried my chances with a few colleges. I was particularly hoping to get into one college whose students often won programming competitions (which I thought was cool at the time). However, it turned out my math exam scores weren’t good enough. So there were not many options I could choose from that had to do with programming. From the remaining options, I picked a college that gave Macbooks to students. (Remember the white plastic ones with GarageBand? They were the best.) By the summer of 2010, I had just finished my first year there. It turned out that there wasn’t going to be much programming in the curriculum for two more years. But there was a lot of linear algebra, physics, and other subjects I didn’t find particularly interesting. Everything was well in the beginning, but I started slacking off and skipping lectures that I had to wake up early for. My gaps in knowledge gradually snowballed, and most of what I remember from my first year in the university is the anxiety associated with feeling like a total failure. Even for subjects I knew well, things didn’t quite go as I planned. Our English classes were very rudimentary, and I got a verbal approval from the teacher to skip most of them. But when I came for the final test, I wasn’t allowed to turn it in unless I pay money for hours of “catch up training” with the same teacher.',
      textTemplate: '',
      metadataSeparator: '\n'
    }
    */
    const info = await storageContext.docStore.getRefDocInfo('./data/abramov.txt');
    console.log("info:", info);
    /*
    info: {
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
    */
    /*
    documents['./data/abramov.txt']['nodeIds'].map(async (nodeId) => {
      // TypeError: Cannot read properties of undefined (reading 'length') ... at the end of this program
      await storageContext.docStore.deleteDocument(nodeId, true);
    });
    */
    // Not working at all
    // await storageContext.vectorStore.delete('./data/abramov.txt');
    // await storageContext.indexStore.deleteIndexStruct('./data/abramov.txt');
    // await storageContext.docStore.deleteRefDoc('./data/abramov.txt', true);

    console.log("end !!");
  } catch (error) {
    console.error(error);
  }
}

main();
