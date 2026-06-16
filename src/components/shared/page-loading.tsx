"use client";

import PulsatingDots from "../custom-ui/pulsating-loader";
import AnimatedCircles from "./animated-circles";

export default function PageLoading() {
  return (
    <div className="flex justify-center items-center min-h-svh bg-linear-to-br from-background via-background to-muted/20 relative overflow-hidden">
      <AnimatedCircles />

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
