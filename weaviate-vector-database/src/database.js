
import weaviate, { ApiKey } from "weaviate-ts-client";
import { config } from "dotenv";
import { FAKE_XORDIA_HISTORY } from "./data.js";

config();

async function setupClient() {
  let client;

//   setup connection to weaviate server
  try {
    // create new weaviate client from environment variables
    client = weaviate.client({
      scheme: "https",
      host: process.env.WEAVIATE_URL,
      apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
      headers: { "X-OpenAI-Api-Key": process.env.OPENAI_KEY },
    });
  } catch (err) {
    console.error("error >>>", err.message);
  }

  return client;
}

// d
async function migrate(shouldDeleteAllDocuments = false) {
    
    try {
        // schema for class in weaviate
      const classObj = {
        class: process.env.DATA_CLASSNAME,
        vectorizer: "text2vec-openai",
        moduleConfig: {
          "text2vec-openai": {
            model: "ada",
            modelVersion: "002",
            type: "text",
          },
        },
      };
  
      const client = await setupClient();
  
      try {
        // send request to server to create document class of classObj
        const schema = await client.schema
          .classCreator()
          .withClass(classObj)
          .do();
        //   log created schema for confirmation
        console.info("created schema >>>", schema);
      } catch (err) {
        console.error("schema already exists");
      }
  
      if (!FAKE_XORDIA_HISTORY.length) {
        console.error(`Data is empty`);
        process.exit(1);
      }
  
      if (shouldDeleteAllDocuments) {
        console.info(`Deleting all documents`);
        await deleteAllDocuments();
      }
  
      console.info(`Inserting documents`);
      await addDocuments(FAKE_XORDIA_HISTORY);
    } catch (err) {
      console.error("error >>>", err.message);
    }
  }

  const addDocuments = async (data = []) => {
    // setup Weaviate client instance
    const client = await setupClient();
    // batches documents and upload all at once for efficiency 
    let batcher = client.batch.objectsBatcher();
    // keeps track of how many documents are added to the current batch
    let counter = 0;
    // how many documents to be in each batch
    const batchSize = 100;
  
    // loop over data, 
    for (const document of data) {
      console.log(document)
        // create an object for each document
      const obj = {
        class: process.env.DATA_CLASSNAME,
        properties: { ...document },
      };
        //  add document to batcher
      batcher = batcher.withObject(obj);
        //  if counter matches batchsize
      if (counter++ == batchSize) {
        // upload batch to Weaviate and create a new batcher
        await batcher.do();
        counter = 0;
        batcher = client.batch.objectsBatcher();
      }
    }
  
    // final response containing success or error message
    const res = await batcher.do();
    return res;
  };

    // helper function to delete documents (limited to 200 entries per time)
    // larger batching technique would be needed for larger database
  async function deleteAllDocuments() {

    const client = await setupClient();
    const documents = await client.graphql
      .get()
      .withClassName(process.env.DATA_CLASSNAME)
      .withFields("_additional { id }")
      .do();
  
    for (const document of documents.data.Get[process.env.DATA_CLASSNAME]) {
      await client.data
        .deleter()
        .withClassName(process.env.DATA_CLASSNAME)
        .withId(document._additional.id)
        .do();
    }
  }



async function nearTextQuery({
  concepts = [""],
  fields = "text category",
  limit = 1,
}) {
  const client = await setupClient();
  const res = await client.graphql
    .get()
    .withClassName("Document")
    .withFields(fields)
    .withNearText({ concepts })
    .withLimit(limit)
    .do();

  return res.data.Get[process.env.DATA_CLASSNAME];
}

export { migrate, addDocuments, deleteAllDocuments, nearTextQuery };