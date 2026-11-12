'use client';

import { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlowColor = 'gold' | 'blue' | 'none';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: GlowColor;
  hover?: boolean;
  glass?: boolean;
  children: React.ReactNode;
}

const glowStyles: Record<GlowColor, string> = {
  gold: 'hover:border-[#0DCB3D]/60 hover:shadow-[0_0_30px_rgba(13,203,61,0.25)]',
  blue: 'hover:border-[#0DCB3D]/60 hover:shadow-[0_0_30px_rgba(13,203,61,0.25)]',
  none: '',
};

export function Card({
  glow = 'none',
  hover = false,
  glass = false,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl border border-white/[0.08] bg-[#0c111a]/80 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/40',
        hover && 'hover:border-[#0DCB3D]/50 hover:shadow-2xl hover:shadow-black/60',
        hover && glowStyles[glow],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0 flex items-center', className)} {...props}>
      {children}
    </div>
  );
}
