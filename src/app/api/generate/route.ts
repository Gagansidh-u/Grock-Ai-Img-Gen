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
    if (body.userId) {
      const userProfile = await getUserProfile(body.userId);
      if (userProfile) {
        userPlan = userProfile.plan;
      }
    }

    const result = await generateImage({
      prompt: body.prompt,
      style: body.style,
      aspectRatio: body.aspectRatio,
      numberOfImages: body.numberOfImages,
      referenceImages: body.referenceImages,
      userId: body.userId,
      plan: userPlan
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API route error:', error);
    // Provide a generic error message to the client
    return NextResponse.json({ error: 'Failed to generate image. Please try again later.' }, { status: 500 });
  }
}
