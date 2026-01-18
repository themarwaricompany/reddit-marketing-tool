import React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    shimmerColor?: string;
    shimmerSize?: string;
    borderRadius?: string;
    shimmerDuration?: string;
    background?: string;
    className?: string;
    children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
    (
        {
            shimmerColor = "#00D9FF",
            shimmerSize = "0.05em",
            shimmerDuration = "3s",
            borderRadius = "8px",
            background = "#6D5AFF",
            className,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "group relative cursor-pointer overflow-hidden whitespace-nowrap px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[0.98] active:scale-[0.95]",
                    className
                )}
                style={{
                    borderRadius,
                    background,
                }}
                {...props}
            >
                {/* Shimmer container */}
                <div className="absolute inset-0 z-0 flex -translate-x-full gap-2 transition-all duration-300 group-hover:translate-x-full">
                    {/* This is a simple implementation of shimmer on hover, or we can use animation */}
                </div>

                {/* Actual shimmer animation overlay */}
                <div
                    className={cn(
                        "absolute inset-0 -z-10 animate-[shimmer_3s_infinite] bg-[linear-gradient(110deg,transparent,35%,var(--shimmer-color),45%,transparent)] bg-[length:200%_100%]"
                    )}
                    style={{
                        "--shimmer-color": shimmerColor,
                    } as React.CSSProperties}
                />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-xl bg-[var(--color-primary)]"></div>

                <div className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </div>
            </button>
        );
    }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
