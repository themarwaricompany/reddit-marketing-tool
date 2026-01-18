"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
    children,
    duration = 2000,
    className,
    containerClassName,
    borderRadius = "1.75rem",
    as: Component = "button",
    ...otherProps
}: {
    children: React.ReactNode;
    duration?: number;
    className?: string;
    containerClassName?: string;
    borderRadius?: string;
    as?: React.ElementType;
    [key: string]: unknown;
}) => {
    return (
        <Component
            className={cn(
                "bg-transparent relative text-xl p-[1px] overflow-hidden",
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <MovingBorderGradient duration={duration} />
            </div>
            <div
                className={cn(
                    "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
                style={{
                    borderRadius: `calc(${borderRadius} * 0.96)`,
                }}
            >
                {children}
            </div>
        </Component>
    );
};

const MovingBorderGradient = ({ duration }: { duration: number }) => {
    return (
        <motion.div
            style={{
                backgroundImage: `radial-gradient(var(--color-secondary) 40%, transparent 60%)`,
                position: "absolute",
                width: "300%",
                height: "300%",
                left: "-100%",
                top: "-100%",
            }}
            animate={{
                rotate: 360,
            }}
            transition={{
                duration: duration / 1000,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
};

export default MovingBorder;
