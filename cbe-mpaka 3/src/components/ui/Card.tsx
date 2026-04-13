import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from './Button';

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm",
      elevated: "bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none",
      outlined: "bg-transparent border-2 border-slate-200 dark:border-slate-700",
    };

    return (
      <motion.div
        ref={ref}
        className={cn("rounded-[20px] p-4 sm:p-5 overflow-hidden", variants[variant], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";
