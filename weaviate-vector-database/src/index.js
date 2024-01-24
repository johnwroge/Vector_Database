import { config } from "dotenv";
import { migrate, nearTextQuery } from "./database.js";
import { getChatCompletion } from "./model.js";

config();


/* function takes in text prompt which we use to compare to items in database 
returns documents that are semantically similar. 

*/
const queryDatabase = async (prompt) => {
  console.info(`Querying database`);

  const questionContext = await nearTextQuery({
    concepts: [prompt],
    fields: "title text date",
    limit: 50,
  });
//   map over documents and then send to open ai for completion
  const context = questionContext
    .map((context, index) => {
      const { title, text, date } = context;
      return `
        Document ${index + 1}
        Date: ${date}
        Title: ${title}

        ${text}
  `;
    })
    .join("\n\n");

  const aiResponse = await getChatCompletion({ prompt, context });
  return aiResponse.content;
};

// use command line arguments
const main = async () => {
  const command = process.argv[2];
  const params = process.argv[3];

  switch (command) {
    case "migrate":
      return await migrate(params === "--delete-all");
    case "query":
      return console.log(await queryDatabase(params));
    default:
      // do nothing
      break;
  }
};

main();