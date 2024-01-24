
<!-- What are vectors? -->

Vectors are essentially a one dimensional array of numbers. They allow us to perform complex 
calculations and operations that drive AI models.

vector3 - 3d vector
vector4 - 4d vector

<!-- Why do we need vector databases? -->

A vector database is a optimized for large amounts of vector data and specific operations. A normal database would not be able to handle the amount of operations on the data. So we use them for performance reasons. 

<!-- Complex Math Operations -->

Designed to perform complex operations on vectors like filtering and locating nearby vectors e.g. cosine similarity (measure of how similar two vectors are)

<!-- Specialized Vector Indices -->

Specialized vector indices are used to make retrieval easier and more deterministic, less stochastic (probabilistic). 

<!-- Compact Storage -->

Optimized storage reduces load and query latency. 

<!-- Sharding -->

Distributing data across multiple machines. SQL databases do this but require more effort to scale out. Vector databases have sharding built into their architecture.

<!-- Create cluster on Weaviate -->

1. Create account
2. Create cluster in free tier with authentication enabled
3. Get Weaviate URL and Weaviate API key

<!-- Start building -->

```
mkdir weaviate-vector-database && cd weaviate-vector-database
npm init -y && npm install dotenv openai weaviate-ts-client
mkdir src
```

Create .env (add .env to gitignore)

OPENAI_KEY="<OPENAI_API_KEY>"
WEAVIATE_API_KEY="<WEAVIATE_API_KEY>"
WEAVIATE_URL="<WEAVIATE_URL>"
DATA_CLASSNAME="Document"


<!-- Helper functions -->

Need functionality to:

1. Connect to our database
2. Batch vectorize and upload documents
3. Query the most similar items

4. and a main function that performs these operations