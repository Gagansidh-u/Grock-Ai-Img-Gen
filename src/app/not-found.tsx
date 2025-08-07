// src/app/not-found.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = event;
        setMousePosition({ x: `${clientX}px`, y: `${clientY}px` });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-50"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x} ${mousePosition.y}, hsla(var(--primary), 0.2), transparent 40%)`,
        }}
        animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x} ${mousePosition.y}, hsla(var(--primary), 0.2), transparent 40%)`
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 1 }}
      />
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: '800px' }}>
        <motion.h1
          className="text-[12rem] font-extrabold tracking-tighter text-primary md:text-[16rem]"
          initial={{ opacity: 0, y: 50, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textShadow: '0 10px 30px hsla(var(--primary), 0.2)' }}
        >
          404
        </motion.h1>
        <motion.h2
          className="-mt-12 text-2xl font-semibold text-foreground md:-mt-16 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Page Lost in Space
        </motion.h2>
        <motion.p
          className="mt-4 max-w-md text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          It seems the page you are looking for has ventured into an unknown dimension. Let's get you back to safety.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Button asChild size="lg" className="group rounded-full font-semibold">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Go Back Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
