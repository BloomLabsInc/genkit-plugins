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

import { genkitPlugin } from '@genkit-ai/core';
import { defineFlow } from '@genkit-ai/flow';

import { PluginOptions } from './interfaces';
import { hnswIndexerAction, hnswRetrieverAction } from './actions';
import { indexerFlowConfig, retrieverflowConfig } from './config';
import { checkApiKey } from './utilities';
import { PLUGIN_NAME_INDEXER, PLUGIN_NAME_RETRIEVER } from './constants';

export const hnswIndexer = genkitPlugin(
  PLUGIN_NAME_INDEXER,
  async (pluginOptions: PluginOptions) => {
    checkApiKey(pluginOptions);
    defineFlow(indexerFlowConfig, (flowOptions) =>
      hnswIndexerAction(flowOptions, pluginOptions)
    );
  }
);

export const hnswRetriever = genkitPlugin(
  PLUGIN_NAME_RETRIEVER,
  async (pluginOptions: PluginOptions) => {
    checkApiKey(pluginOptions);
    defineFlow(retrieverflowConfig, (flowOptions) =>
      hnswRetrieverAction(flowOptions, pluginOptions)
    );
  }
);
