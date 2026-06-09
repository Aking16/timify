"use client";

import { motion } from "motion/react";

import PulsatingDots from "../custom-ui/pulsating-loader";

export default function PageLoading() {
  return (
    <div className="flex justify-center items-center min-h-svh bg-linear-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated decorative circles that move around */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-amber-500/20 to-rose-500/20 rounded-full blur-3xl"
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
        className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-orange-500/20 to-amber-500/20 rounded-full blur-3xl hidden md:block"
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
        className="absolute top-1/2 left-1/2 w-48 h-48 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl hidden md:block"
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

      {/* Main content */}
      <div className="relative group">
        {/* Main card */}
        <div className="relative flex gap-8 flex-col items-center bg-card/50 backdrop-blur-sm border  p-10 rounded-2xl shadow-2xl">
          {/* Icon + Loader combination */}
          <div className="relative">
            <div className="relative">
              <PulsatingDots color="#C37E62" />
            </div>
          </div>

          {/* Text with gradient */}
          <div className="text-center space-y-3">
            <p className="animate-pulse text-xl font-bold text-primary"> در حال بارگذاری...</p>
            <p className="text-xs text-muted-foreground">لطفاً چند لحظه صبر کنید</p>
          </div>
        </div>
      </div>
    </div>
  );
}
