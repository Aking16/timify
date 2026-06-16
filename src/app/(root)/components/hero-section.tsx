"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import AnimatedCircles from "../../../components/shared/animated-circles";

const m = motion;

export default function HeroSection() {
  return (
    <section className="relative px-4 pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-4xl text-center"
      >
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Badge variant="outline" className="mb-6 text-sm">
            ردیاب زمان سبک و سریع
          </Badge>
        </m.div>
        <m.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 text-4xl font-bold leading-tight md:text-6xl"
        >
          زمان خود را با
          <span className="text-primary"> تایمیفای </span>
          مدیریت کنید
        </m.h1>
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          یک ابزار ساده و قدرتمند برای ثبت و مدیریت زمان فعالیت‌های روزانه شما. مناسب برای
          فریلنسرها، تیم‌ها و هر کسی که می‌خواهد بهره‌وری خود را افزایش دهد.
        </m.p>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <Link href="/auth?tab=register">شروع کنید رایگان</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth">ورود به حساب</Link>
          </Button>
        </m.div>
      </motion.div>
      <AnimatedCircles />
    </section>
  );
}
