"use client";

import { motion } from "motion/react";

export default function AnimatedCircles() {
  return (
    <>
      <motion.div
        className="absolute top-0 right-0 size-64 rounded-full bg-linear-to-br from-chart-2/20 to-chart-4/20 blur-3xl"
        animate={{
          x: [0, 100, -50, 50, 0],
          y: [0, -50, 100, -50, 0],
          scale: [1, 1.2, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 hidden size-80 rounded-full bg-linear-to-tr from-chart-3/20 to-chart-1/20 blur-3xl md:block"
        animate={{
          x: [0, -80, 120, -40, 0],
          y: [0, 80, -60, 40, 0],
          scale: [1, 0.9, 1.1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 hidden size-48 rounded-full bg-linear-to-r from-chart-4/20 to-chart-5/20 blur-3xl md:block"
        animate={{
          x: [0, 150, -120, 80, 0],
          y: [0, -100, 80, -120, 0],
          scale: [1, 1.3, 0.7, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
        }}
      />
    </>
  );
}
