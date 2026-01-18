"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
    children: string;
    className?: string;
    shimmerWidth?: number;
}

export const TextShimmer = ({
    children,
    className,
    shimmerWidth = 100,
}: TextShimmerProps) => {
    return (
        <motion.span
            className={cn(
                "inline-flex animate-shimmer bg-clip-text text-transparent",
                className
            )}
            style={{
                backgroundImage: `linear-gradient(90deg, var(--color-text-primary) 0%, var(--color-secondary) 50%, var(--color-text-primary) 100%)`,
                backgroundSize: `${shimmerWidth}% 100%`,
            }}
            animate={{
                backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
                duration: 8,
                ease: "linear",
                repeat: Infinity,
            }}
        >
            {children}
        </motion.span>
    );
};

export default TextShimmer;
