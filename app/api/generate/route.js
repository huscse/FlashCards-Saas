import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
- Assist users of a platform designed for generating flashcards from user prompts, ensuring a professional and helpful environment.
- Help with account issues, troubleshooting, and technical support for platform features related to flashcard generation.
- Provide guidance on creating effective flashcards, best practices for study techniques, and how to optimize the use of generated content.
- Maintain a professional, empathetic tone; provide clear, concise answers; and explain relevant terms and concepts when necessary.
- Escalate complex issues or those requiring human intervention to a human support representative.


Your goal is to provide accurate, helpful, and timely assistance for users on a platform dedicated to flashcard generation.

Return in the following JSON format
{
    "flashcards": [{
        "front": str,
        "back": str
    }]
}

`;
export async function POST(req){
    const openai = OpenAI()
    const data  = await req.text()

    const completion = await openai.chat.completion.create({
        messages: [
            {role: 'system', content: 'systemPrompt'},
            {role: 'user', content: data},
        ],
        model: "gpt-4o",
        respone_format: {type: 'json_object'}
    })
    const flashcards = JSON.parse(completion[0].message.content)

    return NextResponse.json(flashcards.flashcard)
}
