
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/hooks/use-auth';

const APP_NAME = "TryQuad AI";
const APP_DEFAULT_TITLE = "Tryquad AI - Turn Your Imagination into Images";
const APP_TITLE_TEMPLATE = "%s | TryQuad AI";
const APP_DESCRIPTION = "Generate stunning images from text prompts with Tryquad Al. Fast, creative, and intuitive - turn your ideas into art using advanced Al.";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL("https://tryquad-ai.netlify.app/"),
  keywords: 'Tryquad AI, AI image generator, generate images from text, text to image AI, AI-generated images, AI art generator, prompt-based image generation, AI image creator, create art with AI, free AI art generator, text prompt to image, realistic AI image generator, AI drawing generator, AI image maker, futuristic AI art, AI for digital art, AI art online, prompt art generator, AI art from text, generate AI art, convert text to image, AI concept art generator, AI visual generator, AI image design tool, AI art web app, AI creative tool, AI art creator, AI illustration generator, prompt-based art, create images with AI, image generation website, web AI art generator, Tryquad AI generator, Tryquad image AI, best AI image site, image generator from prompt, open source AI art, advanced AI image generator, Tryquad text-to-image, image generator from idea, creative AI image tool, AI image production, AI visual storytelling, creative AI software, digital art generator, prompt to art generator, image AI free, text to illustration AI, next-gen AI art, generative AI tool, art generator online, AI design generator, image generation using AI, AI tool for designers, AI art tool for creatives, artistic AI generator, AI image app, Tryquad platform, AI image system, neural image generator, AI canvas generator, photo AI from prompt, AI-generated visuals, AI-generated illustrations, prompt image AI, AI for creative projects, AI image prompt engine, Tryquad create images, AI picture creator, high-resolution AI art, AI prompt builder, generative art platform, AI sketch generator, creative AI tool online, AI-powered art, Tryquad AI art studio, image AI prompt tool, instant AI image generator, Tryquad visual AI, AI creativity tool, web-based AI image tool, AI photo generation app, create concept art AI, Tryquad creative AI, Tryquad art generator, image prompt creator, ultra-fast AI image maker, AI visual artist tool, AI picture designer, AI image magic, prompt-to-art AI, hyperreal AI images, AI photo from prompt, visual story AI, prompt-driven image maker, Tryquad visual generator, futuristic image tool, smart image generator, Tryquad AI pictures, next-level image creation, generate stunning images, AI image from imagination, AI that turns ideas into art, fast AI image generator, intuitive AI image creator, advanced AI image tool, Tryquad AI text prompt generator',
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
