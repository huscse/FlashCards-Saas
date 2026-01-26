import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
- You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
- Create clear and concise questions for the front of the flashcard.
- Provide accurate and informative answers for the back of the flashcard.
- Ensure that each flashcard focuses on a single concept or piece of information.
- Use simple language to make the flashcards accessible to a wide range of learners.
- Include a variety of question types, such as definitions, examples, comparisons, and applications.
- Avoid overly complex or ambiguous phrasing in both questions and answers. 
- When appropriate, use memory aids to help reinforce the information.
- Tailor the difficulty level of the flashcards to the user's specified preferences.
- If given a body of text, extract the most important and relevant information for the flashcards.
- Only generate 10 flashcards.

Return in the following JSON format:
{
    "flashcards": [{
        "front": "string",
        "back": "string"
    }]
}
`;

export async function POST(req) {
  console.log('🔵 API route called');

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 },
      );
    }

    console.log('🔵 API key found');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('🔵 Request body:', body);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    const { text, frontColor, backColor } = body;

    if (!text || !text.trim()) {
      console.error('❌ No text provided');
      return NextResponse.json(
        { error: 'Text prompt is required' },
        { status: 400 },
      );
    }

    console.log('🔵 Calling OpenAI API...');

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    });

    console.log('✅ OpenAI Response received');
    console.log('📄 Content:', completion.choices[0].message.content);

    // Parse the response
    let flashcards;
    try {
      const parsedResponse = JSON.parse(completion.choices[0].message.content);
      flashcards = parsedResponse.flashcards;

      if (!Array.isArray(flashcards)) {
        throw new Error('Flashcards is not an array');
      }
    } catch (e) {
      console.error('❌ Failed to parse OpenAI response:', e);
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 },
      );
    }

    // Add colors to flashcards
    const flashcardsWithColors = flashcards.map((card) => ({
      ...card,
      frontColor: frontColor || '#1E1E1E',
      backColor: backColor || '#FF2D55',
    }));

    console.log('✅ Returning', flashcardsWithColors.length, 'flashcards');

    return NextResponse.json(flashcardsWithColors);
  } catch (error) {
    console.error('❌ ERROR in /api/generate:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    return NextResponse.json(
      {
        error: 'Failed to generate flashcards',
        details: error.message,
        type: error.name,
      },
      { status: 500 },
    );
  }
}
