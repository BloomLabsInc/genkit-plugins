import { GenerateRequest, MessageData, Role } from 'genkit';
import {
  toGroqRequestBody,
  toGroqRole,
  toGroqMessages,
} from '../src/groq_models';
import { ChatCompletionCreateParamsBase } from 'groq-sdk/resources/chat/completions.mjs';
import { groq } from '../src/index';

describe('toGroqRole', () => {
  it('should convert user role correctly', () => {
    expect(toGroqRole('user')).toBe('user');
  });

  it('should convert model role to assistant', () => {
    expect(toGroqRole('model')).toBe('assistant');
  });

  it('should convert system role correctly', () => {
    expect(toGroqRole('system')).toBe('system');
  });

  it('should convert tool role correctly', () => {
    expect(toGroqRole('tool')).toBe('assistant');
  });

  it('should throw error for unsupported roles', () => {
    expect(() => toGroqRole('unknown' as Role)).toThrow(
      "role unknown doesn't map to a Groq role."
    );
  });
});

describe('toGroqMessages', () => {
  const messages: MessageData[] = [
    { role: 'user', content: [{ text: 'Hello, world!' }] },
    { role: 'model', content: [{ text: 'How can I assist you today?' }] },
  ];

  it('should convert message data to Groq message format', () => {
    const expectedOutput = [
      { role: 'user', content: 'Hello, world!' },
      { role: 'assistant', content: 'How can I assist you today?' },
    ];
    expect(toGroqMessages(messages)).toEqual(expectedOutput);
  });
});

describe('toGroqRequestBody', () => {
  const request: GenerateRequest = {
    messages: [
      { role: 'user', content: [{ text: 'Tell a joke about dogs.' }] },
    ],
    tools: [],
    output: { format: 'text' },
    config: {
      temperature: 0.7,
      stopSequences: ['\n'],
      maxOutputTokens: 100,
      topP: 0.9,
      frequencyPenalty: 0.5,
      logitBias: { science: 12, technology: 8, politics: -5, sports: 3 },
      seed: 42,
      topLogprobs: 10,
      user: 'exampleUser123',
    },
  };

  it('should convert GenerateRequest to Groq request body', () => {
    const expectedOutput: ChatCompletionCreateParamsBase = {
      messages: [{ role: 'user', content: 'Tell a joke about dogs.' }],
      model: 'llama3-8b-8192', // Match model name format in SUPPORTED_GROQ_MODELS
      temperature: 0.7,
      max_tokens: 100,
      top_p: 0.9,
      stop: ['\n'],
      frequency_penalty: 0.5,
      logit_bias: { science: 12, technology: 8, politics: -5, sports: 3 },
      seed: 42,
      top_logprobs: 10,
      user: 'exampleUser123',
      response_format: { type: 'text' },
    };

    const actualOutput = toGroqRequestBody('llama-3-8b', request);
    // console.log(`actualOutput.stop: ${actualOutput.stop}`);
    expect(
      JSON.parse(JSON.stringify(actualOutput)) // Remove undefined fields
    ).toEqual(JSON.parse(JSON.stringify(expectedOutput)));
  });

  it('should handle unsupported models', () => {
    expect(() => toGroqRequestBody('unsupported-model', request)).toThrow(
      'Unsupported model: unsupported-model'
    );
  });
});

describe('Groq Plugin', () => {
  it('should create plugin with v2 API', () => {
    const plugin = groq({ apiKey: 'test-key' });

    // Check that the plugin has the expected structure
    expect(plugin.name).toBe('groq');
    expect(typeof plugin.init).toBe('function');
    expect(typeof plugin.list).toBe('function');
  });

  it('should list available models', async () => {
    const plugin = groq({ apiKey: 'test-key' });
    const models = await plugin.list?.();

    expect(Array.isArray(models)).toBe(true);
    expect(models?.length).toBeGreaterThan(0);

    if (models) {
      for (const model of models) {
        expect((model as any).type).toBe('model');
        expect(typeof model.name).toBe('string');
        expect((model as any).namespace).toBe('groq');
        expect(typeof (model as any).info).toBe('object');
      }
    }
  });

  it('should initialize models', async () => {
    const plugin = groq({ apiKey: 'test-key' });
    const models = await plugin.init?.();

    expect(Array.isArray(models)).toBe(true);
    expect(models?.length).toBeGreaterThan(0);

    if (models) {
      for (const model of models) {
        expect(typeof model).toBe('function');
      }
    }
  });
});
