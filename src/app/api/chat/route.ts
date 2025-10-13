import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  streamText,
  stepCountIs,
} from "ai";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { generateUUID } from "@/lib/utils";
import { isProductionEnvironment } from "@/lib/constants";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { geolocation } from "@vercel/functions";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { getRelevantChunks } from "./get-context";

export const maxDuration = 60;

// let globalStreamContext: ResumableStreamContext | null = null;

// export function getStreamContext() {
//   if (!globalStreamContext) {
//     try {
//       globalStreamContext = createResumableStreamContext({
//         waitUntil: after,
//       });
//     } catch (error) {
//       //@ts-expect-error ignore next line
//       if (error.message.includes("REDIS_URL")) {
//         console.log(
//           " > Resumable streams are disabled due to missing REDIS_URL"
//         );
//       } else {
//         console.error(error);
//       }
//     }
//   }

//   return globalStreamContext;
// }

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  let json;
  try {
    json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    console.error("Request parsing error:", error);
    console.error("Request body:", JSON.stringify(json, null, 2));
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    //@ts-expect-error ignore next line
    const {
      id,
      message,
      messages = [], // Accept messages from client instead of database
    }: {
      id: string;
      message: ChatMessage;
      messages?: ChatMessage[];
    } = requestBody;

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    // Use messages from client instead of database
    const uiMessages = [...messages, message];

    // Get context chunks asynchronously to avoid blocking

    //@ts-expect-error ignore next line
    const contextPromise = getRelevantChunks(message.parts[0]?.text).catch(
      () => []
    );

    const stream = createUIMessageStream({
      execute: async ({ writer: dataStream }) => {
        // Wait for context chunks
        const contextChunks = await contextPromise;

        // Build a system-level context message from relevant chunks
        const contextMessage: ChatMessage = {
          id: generateUUID(),
          role: "system",
          parts: [
            {
              type: "text",
              text:
                contextChunks.length > 0
                  ? contextChunks.join("\n\n")
                  : "You are Zuhayr Tariq, a Top Rated Full Stack Web Developer specializing in Next.js, React, Node.js, and AI-powered applications. Help users with web development questions and showcase your expertise.",
            },
          ],
        };

        // Prepend context to messages
        const contextInjectedMessages = [contextMessage, ...uiMessages];

        const result = streamText({
          model: openai("gpt-4o-mini"), // Using faster model
          system: systemPrompt({
            selectedChatModel: "chat-model",
            requestHints,
          }),
          messages: convertToModelMessages(contextInjectedMessages),
          stopWhen: stepCountIs(3), // Reduced from 5 for faster responses
          experimental_transform: smoothStream({ chunking: "word" }),
          // maxTokens: 1000, // Limit response length for faster generation
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        // No database operations - just log for debugging
        console.log("Chat completed:", {
          chatId: id,
          messageCount: messages.length,
        });
      },
      onError: (e) => {
        console.log("Error", e);
        return "Oops, an error occurred!";
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Unexpected error in chat route:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
