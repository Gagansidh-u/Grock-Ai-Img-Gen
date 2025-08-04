// A Genkit flow for voice conversation with Grock AI.

'use server';

/**
 * @fileOverview A voice conversation AI agent.
 *
 * - voiceConversation - A function that handles the voice conversation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VoiceConversationInputSchema = z.object({
  query: z.string().describe('The text query for the voice conversation.'),
  voice: z.string().optional().default('Algenib').describe('The voice to use for the conversation.'),
});
export type VoiceConversationInput = z.infer<typeof VoiceConversationInputSchema>;

const VoiceConversationOutputSchema = z.object({
  media: z.string().describe('The audio data URI in WAV format.'),
});
export type VoiceConversationOutput = z.infer<typeof VoiceConversationOutputSchema>;

export async function voiceConversation(input: VoiceConversationInput): Promise<VoiceConversationOutput> {
  return voiceConversationFlow(input);
}

const voiceConversationFlow = ai.defineFlow(
  {
    name: 'voiceConversationFlow',
    inputSchema: VoiceConversationInputSchema,
    outputSchema: VoiceConversationOutputSchema,
  },
  async ({ query, voice }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: voice || 'Algenib'},
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
