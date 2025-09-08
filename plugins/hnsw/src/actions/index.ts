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

import { saveVectorIndexer } from './../indexer';
import { retrieveResponseWithVector } from './../retriever';
import {
  RetrieverFlowOptions,
  PluginOptions,
  IndexerFlowOptions,
} from './../interfaces';

export const hnswIndexerAction = async (
  flowOptions: IndexerFlowOptions,
  pluginOptions: PluginOptions
) => {
  try {
    return await saveVectorIndexer(flowOptions, pluginOptions);
  } catch (error) {
    return `Vector index saving error, ${error}`;
  }
};

export const hnswRetrieverAction = async (
  flowOptions: RetrieverFlowOptions,
  pluginOptions: PluginOptions
) => {
  try {
    return await retrieveResponseWithVector(flowOptions, pluginOptions);
  } catch (error) {
    return `Error generating prompt response, ${error}`;
  }
};
