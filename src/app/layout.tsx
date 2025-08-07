
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/hooks/use-auth';

const APP_NAME = "TryQuad AI";
const APP_DEFAULT_TITLE = "Tryquad AI - Turn Your Imagination into Images";
const APP_TITLE_TEMPLATE = "%s | TryQuad AI";
const APP_DESCRIPTION = "Transform your ideas into reality with TryQuad AI. Generate custom, high-quality images, art, and logos from text prompts. Unleash your creativity today!";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL("https://tryquad-ai.netlify.app/"),
  keywords: 'AI image generator, text to image, TryQuad AI, Grock Technologies, AI art generator, custom logos, AI visuals, creative prompts, generate images with AI, machine learning art, digital illustration, free AI art generator, online image creator, AI-powered visuals, text-to-art, image synthesis, prompt-based image generation, neural network art, diffusion models, generative art, AI design tool, create logos with AI, photorealistic AI images, anime AI generator, 3D model generator, cinematic AI art, fantasy art creator, vaporwave aesthetic, pixel art maker, sticker design AI, D&D character art, concept art generator, social media graphics, marketing content creation, AI for artists, creative AI tools, digital art software, automated design, image generation API, high-resolution AI images, unique image creation, TryQuad AI free plan, TryQuad AI pricing, AI for graphic design',
  icons: {
    icon: 'https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png',
  },
  openGraph: {
    type: "website",
    url: "https://tryquad-ai.netlify.app/",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [{
      url: "https://raw.githubusercontent.com/Gagansidh-u/Images/main/f3864b6d-bd81-4d5d-b541-356d65114494.jpeg?raw=true",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: ["https://raw.githubusercontent.com/Gagansidh-u/Images/main/f3864b6d-bd81-4d5d-b541-356d65114494.jpeg?raw=true"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
