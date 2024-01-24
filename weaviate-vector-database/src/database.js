
import weaviate, { ApiKey } from "weaviate-ts-client";
import { config } from "dotenv";
import { FAKE_XORDIA_HISTORY } from "./data";

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
      headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
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