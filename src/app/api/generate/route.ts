// src/app/api/generate/route.ts
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image';
import { getUserProfile } from '@/lib/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateImageInput;
    
    // Ensure the input is valid before passing to the flow
    if (!body.prompt && (!body.referenceImages || body.referenceImages.length === 0)) {
        return NextResponse.json({ error: 'A prompt or reference image is required.' }, { status: 400 });
    }

    let userPlan: GenerateImageInput['plan'] = 'Free';
    let userApiKey: string | undefined;

    if (body.userId) {
      const userProfile = await getUserProfile(body.userId);
      if (userProfile) {
        userPlan = userProfile.plan;
        userApiKey = userProfile.apiKey;
      }
    }

    if (!userApiKey) {
      return NextResponse.json({ error: 'API key not configured for this user. Please add it in your profile.' }, { status: 403 });
    }

    const result = await generateImage({
      prompt: body.prompt,
      style: body.style,
      aspectRatio: body.aspectRatio,
      numberOfImages: body.numberOfImages,
      referenceImages: body.referenceImages,
      userId: body.userId,
      plan: userPlan,
      userApiKey: userApiKey,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API route error:', error);
    // Provide a generic error message to the client
    return NextResponse.json({ error: error.message || 'Failed to generate image. Please try again later.' }, { status: 500 });
  }
}
