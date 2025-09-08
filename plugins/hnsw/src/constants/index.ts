/**
 * Copyright 2024 Bloom Labs Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const PLUGIN_NAME_INDEXER = 'HNSW Indexer';
export const PLUGIN_NAME_RETRIEVER = 'HNSW Retriever';
export const FLOW_NAME_INDEXER = 'HNSW Indexer';
export const FLOW_NAME_RETRIEVER = 'HNSW Retriever';
export const ERROR_NO_API_KEY =
  'Must supply either `options.apiKey` or set `GOOGLE_API_KEY` environment variable.';
export const ERROR_INVALID_ARGUMENT = 'INVALID_ARGUMENT';
export const SCHEMA_PROMPT =
  'Type your prompt for the LLM Model and the HNSW Vector to process';
export const SCHEMA_INDEX_PATH =
  'Define Vector Index path you wanna use, can be retrieved from genkitx-hnsw-indexer plugin';
export const SCHEMA_RESULT =
  'The prompt result with more context from HNSW Vector';
export const SCHEMA_TRAINABLE_PATH =
  'Your data and other documents path to be learned by the AI';
export const SCHEMA_INDEX_OUTPUT_PATH =
  'Your expected output path for your Vector Store Index that is processed based on the data and documents you provided';
export const EMBEDDING_MODEL_NAME = 'Gemini Model embedding-001';
export const EMBEDDING_MODEL = 'embedding-001';
export const EMBEDDING_TITLE = 'Gemini embedding-001';
