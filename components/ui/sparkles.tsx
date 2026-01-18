"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparkleProps {
    color?: string;
    size?: number;
    style?: React.CSSProperties;
}

const Sparkle = ({ color = "#00D9FF", size = 20, style }: SparkleProps) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            fill="none"
            style={style}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: 1, rotate: 180, opacity: 1 }}
            exit={{ scale: 0, rotate: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <path
                d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                fill={color}
            />
        </motion.svg>
    );
};

interface SparklesProps {
    children: React.ReactNode;
    className?: string;
    sparklesCount?: number;
    colors?: string[];
}

const generateSparkle = (colors: string[]) => {
    return {
        id: Math.random().toString(36).substring(7),
        createdAt: Date.now(),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 10,
        style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            position: "absolute" as const,
            zIndex: 20,
        },
    };
};

export const Sparkles = ({
    children,
    className,
    sparklesCount = 6,
    colors = ["#00D9FF", "#6D5AFF", "#00FF88"],
}: SparklesProps) => {
    const [sparkles, setSparkles] = useState<ReturnType<typeof generateSparkle>[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const newSparkle = generateSparkle(colors);

            setSparkles((prev) => {
                // Remove old sparkles
                const filtered = prev.filter((s) => now - s.createdAt < 750);
                if (filtered.length < sparklesCount) {
                    return [...filtered, newSparkle];
                }
                return filtered;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [sparklesCount, colors]);

    return (
        <span className={cn("relative inline-block", className)}>
            <AnimatePresence>
                {sparkles.map((sparkle) => (
                    <Sparkle
                        key={sparkle.id}
                        color={sparkle.color}
                        size={sparkle.size}
                        style={sparkle.style}
                    />
                ))}
            </AnimatePresence>
            <span className="relative z-10">{children}</span>
        </span>
    );
};

export default Sparkles;
