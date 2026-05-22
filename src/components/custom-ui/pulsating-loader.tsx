import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface PulsatingDotsProps {
  className?: string;
  color?: string;
}

export default function PulsatingDots({ className, color }: PulsatingDotsProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex space-x-2.5">
        <motion.div
          className={"h-2.5 w-2.5 rounded-full bg-[#66FF9A]"}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className="h-2.5 w-2.5 rounded-full bg-[#66FF9A]"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.3,
          }}
        />
        <motion.div
          className="h-2.5 w-2.5 rounded-full bg-[#66FF9A]"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.6,
          }}
        />
      </div>
    </div>
  );
}
