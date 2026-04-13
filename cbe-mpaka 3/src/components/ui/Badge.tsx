import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'accent' | 'danger' | 'success';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-700",
      primary: "bg-[#E3F2FD] text-[#0D47A1]",
      accent: "bg-[#FFF8E1] text-[#F57F17]",
      danger: "bg-red-100 text-red-700",
      success: "bg-emerald-100 text-emerald-700",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";
