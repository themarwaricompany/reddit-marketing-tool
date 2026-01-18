"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export const GlowingCard = ({
    children,
    className,
    glowColor = "var(--color-secondary)",
}: GlowingCardProps) => {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 overflow-hidden",
                className
            )}
            whileHover={{
                borderColor: glowColor,
                boxShadow: `0 0 30px ${glowColor}30`,
            }}
            transition={{ duration: 0.3 }}
        >
            {/* Glow effect on hover */}
            <motion.div
                className="absolute inset-0 opacity-0 pointer-events-none"
                style={{
                    background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}15, transparent 40%)`,
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default GlowingCard;
