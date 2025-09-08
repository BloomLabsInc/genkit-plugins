![Firebase Genkit + Convex](https://github.com/BloomLabsInc/genkit-plugins/blob/main/assets/genkit-hnsw.png?raw=true)

<h1 align="center"> Firebase Genkit <> HNSW Vector Plugin</h1>

<h4 align="center">HNSW Community Plugin for Google Firebase Genkit </h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/BloomLabsInc/genkit-plugins?label=version">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-hnsw">
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/BloomLabsInc?style=social">
   <img alt="GitHub License" src="https://img.shields.io/github/license/BloomLabsInc/genkit-plugins">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/BloomLabsInc/genkit-plugins?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/BloomLabsInc/genkit-plugins?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/BloomLabsInc/genkit-plugins">
</div>

**`genkitx-hnsw`** is a community plugin for using HNSW Vector Store with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-hnsw`
- `yarn add genkitx-hnsw`
- `pnpm add genkitx-hnsw`

## Usage

## Usage HNSW Indexer plugin

This is a usage of Genkit plugin flow to save data into vector store with HNSW Vector Store, Gemini Embedder and Gemini LLM.

#### Data preparations

Prepare your data or documents in a Folder
![Restaurants data](https://github.com/BloomLabsInc/genkit-plugins/blob/main/plugins/hnsw/assets/restaurants-data.png?raw=true)

#### Register HNSW Indexer Plugin

Import the plugin into your Genkit project

```bash
import { hnswIndexer } from "genkitx-hnsw";

export default configureGenkit({
  plugins: [
    hnswIndexer({ apiKey: "GOOGLE_API_KEY" })
  ]
});
```

#### Genkit UI HNSW Indexer flow running

Open Genkit UI and choose the registered plugin `HNSW Indexer`

Execute the flow with Input and Output required parameter

- `dataPath` : Your data and other documents path to be learned by the AI
- `indexOutputPath` : Your expected output path for your Vector Store Index that is processed based on the data and documents you provided

![Genkit UI HNSW Indexer Flow](https://github.com/BloomLabsInc/genkit-plugins/blob/main/plugins/hnsw/assets/hnsw-indexer-flow.png?raw=true)

#### Vector Store Index Result

![HNSW Vector](https://github.com/retzd-tech/BloomLabsInc/genkit-plugins/blob/main/plugins/hnsw/assets/hnsw-indexer-result.png?raw=true)
Vector store will be saved in the defined output path. this index will be used for the prompt generation process with the HNSW Retriever plugin. you can continue the implementation by using the HNSW Retriever plugin

### Optional Parameter

- `chunkSize: number`
  How much data is processed at a time. It's like breaking a big task into smaller pieces to make it more manageable. By setting the chunk size, we decide how much information the AI handles in one go, which can affect both the speed and accuracy of the AI's learning process.

  `default value : 12720`

- `separator: string`
  During the creation of a vector index is a symbol or character used to separate different pieces of information in the input data. It helps the AI understand where one unit of data ends and another begins, enabling it to process and learn from the data more effectively.

  `default value : "\n"`

## Usage HNSW Retriever plugin

This is a usage of Genkit plugin flow to process your prompt with Gemini LLM Model enriched with additional and specific information or knowledge within the HNSW Vector Database you provided. with this plugin you will get LLM response with additional specific context.

#### Register HNSW Retriever Plugin

Import the plugin into your Genkit project

```bash
import { googleAI } from "@genkit-ai/googleai";
import { hnswRetriever } from "genkitx-hnsw";

export default configureGenkit({
  plugins: [
    googleAI(),
    hnswRetriever({ apiKey: "GOOGLE_API_KEY" })
  ]
});
```

Make sure you import the GoogleAI plugin for the Gemini LLM Model provider, currently this plugin only supports Gemini, will provide more model soon!

#### Genkit UI HNSW Retriever flow running

Open Genkit UI and choose the registered Plugin `HNSW Retriever`
Execute the flow with the required parameter

- `prompt` : Type your prompt where you will get answers with more enriched context based on the vector you provided.
- `indexPath` : Define folder Vector Index path you wanna use as a knowledge reference, where you get this files path from HNSW Indexer plugin.

In this example, Let's try to ask about the price list information of a restaurant in Surabaya city, where it has been provided within the Vector Index.

We can type the prompt and run it, after the flow finished, you will get response enriched with specific knowledge based on your Vector Index.

![Genkit UI Prompt Result](https://github.com/BloomLabsInc/genkit-plugins/blob/main/plugins/hnsw/assets/hnsw-retriever-flow.png?raw=true)

### Optional Parameter

- `temperature: number`
  temperature controls the randomness of the generated output. Lower temperatures result in more deterministic output, with the model selecting the most likely token at each step. Higher temperatures increase the randomness, allowing the model to explore less probable tokens, potentially generating more creative but less coherent text.

  `default value : 0.1`

- `maxOutputTokens: number`
  This parameter specifies the maximum number of tokens (words or subwords) the model should generate in a single inference step. It helps control the length of the generated text.

  `default value : 500`

- `topK: number`
  Top-K sampling restricts the model's choices to the top K most likely tokens at each step. This helps prevent the model from considering overly rare or unlikely tokens, improving the coherence of the generated text.

  `default value : 1`

- `topP: number`
  Top-P sampling, also known as nucleus sampling, considers the cumulative probability distribution of tokens and selects the smallest set of tokens whose cumulative probability exceeds a predefined threshold (often denoted as P). This allows for dynamic selection of the number of tokens considered at each step, depending on the likelihood of the tokens.

  `default value : 0`

- `stopSequences: string[]`
  These are sequences of tokens that, when generated, signal the model to stop generating text. This can be useful for controlling the length or content of the generated output, such as ensuring the model stops generating after reaching the end of a sentence or paragraph.

  `default value : []`

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/BloomLabsInc/genkit-plugins/blob/main/CONTRIBUTING.md).

## Need support?

> \[!NOTE\]\
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [Github Discussions](https://github.com/BloomLabsInc/genkit-plugins/discussions).

## Credits

This plugin is proudly maintained by the team at [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## License

This project is licensed under the [Apache 2.0 License](https://github.com/BloomLabsInc/genkit-plugins/blob/main/LICENSE).
