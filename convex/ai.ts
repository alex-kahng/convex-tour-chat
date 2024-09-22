import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const chat = action({
    args: {
        messageBody: v.string(),
    },
    handler: async (ctx, args) => {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a terse bot in a group chat responding to questions with 1-sentence answers.",
                    },
                    {
                        role: "user",
                        content: args.messageBody,
                    }
                ],
            }),
        });

        const json = await response.json();
        console.log(json);
        const messageContent = json.choices[0].message?.content;

        await ctx.runMutation(api.messages.send, {
            author: "AI",
            body: messageContent || "Sorry, I don't have an answer for that.",
        });
    },
});