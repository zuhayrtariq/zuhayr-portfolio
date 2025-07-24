import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  streamText,
  stepCountIs,
} from "ai";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import {
  createStreamId,
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { isProductionEnvironment } from "@/lib/constants";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { geolocation, ipAddress } from "@vercel/functions";
// import {
//   // createResumableStreamContext,
//   // type ResumableStreamContext,
// } from "resumable-stream";
// import { after } from "next/server";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import { openai } from "@ai-sdk/openai";

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

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    console.log("Error:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
    }: {
      id: string;
      message: ChatMessage;
    } = requestBody;

    const ip = ipAddress(request) || "unknown";

    const chat = await getChatById({ id });

    if (!chat) {
      await saveChat({
        id,
      });
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          ip,
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    console.log("CALLED");
    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: openai("gpt-4.1-nano"),
          system: systemPrompt({
            selectedChatModel: "chat-model",
            requestHints,
          }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_transform: smoothStream({ chunking: "word" }),

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
        await saveMessages({
          messages: messages.map((message) => ({
            id: message.id,
            ip,
            role: message.role,
            parts: message.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });
      },
      onError: (e) => {
        console.log("Error", e);
        return "Oops, an error occurred!";
      },
    });

    // const streamContext = getStreamContext();

    // if (streamContext) {
    //   return new Response(
    //     await streamContext.resumableStream(streamId, () =>
    //       stream.pipeThrough(new JsonToSseTransformStream())
    //     )
    //   );
    // }
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Unexpected error in chat route:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
