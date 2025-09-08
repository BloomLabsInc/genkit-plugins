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
import { Message, GenerationCommonConfigSchema, z } from 'genkit';
import type {
  GenerateRequest,
  MessageData,
  Role,
  StreamingCallback,
  ToolRequestPart,
} from 'genkit';
import type {
  ModelAction,
  ToolDefinition,
  CandidateData,
  GenerateResponseChunkData,
} from 'genkit/model';
import { modelRef } from 'genkit/model';
import type { CohereClient } from 'cohere-ai';
import { Cohere } from 'cohere-ai';
import type { ChatStreamEndEventFinishReason } from 'cohere-ai/api';

export const CohereConfigSchema = GenerationCommonConfigSchema.extend({
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  logitBias: z.record(z.string(), z.number().min(-100).max(100)).optional(),
  logProbs: z.boolean().optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  seed: z.number().int().optional(),
  topLogProbs: z.number().int().min(0).max(20).optional(),
  user: z.string().optional(),
  preamble: z.string().optional(),
  promptTruncation: z
    .nativeEnum(Cohere.ChatStreamRequestPromptTruncation)
    .optional(),
  conversationId: z.string().optional(),
  // from Cohere.ChatConnector
  connectors: z
    .array(
      z.object({
        id: z.string(),
        userAccessToken: z.string().optional(),
        continueOnFailure: z.boolean().optional(),
        options: z.record(z.unknown()).optional(),
      })
    )
    .optional(),
  searchQueriesOnly: z.boolean().default(false).optional(),
  maxInputTokens: z.number().int().optional(),
  rawPrompting: z.boolean().default(false),
});

export const commandRPlus = modelRef({
  name: 'cohere/command-r-plus',
  info: {
    versions: ['command-r-plus', 'command-r-plus-04-2024'],
    label: 'Cohere - Command R Plus',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: CohereConfigSchema,
});

export const commandR = modelRef({
  name: 'cohere/command-r',
  info: {
    versions: [
      'command-r',
      'command-r7b-12-2024',
      'command-r-08-2024',
      'command-r-03-2024',
    ],
    label: 'Cohere - Command R',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: CohereConfigSchema,
});

export const commandA = modelRef({
  name: 'cohere/command-a',
  info: {
    versions: ['command-a-03-2025'],
    label: 'Cohere - Command A',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: CohereConfigSchema,
});

export const command = modelRef({
  name: 'cohere/command',
  info: {
    versions: ['command', 'command-nightly'],
    label: 'Cohere - Command',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: CohereConfigSchema,
});

export const commandLight = modelRef({
  name: 'cohere/command-light',
  info: {
    versions: ['command-light', 'command-light-nightly'],
    label: 'Cohere - Command Light',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text'],
    },
  },
  configSchema: CohereConfigSchema,
});

export const SUPPORTED_COMMAND_MODELS = {
  'command-a': commandA,
  'command-r-plus': commandRPlus,
  'command-r': commandR,
  command: command,
  'command-light': commandLight,
};

function toCohereRole(role: Role): Exclude<Cohere.Message['role'], 'TOOL'> {
  switch (role) {
    case 'user':
      return 'USER';
    case 'model':
      return 'CHATBOT';
    case 'system':
      return 'SYSTEM';
    case 'tool':
      return 'CHATBOT';
    default:
      throw new Error(`role ${role} doesn't map to a Cohere role.`);
  }
}

export function jsonSchemaToPythonType(schema: Record<string, any>): string {
  switch (schema.type) {
    case 'string':
      return 'str';
    case 'number':
      return 'float';
    case 'integer':
      return 'int';
    case 'boolean':
      return 'bool';
    case 'array':
      return 'List';
    case 'object':
      return 'Dict';
    case 'null':
      return 'None';
    default:
      throw new Error(
        `Unsupported JSON schema type: ${JSON.stringify(schema)}`
      );
  }
}

export function toCohereTool(tool: ToolDefinition): Cohere.Tool {
  const properties = tool.inputSchema?.properties || {};
  const parameterDefinitions =
    Object.fromEntries<Cohere.ToolParameterDefinitionsValue>(
      Object.entries(properties).map(([key, value]) => [
        key,
        {
          type: jsonSchemaToPythonType(value as Record<string, any>),
          required: tool.inputSchema?.required?.includes(key) || false,
        },
      ])
    );

  return {
    name: tool.name,
    description: tool.description,
    parameterDefinitions,
  };
}

export function toCohereMessageHistory(
  messages: MessageData[]
): Exclude<Cohere.Message, Cohere.Message.Tool>[] {
  const cohereMsgs: Exclude<Cohere.Message, Cohere.Message.Tool>[] = [];
  for (const message of messages) {
    const msg = new Message(message);
    cohereMsgs.push({
      role: toCohereRole(message.role),
      message: msg.text,
    });
  }
  return cohereMsgs;
}

const FINISH_REASON_MAP: Record<
  ChatStreamEndEventFinishReason,
  CandidateData['finishReason']
> = {
  MAX_TOKENS: 'length',
  ERROR_LIMIT: 'length',
  COMPLETE: 'stop',
  ERROR_TOXIC: 'blocked',
  ERROR: 'other',
};

function fromCohereToolCall(toolCall: Cohere.ToolCall): ToolRequestPart {
  return {
    toolRequest: {
      name: toolCall.name,
      input: toolCall.parameters,
    },
  };
}

function fromCohereChatResponse(
  response: Cohere.NonStreamedChatResponse,
  custom?: Record<string, any>,
  index = 0
): CandidateData {
  const toolRequestParts = response.toolCalls?.map(fromCohereToolCall);
  return {
    index: index,
    finishReason:
      (response.finishReason && FINISH_REASON_MAP[response.finishReason]) ||
      'other',
    message: {
      role: 'model',
      content: toolRequestParts
        ? toolRequestParts
        : [
            {
              text: response.text,
              data: response,
            },
          ],
    },
    usage: {
      inputTokens: response.meta?.tokens?.inputTokens,
      outputTokens: response.meta?.tokens?.outputTokens,
      totalTokens:
        (response.meta?.tokens?.inputTokens || 0) +
        (response.meta?.tokens?.outputTokens || 0),
    },
    custom: {
      ...custom,
      generation_id: response.generationId,
    },
  };
}

function fromCohereStreamEvent(
  event: Cohere.StreamedChatResponse,
  index: number
): CandidateData {
  switch (event.eventType) {
    case 'stream-start':
      return {
        index: index,
        finishReason: 'other', // Not sure if this is the appropriate finish reason
        message: {
          role: 'model',
          content: [
            {
              text: '',
            },
          ],
        },
        custom: {
          event_type: event.eventType,
          generation_id: event.generationId,
        },
      };
    case 'search-queries-generation':
      return {
        index: index,
        finishReason: 'other', // Not sure if this is the appropriate finish reason
        message: {
          role: 'model',
          content: event.searchQueries.map((query) => ({
            // text: query.text,
            data: query,
          })),
        },
        custom: {
          event_type: event.eventType,
        },
      };
    case 'search-results':
      return {
        index: index,
        finishReason: 'other', // Not sure if this is the appropriate finish reason
        message: {
          role: 'model',
          content: [
            {
              data: {
                search_results: event.searchResults,
                documents: event.documents,
              },
            },
          ],
        },
        custom: {
          event_type: event.eventType,
        },
      };
    case 'citation-generation':
      return {
        index: index,
        finishReason: 'other', // Not sure if this is the appropriate finish reason
        message: {
          role: 'model',
          content: event.citations.map((citation) => ({
            // text: citation.text,
            data: citation,
          })),
        },
        custom: {
          event_type: event.eventType,
        },
      };
    case 'tool-calls-generation':
      return {
        index: index,
        finishReason: 'other', // Not sure if this is the appropriate finish reason
        message: {
          role: 'model',
          content: event.toolCalls.map((toolCall) =>
            fromCohereToolCall(toolCall)
          ),
        },
        custom: {
          event_type: event.eventType,
        },
      };
    case 'text-generation':
      return {
        index: index,
        finishReason: 'other', // Not sure if this is the appropriate finish reason
        message: {
          role: 'model',
          content: [
            {
              text: event.text,
            },
          ],
        },
        custom: {
          event_type: event.eventType,
        },
      };
    case 'stream-end':
      return fromCohereChatResponse(
        event.response,
        {
          event_type: event.eventType,
        },
        index
      );
    default:
      throw new Error(`Unsupported event type for event: ${event}`);
  }
}

// TODO: Implement this function
// function toCohereToolResult(
//   message: MessageData
// ): Cohere.ChatRequestToolResultsItem {
//   return {
//     call: {
//         name: message.content?.[0]?.toolRequest?.name || "",
//         parameters: message.content?.[0]?.toolRequest?.input || {},
//     },
//     outputs: (Array.isArray(message.content[0].toolResponse) ? message.content[0].toolResponse : [message.content[0].toolResponse].filter(Boolean)) as Record<string, unknown>[],
//   };
// }

export function toCohereRequestBody(
  modelName: string,
  request: GenerateRequest<typeof CohereConfigSchema>
): Cohere.ChatRequest | Cohere.ChatStreamRequest {
  // Note: these types are the same in the Cohere API (not on the surface, e.g. one uses ChatRequestToolResultsItem and the other uses ChatStreamRequestToolResultsItem, but when the types are unwrapped they are exactly the same)
  const model = SUPPORTED_COMMAND_MODELS[modelName];
  if (!model) throw new Error(`Unsupported model: ${modelName}`);
  const mappedModelName = request.config?.version || model.version || modelName;
  const messageHistory = toCohereMessageHistory(request.messages);
  const body: Cohere.ChatRequest = {
    message: messageHistory[0].message,
    model: mappedModelName,
    preamble: request.config?.preamble,
    chatHistory: messageHistory,
    conversationId: request.config?.conversationId,
    promptTruncation: request.config?.promptTruncation,
    connectors: request.config?.connectors,
    searchQueriesOnly: request.config?.searchQueriesOnly,
    // Use Genkit retriever and pass documents as context in the generate call
    // documents: request.config?.documents,
    temperature: request.config?.temperature,
    maxTokens: request.config?.maxOutputTokens,
    maxInputTokens: request.config?.maxInputTokens,
    k: request.config?.topK,
    p: request.config?.topP,
    seed: request.config?.seed,
    stopSequences: request.config?.stopSequences,
    frequencyPenalty: request.config?.frequencyPenalty,
    presencePenalty: request.config?.presencePenalty,
    rawPrompting: request.config?.rawPrompting,
    tools: request.tools?.map(toCohereTool),
    // toolResults: request.messages?.map(toCohereToolResult),
  };

  for (const key in body) {
    if (!body[key] || (Array.isArray(body[key]) && !body[key].length))
      delete body[key];
  }
  return body;
}

/**
 *
 */
export function commandModel(
  ai: Genkit,
  name: string,
  client: CohereClient
): ModelAction<typeof CohereConfigSchema> {
  const modelId = `cohere/${name}`;
  const model = SUPPORTED_COMMAND_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return ai.defineModel(
    {
      name: modelId,
      ...model.info,
      configSchema: SUPPORTED_COMMAND_MODELS[name].configSchema,
    },
    async (
      request,
      streamingCallback?: StreamingCallback<GenerateResponseChunkData>
    ): Promise<{
      candidates: CandidateData[];
      usage: {
        inputTokens: number | undefined;
        outputTokens: number | undefined;
        totalTokens: number;
      };
      custom: Cohere.NonStreamedChatResponse;
    }> => {
      let response: Cohere.NonStreamedChatResponse | undefined;
      const body = toCohereRequestBody(name, request);
      if (streamingCallback) {
        // Based on these docs: https://docs.cohere.com/docs/streaming
        const stream = await client.chatStream(body);
        let eventIndex = 0;
        for await (const event of stream) {
          const c = fromCohereStreamEvent(event, eventIndex);
          streamingCallback({
            index: c.index,
            content: c.message.content,
            custom: c.custom,
          });
          eventIndex++;
          if (event.eventType === 'stream-end') {
            response = event.response;
            break;
          }
        }
      } else {
        response = await client.chat(body);
      }
      if (response === undefined) {
        throw new Error(
          'No response from Cohere API, or stream ended unexpectedly.'
        );
      }
      return {
        candidates: [fromCohereChatResponse(response)],
        usage: {
          inputTokens: response.meta?.tokens?.inputTokens,
          outputTokens: response.meta?.tokens?.outputTokens,
          totalTokens:
            (response.meta?.tokens?.inputTokens || 0) +
            (response.meta?.tokens?.outputTokens || 0),
        },
        custom: response,
      };
    }
  );
}
