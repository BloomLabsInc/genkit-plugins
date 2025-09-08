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
import { Mistral } from '@mistralai/mistralai';
import {
  OCRRequest,
  Document as OCRDDocument,
  OCRResponse,
} from '@mistralai/mistralai/models/components';
import type { GenerateRequest, GenerateResponseData, Genkit } from 'genkit';
import { GenerationCommonConfigSchema, z } from 'genkit';
import type { ModelAction } from 'genkit/model';
import { modelRef } from 'genkit/model';

const ImageURLSchema = z.object({
  url: z.string(),
  detail: z.string().nullable().optional(),
});

const OCRSchema = GenerationCommonConfigSchema.extend({
  document: z.object({
    type: z.enum(['document_url', 'image_url']).optional(),
    documentUrl: z.string(),
    documentName: z.string().nullable().optional(),
    imageUrl: z.union([z.string(), ImageURLSchema]).optional(),
  }),
});

export const ocr = modelRef({
  name: 'mistral/ocr',
  info: {
    versions: ['mistral-ocr-latest'],
    label: 'Mistral - OCR',
    supports: {
      media: false,
      output: ['text', 'json'],
      multiturn: false,
      systemRole: false,
      tools: false,
    },
  },
  configSchema: OCRSchema,
});

function toOCRRequest(request: GenerateRequest<typeof OCRSchema>): OCRRequest {
  const docType = request.config?.document?.type || 'document_url';

  const options: OCRRequest = {
    model: 'mistral-ocr-latest',
    document:
      docType === 'document_url'
        ? {
            type: 'document_url',
            documentUrl: request.config?.document?.documentUrl || '',
            documentName: request.config?.document?.documentName || null,
          }
        : {
            type: 'image_url',
            imageUrl:
              typeof request.config?.document?.imageUrl === 'string'
                ? request.config.document.imageUrl
                : request.config?.document?.imageUrl?.url || '',
          },
  };

  (Object.keys(options) as (keyof OCRRequest)[]).forEach((k) => {
    if (options[k] === undefined) {
      delete options[k];
    }
  });
  return options;
}

function toGenerateResponse(result: OCRResponse): GenerateResponseData {
  const candidates: GenerateResponseData['candidates'] = result.pages.map(
    (page, index) => ({
      index: index,
      finishReason: 'stop',
      message: {
        role: 'model',
        content: [
          {
            text: page.markdown,
          },
          ...page.images.map((image) => ({
            media: {
              contentType: 'image/png',
              url: `data:image/png;base64,${image.imageBase64}`,
            },
          })),
        ],
      },
    })
  );
  return { candidates };
}

export function OCRModel(
  ai: Genkit,
  client: Mistral
): ModelAction<typeof OCRSchema> {
  return ai.defineModel<typeof OCRSchema>(
    {
      name: ocr.name,
      ...ocr.info,
      configSchema: ocr.configSchema,
    },
    async (request) => {
      const result = await client.ocr.process(toOCRRequest(request));
      return toGenerateResponse(result);
    }
  );
}
