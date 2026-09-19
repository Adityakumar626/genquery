import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural
                        language.

    You have access to following tools:
        1. db tool - call this tool to query the database.
        2. schema tool - call this tool to get database schema which will help you to write query.

    Rules:
        - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP) 
        - Always use the schema provided by the schema tool 
        - Return valid SQLite syntax

    Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: google("gemini-3.7-flash"),
    instructions: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      db: tool({
        description: "Call this tool to query a databse.",
        inputSchema: z.object({
          query: z.string().describe("The SQL query to be ran."),
        }),
        execute: async ({ query }) => {
          console.log("Our Query :", query);
          return query;
        },
      }),
      schema: tool({
        description: "Call this tool to get databse schema information.",
        inputSchema: z.object({}),
        execute: async ({}) => {
          return `CREATE TABLE products (
                        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                        name text NOT NULL,
                        category text NOT NULL,
                        price real NOT NULL,
                        stock integer DEFAULT 0 NOT NULL,
                        created_at text DEFAULT CURRENT_TIMESTAMP
                    );

--> statement-breakpoint

CREATE TABLE sales (
            id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            product_id integer NOT NULL,
            quantity text NOT NULL,
            total_amount real NOT NULL,
            sale_date text DEFAULT CURRENT_TIMESTAMP,
            costumer_name text NOT NULL,
            region text NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
    );`;
        },
      }),
    },
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
