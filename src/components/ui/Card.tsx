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
  gold: 'hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  blue: 'hover:border-sky-500/60 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]',
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
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border border-[#222222] bg-[#111111] transition-all duration-300',
        glass && 'backdrop-blur-sm bg-[#111111]/80',
        hover && 'cursor-default',
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
