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

import { describe, it, expect } from '@jest/globals';
import { genkit, z } from 'genkit';
import { toToolDefinition } from 'genkit/tool';
import type { ToolDefinition } from 'genkit/model';

import { toCohereTool, jsonSchemaToPythonType } from './command';

describe('jsonSchemaToPythonType', () => {
  const testCases: {
    jsonSchema: Record<string, any>;
    expectedPythonType: string;
  }[] = [
    {
      jsonSchema: { type: 'string' },
      expectedPythonType: 'str',
    },
    {
      jsonSchema: { type: 'number' },
      expectedPythonType: 'float',
    },
    {
      jsonSchema: { type: 'integer' },
      expectedPythonType: 'int',
    },
    {
      jsonSchema: { type: 'boolean' },
      expectedPythonType: 'bool',
    },
    {
      jsonSchema: { type: 'array' },
      expectedPythonType: 'List',
    },
    {
      jsonSchema: { type: 'object' },
      expectedPythonType: 'Dict',
    },
    {
      jsonSchema: { type: 'null' },
      expectedPythonType: 'None',
    },
  ];

  for (const test of testCases) {
    it(`should convert JSON schema type "${test.jsonSchema.type}" to Python type "${test.expectedPythonType}"`, () => {
      expect(jsonSchemaToPythonType(test.jsonSchema)).toBe(
        test.expectedPythonType
      );
    });
  }

  it('should throw an error if the JSON schema type is not supported', () => {
    expect(() => jsonSchemaToPythonType({ type: 'unsupported' })).toThrow(
      'Unsupported JSON schema type: {"type":"unsupported"}'
    );
  });
});

describe('toCohereTool', () => {
  // Initialize genkit without any plugins
  const ai = genkit({});

  // Define a tool using the defineTool method
  const tool = ai.defineTool(
    {
      name: 'getStockPrice',
      description: 'Get the price for the given stock ticker.',
      inputSchema: z.object({
        symbol: z.string(),
        timestamp: z.number().int().optional(),
      }),
      outputSchema: z.number(),
    },
    async () => 123
  );

  const testCases: {
    tool: ToolDefinition;
  }[] = [
    {
      // Convert the defined tool to ToolDefinition using toToolDefinition
      tool: toToolDefinition(tool),
    },
  ];

  for (const test of testCases) {
    it(`should convert tool "${test.tool.name}" to Cohere Python tool`, () => {
      // Test the conversion to a Cohere tool format
      expect(toCohereTool(test.tool)).toStrictEqual({
        name: 'getStockPrice',
        description: 'Get the price for the given stock ticker.',
        parameterDefinitions: {
          symbol: {
            type: 'str',
            required: true,
          },
          timestamp: {
            type: 'int',
            required: false,
          },
        },
      });
    });
  }
});
