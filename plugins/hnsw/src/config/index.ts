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

import * as z from 'zod';

import {
  FLOW_NAME_INDEXER,
  FLOW_NAME_RETRIEVER,
  SCHEMA_PROMPT,
  SCHEMA_INDEX_PATH,
  SCHEMA_RESULT,
  SCHEMA_TRAINABLE_PATH,
  SCHEMA_INDEX_OUTPUT_PATH,
} from './../constants';

export const indexerFlowConfig = {
  name: FLOW_NAME_INDEXER,
  inputSchema: z.object({
    dataPath: z.string().describe(SCHEMA_TRAINABLE_PATH),
    indexOutputPath: z.string().describe(SCHEMA_INDEX_OUTPUT_PATH),
  }),
  outputSchema: z.string().describe(SCHEMA_RESULT),
};

export const retrieverflowConfig = {
  name: FLOW_NAME_RETRIEVER,
  inputSchema: z.object({
    prompt: z.string().describe(SCHEMA_PROMPT),
    indexPath: z.string().describe(SCHEMA_INDEX_PATH),
  }),
  outputSchema: z.string().describe(SCHEMA_RESULT),
};
