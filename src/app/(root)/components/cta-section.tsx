"use client";

import Link from "next/link";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="border-t px-4 py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">همین حالا شروع کنید</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          ثبت‌نام رایگان است و کمتر از یک دقیقه طول می‌کشد.
        </p>
        <Button size="lg" asChild>
          <Link href="/auth?tab=register">ثبت‌نام رایگان</Link>
        </Button>
      </div>
    </motion.section>
  );
}
