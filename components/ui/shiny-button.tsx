"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShinyButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export const ShinyButton = ({
    children,
    className,
    onClick,
    disabled = false,
    type = "button",
}: ShinyButtonProps) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative rounded-full px-6 py-3 font-semibold backdrop-blur-xl transition-shadow duration-300 ease-in-out",
                "bg-[var(--color-primary)] text-white",
                "hover:shadow-[0_0_40px_8px_rgba(109,90,255,0.4)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Shimmer overlay */}
            <motion.span
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
            >
                <motion.span
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.3), transparent)",
                    }}
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </motion.span>
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default ShinyButton;
