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

import { Message, Part, StreamingCallback } from 'genkit';
import {
  CandidateData,
  GenerateRequest,
  GenerateResponseChunkData,
  MessageData,
  ModelAction,
  Role,
  ToolDefinition,
} from 'genkit/model';
import { GenerationCommonConfigSchema, modelRef } from 'genkit/model';
import {
  Tool,
  FunctionT,
  ChatCompletionChoice,
  CompletionChunk,
  ToolCall,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ContentChunk,
} from '@mistralai/mistralai/models/components/index.js';
import { Genkit } from 'genkit';
import { z } from 'genkit';
import { Mistral } from '@mistralai/mistralai';

export const MistralConfigSchema = GenerationCommonConfigSchema.extend({
  visualDetailLevel: z.enum(['auto', 'low', 'high']).optional(),
});

export const openMistral7B = modelRef({
  name: 'mistral/open-mistral-7b',
  info: {
    versions: ['mistral-tiny-2312'],
    label: 'Mistral - Mistral 7B',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMinistral3B = modelRef({
  name: 'mistral/ministral-3b',
  info: {
    versions: ['ministral-3b-latest', 'ministral-3b-2410'],
    label: 'Mistral - Ministral 3B',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMinistral8B = modelRef({
  name: 'mistral/ministral-8b',
  info: {
    versions: ['ministral-8b-latest', 'ministral-8b-2410'],
    label: 'Mistral - Ministral 8B',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMistralNemo = modelRef({
  name: 'mistral/open-mistral-nemo',
  info: {
    versions: ['open-mistral-nemo', 'pen-mistral-nemo-2407'],
    label: 'Mistral - Nemo Model',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMistralSaba = modelRef({
  name: 'mistral/mistral-saba',
  info: {
    versions: ['mistral-saba-latest', 'mistral-saba-2502'],
    label: 'Mistral - Saba Model',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openCodestralMambda = modelRef({
  name: 'mistral/open-codestral-mamba',
  info: {
    versions: ['open-codestral-mamba'],
    label: 'Mistral - Codestral Mamba',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openCodestral = modelRef({
  name: 'mistral/codestral',
  info: {
    versions: ['codestral-latest', 'codestral-2501'],
    label: 'Mistral - Codestral',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMistral8x7B = modelRef({
  name: 'mistral/open-mixtral-8x7b',
  info: {
    versions: ['open-mixtral-8x7b'],
    label: 'Mistral - Mistral 8x7B',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMixtral8x22B = modelRef({
  name: 'mistral/open-mixtral-8x22b',
  info: {
    versions: ['open-mixtral-8x22b'],
    label: 'Mistral - Mistral 8x22B',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMistralSmall = modelRef({
  name: 'mistral/mistral-small',
  info: {
    versions: [
      'mistral-small-latest',
      'mistral-small-2402',
      'mistral-small-2501',
    ],
    label: 'Mistral - Mistral Small',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMistralMedium = modelRef({
  name: 'mistral/mistral-medium',
  info: {
    versions: ['mistral-medium-2312'],
    label: 'Mistral - Mistral Medium',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openMistralLarge = modelRef({
  name: 'mistral/mistral-large',
  info: {
    versions: [
      'mistral-large-latest',
      'mistral-large-2402',
      'mistral-large-2407',
    ],
    label: 'Mistral - Mistral Large',
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openPixtralLarge = modelRef({
  name: 'mistral/pixtral-large',
  info: {
    versions: ['pixtral-large-latest', 'pixtral-large-2411'],
    label: 'Mistral - Pixtral Large',
    supports: {
      multiturn: true,
      tools: false,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openPixtral = modelRef({
  name: 'mistral/pixtral',
  info: {
    versions: ['pixtral-12b-2409'],
    label: 'Mistral - Pixtral',
    supports: {
      multiturn: true,
      tools: false,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

function toMistralRole(role: Role): 'system' | 'user' | 'assistant' | 'tool' {
  switch (role) {
    case 'user':
      return 'user';
    case 'model':
      return 'assistant';
    case 'system':
      return 'system';
    case 'tool':
      return 'assistant';
    default:
      throw new Error(`Role ${role} doesn't map to a Mistral role.`);
  }
}

function toMistralTool(tool: ToolDefinition): Tool {
  return {
    type: 'function',
    function: {
      name: tool.name,
      parameters: tool.inputSchema,
      description: tool.description,
    } as FunctionT,
  };
}

/**
 * Converts a Genkit Part to the corresponding Mistral ChatCompletionContentPart.
 * @param part The Genkit Part to convert.
 * @param visualDetailLevel The visual detail level to use for media parts.
 * @returns The corresponding Mistral ChatCompletionContentPart.
 * @throws Error if the part contains unsupported fields for the current message role.
 */
export function toMistralTextAndMedia(part: Part): ContentChunk {
  if (part.text) {
    return {
      type: 'text',
      text: part.text,
    };
  } else if (part.media) {
    return {
      type: 'image_url',
      imageUrl: {
        url: part.media.url,
      },
    };
  }
  throw Error(
    `Unsupported genkit part fields encountered for current message role: ${JSON.stringify(part)}.`
  );
}

export function toMistralMessages(
  messages: MessageData[]
): ChatCompletionRequest['messages'] {
  const mistralMsgs: ChatCompletionRequest['messages'] = [];
  for (const message of messages) {
    const msg = new Message(message);
    const role = toMistralRole(message.role);

    // Build the appropriate message type based on the role
    if (role === 'system') {
      mistralMsgs.push({
        role: 'system',
        content: msg.text || '',
      });
    } else if (role === 'user') {
      mistralMsgs.push({
        role: 'user',
        content: msg.content.map((part) => toMistralTextAndMedia(part)),
      });
    } else if (role === 'assistant') {
      mistralMsgs.push({
        role: 'assistant',
        content: msg.content.map((part) => toMistralTextAndMedia(part)),
      });
    } else if (role === 'tool') {
      mistralMsgs.push({
        role: 'tool',
        content: msg.content.map((part) => toMistralTextAndMedia(part)),
      });
    }
  }
  return mistralMsgs;
}

const finishReasonMap: Record<
  NonNullable<string>,
  CandidateData['finishReason']
> = {
  length: 'length',
  stop: 'stop',
  tool_calls: 'stop',
  content_filter: 'blocked',
};

export const SUPPORTED_MISTRAL_MODELS = {
  'open-mistral-7b': openMistral7B,
  'open-mixtral-8x7b': openMistral8x7B,
  'open-mixtral-8x22b': openMixtral8x22B,
  'mistral-small': openMistralSmall,
  'mistral-medium': openMistralMedium,
  'mistral-large': openMistralLarge,
  'ministral-3b': openMinistral3B,
  'ministral-8b': openMinistral8B,
  'open-mistral-nemo': openMistralNemo,
  'open-codestral-mamba': openCodestralMambda,
  codestral: openCodestral,
  'mistral-saba': openMistralSaba,
  'pixtral-large': openPixtralLarge,
  pixtral: openPixtral,
};

function fromMistralToolCall(toolCall: ToolCall) {
  if (!toolCall.function) {
    throw Error(
      `Unexpected mistral chunk choice. tool_calls was provided but one or more tool_calls is missing.`
    );
  }
  const f = toolCall.function;
  return {
    toolRequest: {
      name: f.name,
      ref: toolCall.id,
      input:
        typeof f.arguments === 'string' ? JSON.parse(f.arguments) : f.arguments,
    },
  };
}

function fromMistralChoice(choice: ChatCompletionChoice): CandidateData {
  const toolRequestParts = choice.message.toolCalls?.map(fromMistralToolCall);
  return {
    index: choice.index,
    finishReason: finishReasonMap[choice.finishReason] || 'other',
    message: {
      role: 'model',
      content: toolRequestParts
        ? toolRequestParts
        : [
            {
              text:
                typeof choice.message.content === 'string'
                  ? choice.message.content
                  : '',
            },
          ],
    },
    custom: {},
  };
}

function fromMistralChunkChoice(
  choice: CompletionChunk['choices'][0]
): CandidateData {
  return {
    index: choice.index,
    finishReason: choice.finishReason
      ? finishReasonMap[choice.finishReason] || 'other'
      : 'unknown',
    message: {
      role: 'model',
      content: [
        {
          text:
            typeof choice.delta.content === 'string'
              ? choice.delta.content
              : '',
        },
      ],
    },
    custom: {},
  };
}

export function toMistralRequestBody(
  modelName: string,
  request: GenerateRequest<typeof GenerationCommonConfigSchema>
) {
  const model = SUPPORTED_MISTRAL_MODELS[modelName];
  if (!model) throw new Error(`Unsupported model: ${modelName}`);
  const mistralMessages = toMistralMessages(request.messages);
  const mappedModelName = request.config?.version || model.version || modelName;

  let responseFormat;
  if (request.output?.format === 'json') {
    responseFormat = { type: 'json_object' };
  } else {
    responseFormat = null;
  }
  const body: ChatCompletionRequest = {
    messages: mistralMessages,
    tools: request.tools?.map(toMistralTool),
    model: mappedModelName,
    maxTokens: request.config?.maxOutputTokens,
    temperature: request.config?.temperature,
    topP: request.config?.topP,
    n: request.candidates,
    stop: request.config?.stopSequences,
    responseFormat: responseFormat,
  };

  for (const key in body) {
    if (!body[key] || (Array.isArray(body[key]) && !body[key].length))
      delete body[key];
  }
  return body;
}

export function mistralModel(
  ai: Genkit,
  name: string,
  client: Mistral
): ModelAction<typeof GenerationCommonConfigSchema> {
  //Ugly any type, should be MistralClient but cannot import it here
  const modelId = `mistral/${name}`;
  const model = SUPPORTED_MISTRAL_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return ai.defineModel(
    {
      name: modelId,
      ...model.info,
      configSchema: SUPPORTED_MISTRAL_MODELS[name].configSchema,
    },
    async (
      request,
      streamingCallback?: StreamingCallback<GenerateResponseChunkData>
    ) => {
      let response: ChatCompletionResponse | CompletionChunk;
      const body = toMistralRequestBody(name, request);
      if (streamingCallback) {
        const stream = await client.chat.stream(body);
        for await (const chunk of stream) {
          chunk.data.choices?.forEach((choice) => {
            const c = fromMistralChunkChoice(choice);
            streamingCallback({
              index: c.index,
              content: c.message.content,
            });
          });
        }

        response = await client.chat.complete(body);
      } else {
        response = await client.chat.complete(body);
      }
      return {
        candidates: response.choices?.map((c) => fromMistralChoice(c)) || [],
        usage: {
          inputTokens: response.usage?.promptTokens,
          outputTokens: response.usage?.completionTokens,
          totalTokens: response.usage?.totalTokens,
        },
        custom: response,
      };
    }
  );
}
