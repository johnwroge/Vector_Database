# Weaviate Vector Database Project

This project demonstrates the setup and use of a vector database, specifically using [Weaviate](https://weaviate.io/) and OpenAI, for complex AI-driven operations. Vectors enable enhanced calculations essential for AI models, and vector databases optimize data storage and retrieval for high-performance vector-based operations. Here is a link to a more detailed walkthrough of using Weaviate. https://blog.logrocket.com/implement-vector-database-ai/

## Table of Contents
1. [Introduction to Vectors](#introduction-to-vectors)
2. [Why Vector Databases?](#why-vector-databases)
3. [Setting Up Weaviate](#setting-up-weaviate)
4. [Project Setup](#project-setup)
5. [Core Functions](#core-functions)
6. [Data Migration and Querying](#data-migration-and-querying)
7. [Combining Vector Embeddings with AI](#combining-vector-embeddings-with-ai)
8. [Example Output](#example-output)

---

## Introduction to Vectors

Vectors are one-dimensional arrays of numbers that represent complex data points, allowing for operations that drive AI models.

**Examples**:
- `vector3`: A 3D vector
- `vector4`: A 4D vector

## Why Vector Databases?

Vector databases are specialized for handling large volumes of vector data, offering optimized performance for operations like filtering and similarity calculations that traditional databases cannot efficiently support.

### Key Features:
- **Complex Math Operations**: Perform calculations like cosine similarity (measuring how similar two vectors are).
- **Specialized Vector Indices**: Enable efficient, deterministic retrieval.
- **Compact Storage**: Reduces query latency and memory load.
- **Sharding**: Distributes data across multiple machines with built-in support, unlike traditional SQL databases that require more effort to scale.

---

## Setting Up Weaviate

1. **Create Account**: Sign up on the Weaviate platform.
2. **Cluster Creation**: Create a free-tier cluster with authentication enabled.
3. **Retrieve Credentials**: Obtain your Weaviate URL and API key.

---

## Project Setup

### Setting up vector database 

you can clone repo, but I followed the steps to build everything

```
mkdir weaviate-vector-database
cd weaviate-vector-database
npm init -y
npm install dotenv openai weaviate-ts-client
mkdir src
```

Create .env (add .env to gitignore)

Use single quotes and verify OpenAI env variable names in corresponding files

OPENAI_KEY="<OPENAI_API_KEY>"
WEAVIATE_API_KEY="<WEAVIATE_API_KEY>"
WEAVIATE_URL="<WEAVIATE_URL>"
DATA_CLASSNAME="Document"


### Helper functions 

Need functionality to:

1. Connect to our database
2. Batch vectorize and upload documents
3. Query the most similar items

4. We also need a main function that performs these operations

### Setup Client

in src directory created database.js file. 

This file creates a connection to weaviate and a client instance.
It also uses OpenAI Ada model to vectorize data.

### Migrating data

We have to import data from separate library here into src/data.js

https://github.com/ovieokeh/pinecone-ai-vector-database/blob/main/src/data.js

added migrate function is db.js

This is the data we will use to vectorize, store in weaviate and then send to Open AI

### Adding documents

time to vectorize and upload documents

1. raw test string is converted to vectors using Open AI Ada model
2. converted vectors are uploaded to Weaviate database

### Deleting Documents

deletealldocuments function can be used for this smaller data size, but would not be appropriate
in larger databases (limited to ~200)


### Adding Querying Functions to DB

Added querying functions

migrate our data so we can query it in the next section. Open your terminal and run 

```npm run start "migrate"```

Ran into issue and had to update openai and change how env variable was used

```npm exec openai migrate```

https://github.com/openai/openai-node/discussions/217


```javascript
// Old
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// New
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
```


### Combining Vector Embeddings and AI

Words and phrases are represented as high dimensional vectors which can be compared to get
meanings and relationships. 

Vector database basically acts as a librarian for the AI model and allows for quick retrieval of this information. 

### AI Model Setup

Created model.js file (referenced as data.js in tutorial) used to interact with open ai

### Querying our data

index.js file created to query vector database and then map over returned documents to send to open ai 
for completion

"The query is sent to your Weaviate vector database where it is vectorized, compared to other similar vectors, and returns the 50 most similar ones based on their text. This context data is then formatted and sent along with your query to OpenAI’s GPT-3.5 model where it is processed and a response is generated."


### Testing our query

Ran into multiple problem with differences in api key names throughout files (single strings, no <>). Also had to run this command multiple times because the files weren't added to the database

``` npm run start "migrate" ```

```npm run start "query" "what are the 3 most impressive achievements of humanity in the story?"```

### Output


``` npm run start "migrate" ```

{
  date: '2400',
  title: 'Birth of Zephyr',
  text: 'Zephyr, the first of the Evolved Humans, known for his wisdom and cybernetic enhancements, is born. He would go on to become a major figure in the human evolution movement, propelling humanity into a new era of intellectual growth and exploration.',
  category: 'BEING'
}
...
{
  date: '4910',
  title: "The Ethereal Guardian's Intervention",
  text: 'The Ethereal Guardian intervenes to save a dying star from supernova in its Sanctuary, offering a new understanding of protection and preservation of life.',
  category: 'EVENT'
}
{
  date: '5010',
  title: 'The Nexus Initiative',
  text: 'The Nexus initiates a project to connect all lifeforms across the universe from its Hub, redefining the concepts of unity, life interconnectivity, and collective consciousness.',
  category: 'EVENT'
}


```npm run start "query" "what are the 3 most impressive achievements of humanity in the story?"```


johns-mbp:weaviate-vector-database johnwroge$ npm run start "query" "what are the 3 most impressive achievements of humanity in the story?"

> weaviate-vector-database@1.0.0 start
> node src/index.js query what are the 3 most impressive achievements of humanity in the story?

Based on the given context, the three most impressive achievements of humanity are:

1. Discovery of Gaia: The sentient planet Gaia, discovered in 3605, challenges previous definitions of life and intelligence. Its existence nurtures an entire ecosystem of evolved lifeforms and offers unparalleled insights into the nature of life and intelligence. This discovery expands humanity's understanding of sentient existence and marks a significant achievement in exploring the boundaries of life.

2. First Contact with Gaia: In 3610, humanity makes first contact with Gaia, further expanding our understanding of life and intelligence. This contact challenges previous definitions and expands our understanding of sentient existence. The ability to establish communication and interact with a sentient planet showcases humanity's progress in exploring and connecting with other forms of intelligent life.

3. Luminary Sol's Theories: Luminary Sol, who arises in 2750, is an immortal human with enhanced cognitive abilities. Her theories on quantum physics become a catalyst for interstellar travel and a new phase of human expansion. Her groundbreaking ideas revolutionize the understanding of the universe, opening up new possibilities in space exploration and theoretical physics. Luminary Sol's theories represent a remarkable achievement in pushing the boundaries of scientific knowledge and advancing human understanding of the cosmos.
