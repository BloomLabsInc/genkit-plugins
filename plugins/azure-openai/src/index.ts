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

import type { Genkit } from 'genkit';
import { genkitPlugin } from 'genkit/plugin';
import { AzureClientOptions, AzureOpenAI } from 'openai';

import { dallE3, dallE3Model } from './dalle.js';
import { whisper1, whisper1Model } from './whisper.js';

import {
  openaiEmbedder,
  SUPPORTED_EMBEDDING_MODELS,
  textEmbedding3Large,
  textEmbedding3Small,
  textEmbeddingAda002,
} from './embedder.js';
import {
  gpt35Turbo,
  gpt4,
  gpt41,
  gpt41Mini,
  gpt41Nano,
  o1Preview,
  o1Mini,
  o1,
  gpt4o,
  gpt4oMini,
  o3,
  o3Mini,
  o4Mini,
  gpt45,
  gptModel,
  SUPPORTED_GPT_MODELS,
} from './gpt.js';
import { SUPPORTED_TTS_MODELS, ttsModel, tts1, tts1Hd } from './tts.js';
export {
  dallE3,
  tts1,
  tts1Hd,
  whisper1,
  gpt35Turbo,
  gpt4,
  gpt41,
  gpt41Mini,
  gpt41Nano,
  o1,
  o1Mini,
  o1Preview,
  gpt4o,
  gpt4oMini,
  o3,
  o3Mini,
  o4Mini,
  gpt45,
  textEmbedding3Large,
  textEmbedding3Small,
  textEmbeddingAda002,
};

export interface PluginOptions extends AzureClientOptions {}

export const azureOpenAI = (options?: PluginOptions) =>
  genkitPlugin('azure-openai', async (ai: Genkit) => {
    const client = new AzureOpenAI(options);
    for (const name of Object.keys(SUPPORTED_GPT_MODELS)) {
      gptModel(ai, name, client);
    }
    dallE3Model(ai, client);
    whisper1Model(ai, client);
    for (const name of Object.keys(SUPPORTED_TTS_MODELS)) {
      ttsModel(ai, name, client);
    }
    for (const name of Object.keys(SUPPORTED_EMBEDDING_MODELS)) {
      openaiEmbedder(ai, name, client);
    }
  });

export default azureOpenAI;
