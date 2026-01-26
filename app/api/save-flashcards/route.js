// Create a file at /app/api/save-flashcards/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, cards, frontColor, backColor } = await request.json();

    if (!name || !cards || cards.length === 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const db = admin.firestore();
    const docRef = await db.collection('flashcard_collections').add({
      userId,
      name,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      cards: cards.map((card) => ({
        front: card.front,
        back: card.back,
        frontColor,
        backColor,
      })),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error saving flashcards:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
