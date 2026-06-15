"use client";

import { motion } from "motion/react";

import { steps } from "./data";

const m = motion;

export default function HowItWorksSection() {
  return (
    <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">چگونه کار می‌کند</h2>
          <p className="text-muted-foreground">در سه قدم ساده شروع کنید</p>
        </m.div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <m.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="absolute top-8 right-0 hidden h-px w-full bg-border md:block" />
              )}
              <div className="relative mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
