import assert from 'node:assert';
import { describe, it } from 'node:test';
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
    assert.strictEqual(toGroqRole('user'), 'user');
  });

  it('should convert model role to assistant', () => {
    assert.strictEqual(toGroqRole('model'), 'assistant');
  });

  it('should convert system role correctly', () => {
    assert.strictEqual(toGroqRole('system'), 'system');
  });

  it('should convert tool role correctly', () => {
    assert.strictEqual(toGroqRole('tool'), 'assistant');
  });

  it('should throw error for unsupported roles', () => {
    assert.throws(() => toGroqRole('unknown' as Role), {
      message: "role unknown doesn't map to a Groq role.",
    });
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
    assert.deepStrictEqual(toGroqMessages(messages), expectedOutput);
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
    console.log(`actualOutput.stop: ${actualOutput.stop}`);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(actualOutput)), // Remove undefined fields
      JSON.parse(JSON.stringify(expectedOutput))
    );
  });

  it('should handle unsupported models', () => {
    assert.throws(() => toGroqRequestBody('unsupported-model', request), {
      message: 'Unsupported model: unsupported-model',
    });
  });
});

describe('Groq Plugin', () => {
  it('should create plugin with v2 API', () => {
    const plugin = groq({ apiKey: 'test-key' });

    // Check that the plugin has the expected structure
    assert.strictEqual(plugin.name, 'groq');
    assert(typeof plugin.init === 'function');
    assert(typeof plugin.list === 'function');
  });

  it('should list available models', async () => {
    const plugin = groq({ apiKey: 'test-key' });
    const models = await plugin.list?.();

    // Check that we get a list of models
    assert(Array.isArray(models));
    assert(models.length > 0);

    // Check that each model has the expected structure
    for (const model of models) {
      assert.strictEqual((model as any).type, 'model');
      assert(typeof model.name === 'string');
      assert(model.name.startsWith('groq/'));
      assert(typeof (model as any).info === 'object');
    }
  });

  it('should initialize models', async () => {
    const plugin = groq({ apiKey: 'test-key' });
    const models = await plugin.init?.();

    // Check that we get an array of model actions
    assert(Array.isArray(models));
    assert(models.length > 0);

    // Check that each model is a function (action)
    for (const model of models) {
      assert(typeof model === 'function');
    }
  });
});
