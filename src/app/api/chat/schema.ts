import { z } from "zod";

const textPartSchema = z.object({
  type: z.enum(["text"]),
  text: z.string().min(1).max(2000),
});

const filePartSchema = z.object({
  type: z.enum(["file"]),
  mediaType: z.enum(["image/jpeg", "image/png"]),
  name: z.string().min(1).max(100),
  url: z.string().url(),
});

// Add support for AI SDK generated parts
const stepStartPartSchema = z.object({
  type: z.enum(["step-start"]),
  stepId: z.string().optional(),
  stepName: z.string().optional(),
});

const stepEndPartSchema = z.object({
  type: z.enum(["step-end"]),
  stepId: z.string().optional(),
  stepName: z.string().optional(),
});

const reasoningPartSchema = z.object({
  type: z.enum(["reasoning"]),
  reasoning: z.string().optional(),
});

const toolCallPartSchema = z.object({
  type: z.enum(["tool-call"]),
  toolCallId: z.string().optional(),
  toolName: z.string().optional(),
  args: z.any().optional(),
});

const toolResultPartSchema = z.object({
  type: z.enum(["tool-result"]),
  toolCallId: z.string().optional(),
  toolName: z.string().optional(),
  result: z.any().optional(),
});

const partSchema = z.union([
  textPartSchema,
  filePartSchema,
  stepStartPartSchema,
  stepEndPartSchema,
  reasoningPartSchema,
  toolCallPartSchema,
  toolResultPartSchema,
  // Generic part schema for any other types
  z
    .object({
      type: z.string(),
    })
    .passthrough(), // Allow any additional properties
]);

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(["user"]),
    parts: z.array(partSchema),
  }),
  messages: z
    .array(
      z
        .object({
          id: z.string().uuid(),
          role: z.string(), // Allow any role type
          parts: z.array(partSchema),
        })
        .passthrough() // Allow any additional properties
    )
    .optional(),
  // selectedChatModel: z.enum(['chat-model', 'chat-model-reasoning']),
  // selectedVisibilityType: z.enum(['public', 'private']),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
