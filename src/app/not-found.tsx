
// src/app/not-found.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function NotFoundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: '50%', y: '50%' });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [-15, 15]);
  const rotateY = useTransform(mouseX, [0, 1], [15, -15]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (event.clientX - left) / width;
        const y = (event.clientY - top) / height;

        animate(mouseX, x, { type: 'spring', stiffness: 100, damping: 20, restDelta: 0.001 });
        animate(mouseY, y, { type: 'spring', stiffness: 100, damping: 20, restDelta: 0.001 });
        
        setMousePosition({ x: `${event.clientX}px`, y: `${event.clientY}px` });
      }
    };
    
    const handleMouseLeave = () => {
        animate(mouseX, 0.5, { type: 'spring', stiffness: 100, damping: 20 });
        animate(mouseY, 0.5, { type: 'spring', stiffness: 100, damping: 20 });
    }

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-60"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x} ${mousePosition.y}, hsla(var(--primary), 0.25), transparent 40%)`,
        }}
        animate={{
            background: `radial-gradient(800px circle at ${mousePosition.x} ${mousePosition.y}, hsla(var(--primary), 0.25), transparent 40%)`
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 1 }}
      />
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <h1
          className="text-[12rem] font-extrabold tracking-tighter text-primary md:text-[16rem] flex"
          style={{ textShadow: '0 10px 40px hsla(var(--primary), 0.3)' }}
        >
          {['4', '0', '4'].map((char, index) => (
             <motion.span
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={{ 
                opacity: 1, 
                y: [0, -15, 0],
                rotateX: 0,
                transition: {
                    delay: index * 0.15,
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: index * 0.15 + 0.5
                    },
                    opacity: { duration: 0.8, ease: 'easeOut' },
                    rotateX: { duration: 0.8, ease: 'easeOut' },
                }
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        <motion.h2
          className="-mt-12 text-2xl font-semibold text-foreground md:-mt-16 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Page Lost in Space
        </motion.h2>
        <motion.p
          className="mt-4 max-w-md text-center text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          It seems the page you are looking for has ventured into an unknown dimension. Let's get you back to safety.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Button asChild size="lg" className="group rounded-full font-semibold">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Go Back Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
