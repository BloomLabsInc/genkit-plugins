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

import { GenerationCommonConfigSchema, Message, z } from 'genkit';
import type {
  GenerateRequest,
  Genkit,
  MessageData,
  Part,
  Role,
  StreamingCallback,
  ToolRequestPart,
} from 'genkit';
import {
  CandidateData,
  GenerateResponseChunkData,
  modelRef,
  ToolDefinition,
} from 'genkit/model';
import { AzureOpenAI } from 'openai';
import {
  type ChatCompletion,
  type ChatCompletionChunk,
  type ChatCompletionContentPart,
  type ChatCompletionCreateParamsNonStreaming,
  type ChatCompletionMessageParam,
  type ChatCompletionMessageToolCall,
  type ChatCompletionRole,
  type ChatCompletionTool,
  type CompletionChoice,
} from 'openai/resources/index.mjs';

type VisualDetailLevel = 'low' | 'auto' | 'high';

const MODELS_SUPPORTING_OPENAI_RESPONSE_FORMAT = [
  'gpt-4',
  'gpt-4-32k',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-o1',
  'gpt-o1-mini',
  'gpt-o1-preview',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-instruct',
  'gpt-3.5-turbo-26k',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4.1',
  'o3',
  'o3-mini',
  'o4-mini',
  'o1',
  'o1-mini',
  'o1-preview',
];

export const OpenAiConfigSchema = GenerationCommonConfigSchema.extend({
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  logitBias: z.record(z.string(), z.number().min(-100).max(100)).optional(),
  logProbs: z.boolean().optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  seed: z.number().int().optional(),
  topLogProbs: z.number().int().min(0).max(20).optional(),
  user: z.string().optional(),
  visualDetailLevel: z.enum(['auto', 'low', 'high']).optional(),
});

export const gpt4o = modelRef({
  name: 'azure-openai/gpt-4o',
  info: {
    versions: ['gpt-4o'],
    label: 'OpenAI - GPT-4o',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt4oMini = modelRef({
  name: 'azure-openai/gpt-4o-mini',
  info: {
    versions: ['gpt-4o-mini'],
    label: 'OpenAI - GPT-4o Mini',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt4 = modelRef({
  name: 'azure-openai/gpt-4',
  info: {
    versions: ['gpt-4', 'gpt-4-32k'],
    label: 'OpenAI - GPT-4',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt45 = modelRef({
  name: 'azure-openai/gpt-4.5',
  info: {
    versions: ['gpt-4.5-preview'],
    label: 'OpenAI - GPT-4.5',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt41 = modelRef({
  name: 'azure-openai/gpt-4.1',
  info: {
    versions: ['gpt-4.1'],
    label: 'OpenAI - GPT-4.1',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt41Mini = modelRef({
  name: 'azure-openai/gpt-4.1-mini',
  info: {
    versions: ['gpt-4.1-mini'],
    label: 'OpenAI - GPT-4.1 Mini',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt41Nano = modelRef({
  name: 'azure-openai/gpt-4.1-nano',
  info: {
    versions: ['gpt-4.1-nano'],
    label: 'OpenAI - GPT-4.1 Nano',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const o1 = modelRef({
  name: 'azure-openai/o1',
  info: {
    versions: ['o1'],
    label: 'OpenAI - o1',
    supports: {
      multiturn: true,
      tools: false,
      media: true,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const o1Mini = modelRef({
  name: 'azure-openai/o1-mini',
  info: {
    versions: ['o1-mini'],
    label: 'OpenAI - o1 Mini',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const o1Preview = modelRef({
  name: 'azure-openai/o1-preview',
  info: {
    versions: ['o1-preview'],
    label: 'OpenAI - o1 Preview',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const o3 = modelRef({
  name: 'azure-openai/o3',
  info: {
    versions: ['o3'],
    label: 'OpenAI - o3',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const o4Mini = modelRef({
  name: 'azure-openai/o4-mini',
  info: {
    versions: ['o4-mini'],
    label: 'OpenAI - o4 Mini',
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const o3Mini = modelRef({
  name: 'azure-openai/o3-mini',
  info: {
    versions: ['o3-mini'],
    label: 'OpenAI - o3 Mini',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const gpt35Turbo = modelRef({
  name: 'azure-openai/gpt-3.5-turbo',
  info: {
    versions: ['gpt-3.5-turbo', 'gpt-35-turbo-instruct', 'gpt-35-turbo-16k'],
    label: 'OpenAI - GPT-3.5 Turbo',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['json', 'text'],
    },
  },
  configSchema: OpenAiConfigSchema,
});

export const SUPPORTED_GPT_MODELS = {
  'o1-mini': o1Mini,
  'o1-preview': o1Preview,
  o1: o1,
  o3: o3,
  'o3-mini': o3Mini,
  'o4-mini': o4Mini,
  'gpt-4.1': gpt41,
  'gpt-4.1-mini': gpt41Mini,
  'gpt-4.1-nano': gpt41Nano,
  'gpt-4': gpt4,
  'gpt-4o': gpt4o,
  'gpt-4o-mini': gpt4oMini,
  'gpt-4.5': gpt45,
  'gpt-3.5-turbo': gpt35Turbo,
};

function toOpenAIRole(role: Role): ChatCompletionRole {
  switch (role) {
    case 'user':
      return 'user';
    case 'model':
      return 'assistant';
    case 'system':
      return 'system';
    case 'tool':
      return 'tool';
    default:
      throw new Error(`role ${role} doesn't map to an OpenAI role.`);
  }
}

function toOpenAiTool(tool: ToolDefinition): ChatCompletionTool {
  let parameters;
  if (tool.inputSchema !== null) {
    if (typeof tool.inputSchema === 'string') {
      try {
        parameters = JSON.parse(tool.inputSchema);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown parsing error';
        throw new Error(
          `Invalid JSON schema for function '${tool.name}': ${errorMessage}`
        );
      }
    } else {
      parameters = tool.inputSchema;
    }

    parameters.type = 'object';
    parameters.properties = {
      ...tool.inputSchema!.properties,
    };
  }

  return {
    type: 'function',
    function: {
      name: tool.name,
      parameters: parameters,
    },
  };
}

export function toOpenAiTextAndMedia(
  part: Part,
  visualDetailLevel: VisualDetailLevel
): ChatCompletionContentPart {
  if (part.text) {
    return {
      type: 'text',
      text: part.text,
    };
  } else if (part.media) {
    return {
      type: 'image_url',
      image_url: {
        url: part.media.url,
        detail: visualDetailLevel,
      },
    };
  }
  throw Error(
    `Unsupported genkit part fields encountered for current message role: ${part}.`
  );
}

export function toOpenAiMessages(
  messages: MessageData[],
  visualDetailLevel: VisualDetailLevel = 'auto'
): ChatCompletionMessageParam[] {
  const openAiMsgs: ChatCompletionMessageParam[] = [];
  for (const message of messages) {
    const msg = new Message(message);
    const role = toOpenAIRole(message.role);
    switch (role) {
      case 'user':
        openAiMsgs.push({
          role: role,
          content: msg.content.map((part) =>
            toOpenAiTextAndMedia(part, visualDetailLevel)
          ),
        });
        break;
      case 'system':
        openAiMsgs.push({
          role: role,
          content: msg.text,
        });
        break;
      case 'assistant':
        const toolCalls: ChatCompletionMessageToolCall[] = msg.content
          .filter((part) => part.toolRequest)
          .map((part) => {
            if (!part.toolRequest) {
              throw Error(
                'Mapping genkit message to openai tool call content part but message.toolRequest not provided.'
              );
            }
            return {
              id: part.toolRequest.ref || '',
              type: 'function',
              function: {
                name: part.toolRequest.name,
                arguments: JSON.stringify(part.toolRequest.input),
              },
            };
          });
        if (toolCalls?.length > 0) {
          openAiMsgs.push({
            role: role,
            tool_calls: toolCalls,
          });
        } else {
          openAiMsgs.push({
            role: role,
            content: msg.text,
          });
        }
        break;
      case 'tool':
        const toolResponseParts = msg.toolResponseParts();
        toolResponseParts.map((part) => {
          openAiMsgs.push({
            role: role,
            tool_call_id: part.toolResponse.ref || '',
            content:
              typeof part.toolResponse.output === 'string'
                ? part.toolResponse.output
                : JSON.stringify(part.toolResponse.output),
          });
        });
        break;
      default:
        throw new Error('unrecognized role');
    }
  }
  return openAiMsgs;
}

const finishReasonMap: Record<
  // OpenAI Node SDK doesn't support tool_call in the enum, but it is returned from the API
  CompletionChoice['finish_reason'] | 'tool_calls',
  CandidateData['finishReason']
> = {
  length: 'length',
  stop: 'stop',
  tool_calls: 'stop',
  content_filter: 'blocked',
};

function fromOpenAiToolCall(
  toolCall:
    | ChatCompletionMessageToolCall
    | ChatCompletionChunk.Choice.Delta.ToolCall,
  choice: ChatCompletion.Choice | ChatCompletionChunk.Choice
) {
  if (!toolCall.function) {
    throw Error(
      `Unexpected openAI chunk choice. tool_calls was provided but one or more tool_calls is missing.`
    );
  }
  const f = toolCall.function;
  if (choice.finish_reason === 'tool_calls') {
    return {
      toolRequest: {
        name: f.name,
        ref: toolCall.id,
        input: f.arguments ? JSON.parse(f.arguments) : f.arguments,
      },
    };
  } else {
    return {
      toolRequest: {
        name: f.name,
        ref: toolCall.id,
        input: '',
      },
    };
  }
}

function fromOpenAiChoice(
  choice: ChatCompletion['choices'][0],
  jsonMode = false
): CandidateData {
  const toolRequestParts = choice.message.tool_calls?.map((toolCall) =>
    fromOpenAiToolCall(toolCall, choice)
  );
  return {
    index: choice.index,
    finishReason: finishReasonMap[choice.finish_reason] || 'other',
    message: {
      role: 'model',
      content: toolRequestParts
        ? // Note: Not sure why I have to cast here exactly.
          // Otherwise it thinks toolRequest must be 'undefined' if provided
          (toolRequestParts as ToolRequestPart[])
        : [
            jsonMode
              ? { data: JSON.parse(choice.message.content!) }
              : { text: choice.message.content! },
          ],
    },
    custom: {},
  };
}

function fromOpenAiChunkChoice(
  choice: ChatCompletionChunk['choices'][0],
  jsonMode = false
): CandidateData {
  const toolRequestParts = choice.delta.tool_calls?.map((toolCall) =>
    fromOpenAiToolCall(toolCall, choice)
  );
  return {
    index: choice.index,
    finishReason: choice.finish_reason
      ? finishReasonMap[choice.finish_reason] || 'other'
      : 'unknown',
    message: {
      role: 'model',
      content: toolRequestParts
        ? // Note: Not sure why I have to cast here exactly.
          // Otherwise it thinks toolRequest must be 'undefined' if provided
          (toolRequestParts as ToolRequestPart[])
        : [
            jsonMode
              ? { data: JSON.parse(choice.delta.content!) }
              : { text: choice.delta.content! },
          ],
    },
    custom: {},
  };
}

export function toOpenAiRequestBody(
  modelName: string,
  request: GenerateRequest
) {
  const mapToSnakeCase = <T extends Record<string, any>>(
    obj: T
  ): Record<string, any> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const snakeCaseKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      acc[snakeCaseKey] = value;
      return acc;
    }, {});
  };
  const model = SUPPORTED_GPT_MODELS[modelName];
  if (!model) throw new Error(`Unsupported model: ${modelName}`);
  const openAiMessages = toOpenAiMessages(
    request.messages,
    request.config?.visualDetailLevel
  );
  const mappedModelName = request.config?.version || modelName;
  const body = {
    messages: openAiMessages,
    tools: request.tools?.map(toOpenAiTool),
    model: mappedModelName,
    max_tokens: request.config?.maxOutputTokens,
    temperature: request.config?.temperature,
    top_p: request.config?.topP,
    n: request.candidates,
    stop: request.config?.stopSequences,
    ...mapToSnakeCase(request.config?.custom || {}),
  } as ChatCompletionCreateParamsNonStreaming;

  const response_format = request.output?.format;
  if (
    response_format &&
    MODELS_SUPPORTING_OPENAI_RESPONSE_FORMAT.includes(mappedModelName)
  ) {
    if (
      response_format === 'json' &&
      model.info.supports?.output?.includes('json')
    ) {
      body.response_format = {
        type: 'json_object',
      };
    } else if (
      response_format === 'text' &&
      model.info.supports?.output?.includes('text')
    ) {
      body.response_format = {
        type: 'text',
      };
    } else {
      throw new Error(
        `${response_format} format is not supported for GPT models currently`
      );
    }
  }
  for (const key in body) {
    if (!body[key] || (Array.isArray(body[key]) && !body[key].length))
      delete body[key];
  }
  return body;
}

/**
 *
 */
export function gptModel(ai: Genkit, name: string, client: AzureOpenAI) {
  const modelId = `azure-openai/${name}`;
  const model = SUPPORTED_GPT_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return ai.defineModel(
    {
      name: modelId,
      ...model.info,
      configSchema: SUPPORTED_GPT_MODELS[name].configSchema,
    },
    async (
      request,
      streamingCallback?: StreamingCallback<GenerateResponseChunkData>
    ) => {
      let response: ChatCompletion;
      const body = toOpenAiRequestBody(name, request);
      if (streamingCallback) {
        const stream = client.beta.chat.completions.stream({
          ...body,
          stream: true,
          stream_options: {
            include_usage: true,
          },
        });
        for await (const chunk of stream) {
          chunk.choices?.forEach((chunk) => {
            const c = fromOpenAiChunkChoice(chunk);
            streamingCallback({
              index: c.index,
              content: c.message.content,
            });
          });
        }
        response = await stream.finalChatCompletion();
      } else {
        response = await client.chat.completions.create(body);
      }
      return {
        candidates: response.choices.map((c) =>
          fromOpenAiChoice(c, request.output?.format === 'json')
        ),
        usage: {
          inputTokens: response.usage?.prompt_tokens,
          outputTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens,
        },
        custom: response,
      };
    }
  );
}
